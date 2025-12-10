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
import { ChunkImage } from "../../models/chunk-image";
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
  private readonly MIN_CHUNK_SCREEN_RATIO = 4;
  private readonly MAX_MAP_LENGTH_CHUNKS = 25;
  private readonly $resizeCanvas: EventEmitter<void> = new EventEmitter();
  private readonly regionFilePromises: Map<string, Promise<ArrayBuffer>> =
    new Map();
  private readonly chunkImagePromises: Map<string, Promise<ChunkImage | null>> =
    new Map();
  private readonly currentMapChunkKeys: string[] = [];
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

  protected yLevelChange() {
    this.chunkImagePromises.clear();
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
    const dpr = window.devicePixelRatio || 1;
    this.mapCanvas.width = rect.width * dpr;
    this.mapCanvas.height = rect.height * dpr;

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
          this.drawChunkImage(chunkImagePromise, x, z);
          continue;
        }

        const newChunkImagePromise = this.getChunkImage(chunkX, chunkZ);
        this.drawChunkImage(newChunkImagePromise, x, z);
        this.chunkImagePromises.set(chunkKey, newChunkImagePromise);
      }
    }
  }

  private async drawChunkImage(
    chunkImagePromise: Promise<ChunkImage | null>,
    x: number,
    z: number
  ) {
    const chunkImage = await chunkImagePromise;
    if (chunkImage) {
      this.ctx?.drawImage(chunkImage.image, x, z);
    }
  }

  private async getChunkImage(
    chunkX: number,
    chunkZ: number
  ): Promise<ChunkImage | null> {
    try {
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

      // Get chunk data
      const chunkData = await this.anvilService.getChunkData(
        await regionData,
        regionChunkCoords.chunkX,
        regionChunkCoords.chunkZ
      );
      if (chunkData?.Status !== "minecraft:full") {
        return null;
      }

      // Get map colors
      const mapIds = this.anvilService.getChunkMapIds(chunkData, this.yLevel);

      // Get the previous chunk's final y levels
      let previousFinalYLevels: number[] | undefined = undefined;
      const previousChunkImagePromise = this.chunkImagePromises.get(
        `${chunkX},${chunkZ - 1}`
      );
      if (previousChunkImagePromise) {
        previousFinalYLevels = (await previousChunkImagePromise)?.finalYLevels;
      }

      // Create chunk image data
      const imageData = new ImageData(this.CHUNK_LENGTH, this.CHUNK_LENGTH);
      const finalYLevels: number[] = [];
      for (let x = 0; x < this.CHUNK_LENGTH; ++x) {
        for (let z = 0; z < this.CHUNK_LENGTH; ++z) {
          const mapIdIndex = z * this.CHUNK_LENGTH + x;
          const mapId = mapIds[mapIdIndex];
          if (z === this.CHUNK_LENGTH - 1) {
            finalYLevels.push(mapId.yLevel);
          }

          let color: RGBAColor;
          if (z === 0) {
            if (previousFinalYLevels) {
              color = this.getMapColorIdColor(
                mapId.mapColorId,
                mapId.yLevel,
                previousFinalYLevels[x]
              );
            } else {
              color = MapColors[mapId.mapColorId].color.same;
            }
          } else {
            const previousYLevel =
              mapIds[mapIdIndex - this.CHUNK_LENGTH].yLevel;
            color = this.getMapColorIdColor(
              mapId.mapColorId,
              mapId.yLevel,
              previousYLevel
            );
          }
          const imageDataIndex = mapIdIndex * 4;
          imageData.data[imageDataIndex] = color.r;
          imageData.data[imageDataIndex + 1] = color.g;
          imageData.data[imageDataIndex + 2] = color.b;
          imageData.data[imageDataIndex + 3] = color.a;
        }
      }

      const imageBitmap = await createImageBitmap(imageData);
      return {
        image: imageBitmap,
        finalYLevels: finalYLevels
      };
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

    let xShift = Math.trunc(
      (this.dragCoords.xCoord - this.dragStartCoords.xCoord) /
        this.mapPixelRatio
    );
    let zShift = Math.trunc(
      (this.dragCoords.zCoord - this.dragStartCoords.zCoord) /
        this.mapPixelRatio
    );

    if (xShift !== 0 || zShift !== 0) {
      this.xCoord -= xShift;
      this.zCoord -= zShift;

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
            this.drawChunkImage(chunkImagePromise, x, z);
          }
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
