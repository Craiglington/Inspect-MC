import { NgClass } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  ViewChild,
  WritableSignal
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Store } from "@ngrx/store";
import { debounceTime, Subscription } from "rxjs";
import { MapColors } from "../../constants/map-colors";
import { blocksOnlyMapPalette } from "../../constants/map-palettes/blocks-only-palette";
import { noWaterMapPalette } from "../../constants/map-palettes/no-water-palette";
import { originalMapPalette } from "../../constants/map-palettes/original-palette";
import { Chunk } from "../../models/chunk";
import { ChunkMapData } from "../../models/chunk-map-data";
import { Coords } from "../../models/coords";
import { Dimensions } from "../../models/dimensions";
import { RGBAColor } from "../../models/map-color";
import { MapPalette } from "../../models/map-palette";
import { AnvilService } from "../../services/anvil/anvil-service";
import { FileReaderService } from "../../services/file-reader/file-reader-service";
import {
  LocalStorageKey,
  LocalStorageService
} from "../../services/local-storage/local-storage";
import { worldFilesFeature } from "../../store/world-files/world-files.feature";
import { WorldFilesState } from "../../store/world-files/world-files.state";
import { NoDataComponent } from "../no-data/no-data";
import { CoordInput } from "./coord-input/coord-input";
import {
  MapDialogComponent,
  MapDialogData,
  MapDimensionType,
  MapPaletteType
} from "./map-dialog/map-dialog";
import { LruEvictionMap } from "../../utils/lru-eviction-map";

@Component({
  selector: "app-map",
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatTooltipModule,
    CoordInput,
    NgClass,
    NoDataComponent
  ],
  templateUrl: "./map.html",
  styleUrl: "./map.scss"
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  // Injection dependencies.
  private readonly fileReaderService = inject(FileReaderService);
  private readonly anvilService = inject(AnvilService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);

  protected title = "World Maps";
  protected description = "Interactive maps of all three Minecraft dimensions.";

  // Constants.
  private readonly CHUNK_LENGTH = 16; // Minecraft blocks/map pixels
  private readonly BLOCKS_IN_CHUNK = this.CHUNK_LENGTH * this.CHUNK_LENGTH; // Minecraft blocks
  private readonly MIN_CANVAS_TO_MAP_RATIO = 1;
  private readonly MAX_MAP_LENGTH_CHUNKS = 25; // Minecraft chunks
  private readonly MAX_STORED_CHUNK_IMAGES =
    this.MAX_MAP_LENGTH_CHUNKS * this.MAX_MAP_LENGTH_CHUNKS * 1;
  private readonly CROSSHAIRS_WIDTH = 0.5; // Minecraft blocks/map pixels
  private readonly CROSSHAIRS_LENGTH = 6; // Minecraft blocks/map pixels

  // Our component's subscriptions.
  private readonly subscriptions: Subscription[] = [];

  // A reference to our canvas and the rendering context.
  @ViewChild("map") private canvasRef?: ElementRef<HTMLCanvasElement>;
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  // An event emitter used to handle window resize events and when the canvas should be resized.
  private readonly resizeCanvasEmitter: EventEmitter<void> = new EventEmitter();

  // Region files from the store.
  private readonly regionFiles$ = this.store.select(
    worldFilesFeature.selectRegion
  );
  private readonly regionFiles: WritableSignal<WorldFilesState["region"]>;
  // Which region files are currently being viewed on the map.
  protected readonly activeRegionFiles: Signal<Map<string, File> | undefined>;
  // Region file data mapped by key. Keys are strings in the format `x,z`.
  private readonly regionFileData: Map<string, Promise<ArrayBuffer>> =
    new LruEvictionMap(5);

  /**
   * A Chunk's data is required to create its own chunk image as well as others.
   * Keys are strings in the format `x,z`.
   */
  private readonly chunkMapData: Map<string, Promise<ChunkMapData | null>> =
    new LruEvictionMap(this.MAX_STORED_CHUNK_IMAGES);
  /**
   * Generated Chunk images. Keys are strings in the format `x,z`.
   * If the chunk's data was available, the value contains the created chunk image.
   * Otherwise, the value is null.
   */
  private readonly chunkImages: Map<string, Promise<ImageBitmap | null>> =
    new LruEvictionMap(this.MAX_STORED_CHUNK_IMAGES);
  // The lowest a Minecraft block can be. Based on the current dimension being viewed.
  private chunkYMin: Signal<number>;

  // The map's dimensions set in map pixels (Minecraft blocks).
  private readonly mapDimensions = new Dimensions();
  // The coordinates of the map's center assuming the map's origin is in the same location as the canvas (top-left)
  private readonly mapCenterCoords = new Coords();
  // The current coords of the map.
  protected mapCoords = new Coords();
  protected mapYLevel: number;

  /**
   * These coords are used to track the previous and current mouse positions
   * during a dragging event. These coords will be set in html/css pixels.
   */
  private readonly dragStartHtmlCoords = new Coords();
  private readonly dragHtmlCoords = new Coords();
  /**
   * The map can be dragged by fractional amounts. However,
   * the displayed map coords only show whole numbers. To maintain
   * a precise location while dragging, we need to store
   * the exact fractional map coords.
   */
  private readonly dragMapCoords = new Coords();
  protected isMapDragging: boolean = false;
  // The ratio from canvas pixels to map pixels.
  private canvasToMapRatio = this.MIN_CANVAS_TO_MAP_RATIO;
  // The ratio from html pixels to map pixels.
  private htmlToMapRatio = 1;

  // The location and size of the crosshairs.
  protected readonly crosshairsDimensions = new Dimensions();
  protected readonly crosshairsCoords = new Coords();

  // Map Settings
  private startingXCoord: number;
  private startingYLevel: number;
  private startingZCoord: number;
  private mapDimension: WritableSignal<MapDimensionType>;
  private mapPaletteType: WritableSignal<MapPaletteType>;
  private mapPalette: Signal<MapPalette>;
  protected showCrosshairs: boolean;

  // The current draw license is needed to draw on the canvas.
  private drawLicense: number = 0;

  constructor() {
    // Get stored map settings.
    const mapSettings = this.localStorageService.get<MapDialogData>(
      LocalStorageKey.MAP_SETTINGS
    );

    this.mapDimension = signal(mapSettings?.mapDimension ?? "overworld");
    // The chunkYMin depends on which dimension is being viewed.
    this.chunkYMin = computed(() => {
      const mapDimension = this.mapDimension();
      if (mapDimension === "overworld") {
        return -64;
      }
      return 0;
    });

    // Start with no region files available.
    this.regionFiles = signal({
      overworld: undefined,
      nether: undefined,
      end: undefined
    });
    // Which subset of region files are active depends on the map dimension.
    this.activeRegionFiles = computed(() => {
      const mapDimension = this.mapDimension();
      if (mapDimension === "nether") {
        return this.regionFiles().nether;
      }
      if (mapDimension === "end") {
        return this.regionFiles().end;
      }
      return this.regionFiles().overworld;
    });

    this.mapPaletteType = signal(mapSettings?.mapPaletteType ?? "original");
    // The current map palette depends on the map palette type.
    this.mapPalette = computed(() => {
      const paletteType = this.mapPaletteType();
      if (paletteType === "blocks-only") {
        return blocksOnlyMapPalette;
      }
      if (paletteType === "no-water") {
        return noWaterMapPalette;
      }
      return originalMapPalette;
    });

    // Set map coords and other settings.
    this.startingXCoord = mapSettings?.startingXCoord ?? 0;
    this.startingZCoord = mapSettings?.startingZCoord ?? 0;
    this.mapCoords.set(this.startingXCoord, this.startingZCoord);
    this.startingYLevel = mapSettings?.startingYLevel ?? 319;
    this.mapYLevel = this.startingYLevel;
    this.showCrosshairs = mapSettings?.showCrosshairs ?? true;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.resizeCanvasEmitter.pipe(debounceTime(250)).subscribe(() => {
        this.resizeCanvas();
      }),
      this.regionFiles$.subscribe((regionFiles) => {
        this.regionFiles.set(regionFiles);
        this.mapCoords.set(this.startingXCoord, this.startingZCoord);
        this.mapYLevel = this.startingYLevel;
        this.regionFileData.clear();
        this.chunkImages.clear();
        this.chunkMapData.clear();
        this.drawMap();
      })
    );
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef?.nativeElement;
    this.ctx = this.canvas?.getContext("2d") ?? undefined;
    window.addEventListener("resize", this.windowResizeHandler);
    this.resizeCanvas();
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.windowResizeHandler);
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * A draw license is needed to draw on the canvas. Given the asynchronous nature
   * of fetching and creating chunk images, some images might not be ready to draw
   * until much later. This function sets the current draw license needed to draw
   * on the canvas and effectively clears the queue of chunk images waiting to be drawn.
   */
  private setDrawLicense(): number {
    this.drawLicense = Math.random();
    return this.drawLicense;
  }

  protected mapYLevelChange() {
    this.chunkImages.clear();
    this.chunkMapData.clear();
    this.mapCoordInputChange();
  }

  protected mapCoordInputChange() {
    if (!this.isMapDragging) {
      this.drawMap();
    }
  }

  /**
   * The handler for window resize events.
   * Calls the resize canvas event emitter.
   */
  private windowResizeHandler = () => {
    this.resizeCanvasEmitter.emit();
  };

  /**
   * Resizes the canvas to fit the screen of the device. Also sets the size of the Map.
   */
  private resizeCanvas() {
    if (!this.canvas || !this.ctx) return;

    /**
     * Get the html/css pixel dimensions of the canvas.
     * This is the amount of space/pixels it takes up on a webpage (set via CSS).
     */
    const canvasBoundingRect = this.canvas.getBoundingClientRect();

    // Get the number of physical device pixels per html/css pixel.
    const dpr = window.devicePixelRatio || 1;

    /**
     * An html canvas has a set amount of space/pixels it takes up on a webpage (set via CSS).
     * It also has a separate internal coordinate system (set via JS).
     * For the best image quality, set the canvas' inner dimensions so that each canvas pixel is equivalent to one device pixel.
     */
    this.canvas.width = canvasBoundingRect.width * dpr;
    this.canvas.height = canvasBoundingRect.height * dpr;

    /**
     * The map's dimensions are its width and height in Minecraft blocks.
     * The map is drawn on the canvas.
     * Set the number of canvas pixels per map pixel. In this way, we can
     * control the number of Minecraft blocks shown on the map regardless
     * of the size of the canvas.
     */
    this.canvasToMapRatio = Math.max(
      Math.ceil(
        Math.max(this.canvas.width, this.canvas.height) /
          this.MAX_MAP_LENGTH_CHUNKS /
          this.CHUNK_LENGTH
      ),
      this.MIN_CANVAS_TO_MAP_RATIO
    );
    /**
     * Set the map dimensions (measured in Minecraft blocks).
     * Round up so that the map takes up the entire canvas.
     */
    this.mapDimensions.set(
      Math.ceil(this.canvas.width / this.canvasToMapRatio),
      Math.ceil(this.canvas.height / this.canvasToMapRatio)
    );
    this.mapCenterCoords.set(
      Math.ceil(this.mapDimensions.width / 2),
      Math.ceil(this.mapDimensions.height / 2)
    );

    /**
     * Set the number of html/css pixels per map pixel.
     * The user can click and drag on the map to move around. When this happens,
     * we will need to interpret the distance the map was dragged. Mouse events capture mouse positions
     * using html/css pixels. So we need to be able to quickly convert from a distance in html/css pixels
     * to map pixels. This process has already been done above:
     * 1) Multiply by the dpr (Device Pixel Ratio) to get the distance in canvas pixels.
     * 2) Then divide by the canvasToMapRatio to get the distance in map pixels.
     */
    this.htmlToMapRatio = dpr / this.canvasToMapRatio;

    /**
     * The crosshairs will always be a certain number of map pixels wide and long.
     * But since the crosshairs exist in the DOM, it needs dimensions in html/css pixels.
     */
    this.crosshairsDimensions.set(
      this.CROSSHAIRS_WIDTH / this.htmlToMapRatio,
      this.CROSSHAIRS_LENGTH / this.htmlToMapRatio
    );
    this.crosshairsCoords.set(
      this.mapCenterCoords.x / this.htmlToMapRatio,
      this.mapCenterCoords.z / this.htmlToMapRatio
    );

    /**
     * For drawing on the canvas, we have two coordinate systems that matter:
     * the canvas' internal dimensions and the map's dimensions. So which should we use to draw a Minecraft block/chunk?
     * Preferably, the map's dimensions because each map pixel is one Minecraft block.
     * We can set the canvas renderer's scale so that when shapes and images are drawn on the canvas,
     * it will scale each pixel to the size of a map pixel. Now when drawing, we can simply draw using
     * the map's coordinate system and dimensions.
     */
    this.ctx.scale(this.canvasToMapRatio, this.canvasToMapRatio);
    this.ctx.imageSmoothingEnabled = false;

    // Make sure the DOM is updated.
    this.cdr.detectChanges();

    // After the canvas has been sized, draw the map.
    if (this.activeRegionFiles() && !this.isMapDragging) {
      this.drawMap();
    }
  }

  protected openMapSettings() {
    const dialogRef = this.dialog.open<
      MapDialogComponent,
      MapDialogData,
      MapDialogData
    >(MapDialogComponent, {
      data: {
        mapDimension: this.mapDimension(),
        startingXCoord: this.startingXCoord,
        startingZCoord: this.startingZCoord,
        startingYLevel: this.startingYLevel,
        mapPaletteType: this.mapPaletteType(),
        showCrosshairs: this.showCrosshairs
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return;
      const clearChunkData =
        this.mapPaletteType() !== data.mapPaletteType ||
        this.mapDimension() !== data.mapDimension;
      this.startingXCoord = data.startingXCoord;
      this.startingZCoord = data.startingZCoord;
      this.startingYLevel = data.startingYLevel;
      this.mapPaletteType.set(data.mapPaletteType);
      this.mapDimension.set(data.mapDimension);
      this.showCrosshairs = data.showCrosshairs;

      if (clearChunkData) {
        this.regionFileData.clear();
        this.chunkImages.clear();
        this.chunkMapData.clear();
      }
      this.localStorageService.set(LocalStorageKey.MAP_SETTINGS, data);
      this.drawMap();
    });
  }

  /**
   * Draws the chunk's image once the promise is resolved and if the license
   * provided is still active.
   */
  private async drawChunkImage(
    chunkImage: Promise<ImageBitmap | null>,
    x: number,
    z: number,
    drawLicenseUsed: number
  ) {
    const image = await chunkImage;
    if (image && drawLicenseUsed === this.drawLicense) {
      this.ctx?.drawImage(image, x, z);
    }
  }

  /**
   * Given the current map coords and the region files, draws the Minecraft chunks onto the map
   */
  protected drawMap(coords: Coords = this.mapCoords) {
    const currentDrawLicense = this.setDrawLicense();

    this.ctx?.clearRect(
      0,
      0,
      this.mapDimensions.width,
      this.mapDimensions.height
    );

    // Get current map coords
    const currentMapCoords = new Coords(coords.x, coords.z);
    // Translate coords to the origin of the canvas (top-left corner)
    currentMapCoords.subtract(this.mapCenterCoords.x, this.mapCenterCoords.z);

    // Get chunk coords of current map coords
    const chunkCoords = this.anvilService.worldBlockCoordsToChunkCoords(
      currentMapCoords.x,
      currentMapCoords.z
    );

    // Get starting map coords to begin drawing the chunks. Range (-this.CHUNK_LENGTH, 0]
    const xRemainder = currentMapCoords.x % this.CHUNK_LENGTH;
    const zRemainder = currentMapCoords.z % this.CHUNK_LENGTH;
    const mapStartCoords = new Coords(
      -1 * (xRemainder >= 0 ? xRemainder : this.CHUNK_LENGTH + xRemainder),
      -1 * (zRemainder >= 0 ? zRemainder : this.CHUNK_LENGTH + zRemainder)
    );

    for (
      let z = mapStartCoords.z, chunkZ = chunkCoords.z;
      z < this.mapDimensions.height;
      z += this.CHUNK_LENGTH, ++chunkZ
    ) {
      for (
        let x = mapStartCoords.x, chunkX = chunkCoords.x;
        x < this.mapDimensions.width;
        x += this.CHUNK_LENGTH, ++chunkX
      ) {
        const chunkKey = `${chunkX},${chunkZ}`;
        let chunkImage = this.chunkImages.get(chunkKey);
        if (!chunkImage) {
          chunkImage = this.getChunkImage(chunkX, chunkZ);
          this.chunkImages.set(chunkKey, chunkImage);
        }
        this.drawChunkImage(chunkImage, x, z, currentDrawLicense);
      }
    }
  }

  /**
   * Given the coordinates of a chunk in a Minecraft world, returns a
   * promise that resolves with the chunk's data if it exists or null
   * if Minecraft has not yet generated the chunk.
   */
  private async getChunk(
    chunkX: number,
    chunkZ: number
  ): Promise<Chunk | null> {
    // Get the region file that holds the chunk we need. If it doesn't exist, return null.
    const regionCoords = this.anvilService.worldChunkCoordsToRegionCoords(
      chunkX,
      chunkZ
    );
    const regionKey = `${regionCoords.x},${regionCoords.z}`;
    const regionFile = this.activeRegionFiles()?.get(regionKey);
    if (!regionFile) {
      return null;
    }

    // Get the data from the region file.
    let regionData = this.regionFileData.get(regionKey);
    if (!regionData) {
      regionData = this.fileReaderService.readAsArrayBuffer(regionFile);
      this.regionFileData.set(regionKey, regionData);
    }

    // Get chunk data. If it doesn't exist or is not fully generated, return null.
    const regionChunkCoords =
      this.anvilService.worldChunkCoordsToRegionChunkCoords(chunkX, chunkZ);
    const chunk = await this.anvilService.getChunkData(
      await regionData,
      regionChunkCoords.x,
      regionChunkCoords.z,
      this.chunkYMin()
    );
    return chunk?.Status === "minecraft:full" ||
      chunk?.Status === "minecraft:postprocessed"
      ? chunk
      : null;
  }

  /**
   * Given the coords of a chunk in a Minecraft world, returns a
   * promise that resolves with the chunk's map data if it exists or null
   * if Minecraft has not yet generated the chunk
   */
  private getChunkMapData(
    chunkX: number,
    chunkZ: number
  ): Promise<ChunkMapData | null> {
    const chunkKey = `${chunkX}, ${chunkZ}`;
    let chunkMapData = this.chunkMapData.get(chunkKey);
    if (!chunkMapData) {
      chunkMapData = this.getChunk(chunkX, chunkZ).then((chunk) =>
        chunk
          ? this.anvilService.getChunkMapData(
              chunk,
              this.mapPalette(),
              this.mapYLevel
            )
          : null
      );
      this.chunkMapData.set(chunkKey, chunkMapData);
    }
    return chunkMapData;
  }

  /**
   * Given the coordinates of a chunk in a Minecraft world, returns a
   * promise that resolves with the chunk's generated image if it exists or null
   * if Minecraft has not yet generated the chunk.
   *
   * Additionally, each chunk's image depends on the y levels of the chunk to the north.
   */
  private async getChunkImage(
    chunkX: number,
    chunkZ: number
  ): Promise<ImageBitmap | null> {
    try {
      // Get the map data for the current chunk.
      const currentChunkMapData = await this.getChunkMapData(chunkX, chunkZ);
      if (currentChunkMapData === null) {
        return null;
      }

      // Get the map data for the previous chunk.
      const previousChunkMapData = await this.getChunkMapData(
        chunkX,
        chunkZ - 1
      );

      // We only care about the last row of y levels from the previous chunk.
      const previousYLevels = previousChunkMapData?.yLevels.slice(
        this.BLOCKS_IN_CHUNK - this.CHUNK_LENGTH
      );

      /**
       * Use the color ids and y levels to get the block's map color and build
       * the chunk image. Each block's calculated map color depends on how its
       * y level compares to the block to the north.
       */
      const imageData = new ImageData(this.CHUNK_LENGTH, this.CHUNK_LENGTH);
      for (let i = 0; i < this.BLOCKS_IN_CHUNK; ++i) {
        let color: RGBAColor;
        /**
         * If we are looking at the first row of blocks in the chunk,
         * we need the y levels of the last row of blocks in the previous chunk.
         */
        if (i < this.CHUNK_LENGTH) {
          if (previousYLevels) {
            color = this.getMapColorIdColor(
              currentChunkMapData.colorIds[i],
              currentChunkMapData.yLevels[i],
              previousYLevels[i]
            );
          } else {
            color = MapColors[currentChunkMapData.colorIds[i]].color.same;
          }
        } else {
          color = this.getMapColorIdColor(
            currentChunkMapData.colorIds[i],
            currentChunkMapData.yLevels[i],
            currentChunkMapData.yLevels[i - this.CHUNK_LENGTH]
          );
        }
        const imageDataIndex = i * 4;
        imageData.data[imageDataIndex] = color.r;
        imageData.data[imageDataIndex + 1] = color.g;
        imageData.data[imageDataIndex + 2] = color.b;
        imageData.data[imageDataIndex + 3] = color.a;
      }
      return await createImageBitmap(imageData);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Given a color id and two y levels, returns the color to be used
   * on the map.
   */
  private getMapColorIdColor(
    mapColorId: number,
    yLevel: number,
    previousYLevel: number
  ): RGBAColor {
    if (previousYLevel < yLevel) {
      return MapColors[mapColorId].color.above;
    }
    if (previousYLevel > yLevel) {
      return MapColors[mapColorId].color.below;
    }
    return MapColors[mapColorId].color.same;
  }

  protected pointerDown = (event: PointerEvent) => {
    if (this.isMapDragging) return;
    this.isMapDragging = true;
    this.dragStartHtmlCoords.set(event.x, event.y);
    this.dragHtmlCoords.set(event.x, event.y);
    this.dragMapCoords.setWithCoords(this.mapCoords);
    window.addEventListener("pointerup", this.pointerUp);
    requestAnimationFrame(this.animationFrame);
  };

  protected pointerMove = (event: PointerEvent) => {
    if (!this.isMapDragging) return;
    this.dragHtmlCoords.set(event.x, event.y);
  };

  private pointerUp = () => {
    if (!this.isMapDragging) return;
    this.isMapDragging = false;
    window.removeEventListener("pointerup", this.pointerUp);
  };

  private animationFrame = () => {
    if (!this.canvas || !this.ctx) return;

    // Calculate the shift in html/css pixels.
    const htmlXShift = this.dragHtmlCoords.x - this.dragStartHtmlCoords.x;
    const htmlZShift = this.dragHtmlCoords.z - this.dragStartHtmlCoords.z;

    /**
     * Update the starting html coords to the current ones for
     * the next iteration.
     */
    this.dragStartHtmlCoords.setWithCoords(this.dragHtmlCoords);

    // Calculate the shift in map pixels.
    const mapXShift = htmlXShift * this.htmlToMapRatio;
    const mapZShift = htmlZShift * this.htmlToMapRatio;

    // Update the map coords
    this.dragMapCoords.subtract(mapXShift, mapZShift);
    this.mapCoords.setWithCoords(this.dragMapCoords);
    this.mapCoords.round();

    if (this.isMapDragging) {
      this.drawMap(this.dragMapCoords);
      requestAnimationFrame(this.animationFrame);
    } else {
      this.drawMap();
    }
  };
}
