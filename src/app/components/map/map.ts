import { NgClass } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { debounceTime } from "rxjs";
import { MapColors } from "../../constants/map-colors";
import { RGBAColor } from "../../models/map-color";
import {
  MapColorPalette,
  MapDialogInputData,
  MapDialogOutputData,
  MapOrigin
} from "../../models/map-dialog-data";
import { AnvilService } from "../../services/anvil/anvil-service";
import { FileReaderService } from "../../services/file-reader/file-reader-service";
import {
  LocalStorageKey,
  LocalStorageService
} from "../../services/local-storage/local-storage";
import { CoordInput } from "./coord-input/coord-input";
import { MapDialogComponent } from "./map-dialog/map-dialog";
import { Chunk } from "../../models/chunk";

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
    NgClass
  ],
  templateUrl: "./map.html",
  styleUrl: "./map.scss"
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly fileReaderService = inject(FileReaderService);
  private readonly anvilService = inject(AnvilService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly dialog = inject(MatDialog);

  @ViewChild("mapCanvas") private mapCanvasRef?: ElementRef<HTMLCanvasElement>;

  private readonly CHUNK_LENGTH = 16;
  private readonly BLOCKS_IN_CHUNK = this.CHUNK_LENGTH * this.CHUNK_LENGTH;
  private readonly MIN_CHUNK_SCREEN_RATIO = 4;
  private readonly MAX_MAP_LENGTH_CHUNKS = 25;
  private readonly $resizeCanvas: EventEmitter<void> = new EventEmitter();
  private readonly regionFilePromises: Map<string, Promise<ArrayBuffer>> =
    new Map();
  private readonly chunkImagePromises: Map<
    string,
    Promise<ImageBitmap | null>
  > = new Map();
  private readonly chunkColorIds: Map<string, number[] | null> = new Map();
  private readonly chunkYLevels: Map<string, number[] | null> = new Map();
  private readonly currentMapChunkKeys: string[] = [];
  private readonly dragMapCoords = {
    xCoord: 0,
    zCoord: 0
  };
  private readonly dragStartCoords = {
    xCoord: 0,
    zCoord: 0
  };
  private readonly dragCoords = {
    xCoord: 0,
    zCoord: 0
  };

  private mapCanvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private dpr: number = 1;
  private mapPixelRatio = this.MIN_CHUNK_SCREEN_RATIO;
  private mapWidth: number = 0;
  private mapHeight: number = 0;
  private xStartingCoord: number;
  private yStartingLevel: number;
  private zStartingCoord: number;
  private origin: MapOrigin;
  private colorPalette: MapColorPalette;
  private xMapStartCoord: number = 0;
  private zMapStartCoord: number = 0;
  private drawLicense: number = 0;

  protected regionFilesProcessed = false;
  protected xCoord: number;
  protected yLevel: number;
  protected zCoord: number;
  protected isMapDragging: boolean = false;

  constructor() {
    const mapSettings = this.localStorageService.get<MapDialogInputData>(
      LocalStorageKey.MAP_SETTINGS
    );
    this.xStartingCoord = mapSettings?.xStartingCoord ?? 0;
    this.xCoord = this.xStartingCoord;
    this.zStartingCoord = mapSettings?.zStartingCoord ?? 0;
    this.zCoord = this.zStartingCoord;
    this.yStartingLevel = mapSettings?.yStartingLevel ?? 319;
    this.yLevel = this.yStartingLevel;
    this.origin = mapSettings?.origin ?? "center";
    this.colorPalette = mapSettings?.colorPalette ?? "original";
  }

  ngOnInit(): void {
    this.openMapDialog();
    this.$resizeCanvas.pipe(debounceTime(250)).subscribe(() => {
      this.resizeCanvas();
    });
  }

  ngAfterViewInit(): void {
    this.mapCanvas = this.mapCanvasRef?.nativeElement;
    this.ctx = this.mapCanvas?.getContext("2d") ?? undefined;
    window.addEventListener("resize", this.windowResizeHandler);
    this.resizeCanvas();
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.windowResizeHandler);
    this.$resizeCanvas.unsubscribe();
  }

  private setNewDrawLicense() {
    let newDrawLicense: number;
    do {
      newDrawLicense = Math.trunc(Math.random() * 1000);
    } while (newDrawLicense === this.drawLicense);
    this.drawLicense = newDrawLicense;
  }

  protected yLevelChange() {
    this.chunkImagePromises.clear();
    this.chunkColorIds.clear();
    this.chunkYLevels.clear();
    this.coordInputChange();
  }

  protected coordInputChange() {
    if (!this.isMapDragging) {
      this.drawMap();
    }
  }

  private windowResizeHandler = () => {
    this.$resizeCanvas.emit();
  };

  private resizeCanvas() {
    if (!this.mapCanvas || !this.ctx) return;
    const rect = this.mapCanvas.getBoundingClientRect();
    this.dpr = window.devicePixelRatio || 1;
    this.mapCanvas.width = rect.width * this.dpr;
    this.mapCanvas.height = rect.height * this.dpr;

    this.mapPixelRatio = Math.max(
      Math.trunc(
        this.mapCanvas.width / this.MAX_MAP_LENGTH_CHUNKS / this.CHUNK_LENGTH
      ),
      this.MIN_CHUNK_SCREEN_RATIO
    );

    this.mapWidth = Math.ceil(this.mapCanvas.width / this.mapPixelRatio);
    this.mapHeight = Math.ceil(this.mapCanvas.height / this.mapPixelRatio);

    this.ctx.scale(this.mapPixelRatio, this.mapPixelRatio);
    this.ctx.setTransform(this.mapPixelRatio, 0, 0, this.mapPixelRatio, 0, 0);
    this.ctx.imageSmoothingEnabled = false;

    if (!this.isMapDragging) {
      this.drawMap();
    }
  }

  protected openMapDialog() {
    const dialogRef = this.dialog.open<
      MapDialogComponent,
      MapDialogInputData,
      MapDialogOutputData
    >(MapDialogComponent, {
      data: {
        xStartingCoord: this.xStartingCoord,
        zStartingCoord: this.zStartingCoord,
        yStartingLevel: this.yStartingLevel,
        origin: this.origin,
        colorPalette: this.colorPalette
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return;
      const { files, ...storedSettings } = data;
      this.xStartingCoord = storedSettings.xStartingCoord;
      this.zStartingCoord = storedSettings.zStartingCoord;
      this.yStartingLevel = storedSettings.yStartingLevel;
      this.origin = storedSettings.origin;
      this.colorPalette = storedSettings.colorPalette;
      if (files) {
        this.xCoord = this.xStartingCoord;
        this.zCoord = this.zStartingCoord;
        this.yLevel = this.yStartingLevel;
        this.processRegionFiles(files);
      } else {
        this.drawMap();
      }
      this.localStorageService.set(
        LocalStorageKey.MAP_SETTINGS,
        storedSettings
      );
    });
  }

  private async processRegionFiles(files: FileList) {
    this.regionFilePromises.clear();
    this.chunkImagePromises.clear();
    this.chunkColorIds.clear();
    this.chunkYLevels.clear();
    const anvilRegex = new RegExp(/^r\.(?<x>-?[0-9]+)\.(?<z>-?[0-9]+)\.mca$/);
    for (const file of files) {
      const regexResult = anvilRegex.exec(file.name);
      if (!regexResult || !regexResult.groups) continue;
      this.regionFilePromises.set(
        `${regexResult.groups["x"]},${regexResult.groups["z"]}`,
        this.fileReaderService.readAsArrayBuffer(file)
      );
    }

    this.regionFilesProcessed = true;
    this.drawMap();
  }

  protected drawMap() {
    if (!this.mapCanvas || !this.ctx) return;

    this.setNewDrawLicense();
    const currentDrawLicense = this.drawLicense;

    this.ctx.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);

    // Get current map (block) coords
    let zCurrentCoord = this.zCoord;
    let xCurrentCoord = this.xCoord;

    // Translate coords if origin is in the center
    if (this.origin === "center") {
      zCurrentCoord -= Math.ceil(this.mapHeight / 2);
      xCurrentCoord -= Math.ceil(this.mapWidth / 2);
    }

    // Get chunk coords of current map (block) coords
    const chunkCoords = this.anvilService.worldBlockCoordsToChunkCoords(
      xCurrentCoord,
      zCurrentCoord
    );

    // Get starting map coords to begin drawing the chunks. Range (-this.CHUNK_LENGTH, 0]
    const xRemainder = xCurrentCoord % this.CHUNK_LENGTH;
    this.xMapStartCoord =
      -1 * (xRemainder >= 0 ? xRemainder : this.CHUNK_LENGTH + xRemainder);
    const zRemainder = zCurrentCoord % this.CHUNK_LENGTH;
    this.zMapStartCoord =
      -1 * (zRemainder >= 0 ? zRemainder : this.CHUNK_LENGTH + zRemainder);

    this.currentMapChunkKeys.length = 0;
    for (
      let z = this.zMapStartCoord, chunkZ = chunkCoords.chunkZ;
      z < this.mapHeight;
      z += this.CHUNK_LENGTH, ++chunkZ
    ) {
      for (
        let x = this.xMapStartCoord, chunkX = chunkCoords.chunkX;
        x < this.mapWidth;
        x += this.CHUNK_LENGTH, ++chunkX
      ) {
        const chunkKey = `${chunkX},${chunkZ}`;
        this.currentMapChunkKeys.push(chunkKey);

        let chunkImagePromise = this.chunkImagePromises.get(chunkKey);

        if (chunkImagePromise) {
          this.drawChunkImage(chunkImagePromise, x, z, currentDrawLicense);
          continue;
        }

        const newChunkImagePromise = this.getChunkImage(chunkX, chunkZ);
        this.drawChunkImage(newChunkImagePromise, x, z, currentDrawLicense);
        this.chunkImagePromises.set(chunkKey, newChunkImagePromise);
      }
    }
  }

  private async drawChunkImage(
    chunkImagePromise: Promise<ImageBitmap | null>,
    x: number,
    z: number,
    drawLicenseUsed: number
  ) {
    const chunkImage = await chunkImagePromise;
    if (chunkImage && drawLicenseUsed === this.drawLicense) {
      this.ctx?.drawImage(chunkImage, x, z);
    }
  }

  private async getChunk(
    chunkX: number,
    chunkZ: number
  ): Promise<Chunk | null> {
    // Get region file
    const regionCoords = this.anvilService.worldChunkCoordsToRegionCoords(
      chunkX,
      chunkZ
    );
    const regionData = this.regionFilePromises.get(
      `${regionCoords.regionX},${regionCoords.regionZ}`
    );
    if (!regionData) {
      return null;
    }

    // Get region chunk coords
    const regionChunkCoords =
      this.anvilService.worldChunkCoordsToRegionChunkCoords(chunkX, chunkZ);

    // Get chunk
    const chunk = await this.anvilService.getChunkData(
      await regionData,
      regionChunkCoords.chunkX,
      regionChunkCoords.chunkZ
    );
    return chunk?.Status === "minecraft:full" ? chunk : null;
  }

  private async getChunkImage(
    chunkX: number,
    chunkZ: number
  ): Promise<ImageBitmap | null> {
    try {
      // Get the chunk map info
      const chunkKey = `${chunkX},${chunkZ}`;

      let colorIds = this.chunkColorIds.get(chunkKey);
      this.chunkColorIds.delete(chunkKey);
      let yLevels = this.chunkYLevels.get(chunkKey);
      this.chunkYLevels.delete(chunkKey);
      if (colorIds === undefined || yLevels === undefined) {
        // Get the chunk
        const chunk = await this.getChunk(chunkX, chunkZ);
        if (!chunk) {
          return null;
        }

        // Get the chunk map info
        let mapInfo = this.anvilService.getChunkMapInfo(chunk, this.yLevel);
        colorIds = mapInfo.colorIds;
        yLevels = mapInfo.yLevels;
      } else if (colorIds === null || yLevels === null) {
        return null;
      }

      // Await previous chunk image if present. This ensures previous chunk's y levels are already stored.
      const previousChunkKey = `${chunkX},${chunkZ - 1}`;
      const previousChunkImagePromise =
        this.chunkImagePromises.get(previousChunkKey);
      if (previousChunkImagePromise) {
        await previousChunkImagePromise;
      }

      // Get and store the previous chunk's y levels
      let previousYLevels = this.chunkYLevels.get(previousChunkKey);
      if (previousYLevels === undefined) {
        // Get the previous chunk
        const previousChunk = await this.getChunk(chunkX, chunkZ - 1);
        if (!previousChunk) {
          previousYLevels = null;
          this.chunkColorIds.set(previousChunkKey, null);
          this.chunkYLevels.set(previousChunkKey, null);
        } else {
          let previousMapInfo = this.anvilService.getChunkMapInfo(
            previousChunk,
            this.yLevel
          );
          previousYLevels = previousMapInfo.yLevels.slice(
            this.BLOCKS_IN_CHUNK - this.CHUNK_LENGTH
          );
          this.chunkColorIds.set(previousChunkKey, previousMapInfo.colorIds);
          this.chunkYLevels.set(previousChunkKey, previousMapInfo.yLevels);
        }
      }

      // Create chunk image data
      const imageData = new ImageData(this.CHUNK_LENGTH, this.CHUNK_LENGTH);
      for (let i = 0; i < this.BLOCKS_IN_CHUNK; ++i) {
        let color: RGBAColor;
        if (i < this.CHUNK_LENGTH) {
          if (previousYLevels) {
            color = this.getMapColorIdColor(
              colorIds[i],
              yLevels[i],
              previousYLevels[i]
            );
          } else {
            color = MapColors[colorIds[i]].color.same;
          }
        } else {
          color = this.getMapColorIdColor(
            colorIds[i],
            yLevels[i],
            yLevels[i - this.CHUNK_LENGTH]
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

  private getMapColorIdColor(
    mapColorId: number,
    yLevel: number,
    previousYLevel: number
  ): RGBAColor {
    if (previousYLevel < yLevel) {
      return MapColors[mapColorId].color.above;
    } else if (previousYLevel > yLevel) {
      return MapColors[mapColorId].color.below;
    } else {
      return MapColors[mapColorId].color.same;
    }
  }

  protected mouseDown = (event: MouseEvent) => {
    if (this.isMapDragging) return;
    this.isMapDragging = true;
    this.setNewDrawLicense();
    this.dragMapCoords.xCoord = this.xCoord;
    this.dragMapCoords.zCoord = this.zCoord;
    this.dragStartCoords.xCoord = event.x;
    this.dragStartCoords.zCoord = event.y;
    this.dragCoords.xCoord = event.x;
    this.dragCoords.zCoord = event.y;
    window.addEventListener("mouseup", this.mouseUp);
    requestAnimationFrame(this.animationFrame);
  };

  protected mouseMove = (event: MouseEvent) => {
    if (!this.isMapDragging) return;
    this.dragCoords.xCoord = event.x;
    this.dragCoords.zCoord = event.y;
  };

  private mouseUp = () => {
    if (!this.isMapDragging) return;
    this.isMapDragging = false;
    window.removeEventListener("mouseup", this.mouseUp);
  };

  private animationFrame = () => {
    if (!this.mapCanvas || !this.ctx) return;

    let xShift =
      ((this.dragCoords.xCoord - this.dragStartCoords.xCoord) * this.dpr) /
      this.mapPixelRatio;
    let zShift =
      ((this.dragCoords.zCoord - this.dragStartCoords.zCoord) * this.dpr) /
      this.mapPixelRatio;

    this.dragMapCoords.xCoord -= xShift;
    this.dragMapCoords.zCoord -= zShift;
    this.xCoord = Math.round(this.dragMapCoords.xCoord);
    this.zCoord = Math.round(this.dragMapCoords.zCoord);

    this.dragStartCoords.xCoord += xShift * this.mapPixelRatio;
    this.dragStartCoords.zCoord += zShift * this.mapPixelRatio;

    this.ctx.clearRect(
      this.xMapStartCoord,
      this.zMapStartCoord,
      this.mapWidth - this.xMapStartCoord + this.CHUNK_LENGTH,
      this.mapHeight - this.zMapStartCoord + this.CHUNK_LENGTH
    );
    this.ctx.translate(xShift, zShift);
    for (
      let z = this.zMapStartCoord, chunkIndex = 0;
      z < this.mapHeight;
      z += this.CHUNK_LENGTH
    ) {
      for (
        let x = this.xMapStartCoord;
        x < this.mapWidth;
        x += this.CHUNK_LENGTH, ++chunkIndex
      ) {
        let chunkImagePromise = this.chunkImagePromises.get(
          this.currentMapChunkKeys[chunkIndex]
        );

        if (chunkImagePromise) {
          this.drawChunkImage(chunkImagePromise, x, z, this.drawLicense);
        }
      }
    }

    if (this.isMapDragging) {
      requestAnimationFrame(this.animationFrame);
    } else {
      this.ctx.setTransform(this.mapPixelRatio, 0, 0, this.mapPixelRatio, 0, 0);
      this.drawMap();
    }
  };
}
