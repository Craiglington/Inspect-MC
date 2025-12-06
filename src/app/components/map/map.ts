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
  private mapCanvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private readonly $resizeCanvas: EventEmitter<void> = new EventEmitter();
  private readonly regionFiles: Map<string, Promise<ArrayBuffer>> = new Map();
  private readonly chunkImageData: Map<string, ImageBitmap | null> = new Map();
  private readonly drawnChunks: string[] = [];

  protected regionFilesProcessed = false;
  private xStartingCoord: number;
  protected xCoord: number;
  private yStartingLevel: number;
  protected yLevel: number;
  private zStartingCoord: number;
  protected zCoord: number;
  private origin: MapOrigin;
  private colorPalette: MapColorPalette;

  protected draggingMap: boolean = false;
  private xOffset: number = 0;
  private zOffset: number = 0;
  private readonly dragStartOriginCoords = {
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
    this.chunkImageData.clear();
    this.coordInputChange();
  }

  protected coordInputChange() {
    if (!this.draggingMap) {
      this.drawMap();
    }
  }

  private windowResizeHandler = () => {
    this.$resizeCanvas.emit();
  };

  private resizeCanvas() {
    if (!this.mapCanvas) return;
    this.mapCanvas.width = this.mapCanvas.offsetWidth / 4;
    this.mapCanvas.height = this.mapCanvas.offsetHeight / 4;
    if (!this.draggingMap) {
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
    this.regionFiles.clear();
    this.chunkImageData.clear();
    const anvilRegex = new RegExp(/^r\.(?<x>-?[0-9]+)\.(?<z>-?[0-9]+)\.mca$/);
    for (const file of files) {
      const regexResult = anvilRegex.exec(file.name);
      if (!regexResult || !regexResult.groups) continue;
      this.regionFiles.set(
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

    // Get current map coords
    const zCurrentCoord = this.zCoord;
    const xCurrentCoord = this.xCoord;
    const chunkCoords = this.anvilService.worldBlockCoordsToChunkCoords(
      xCurrentCoord,
      zCurrentCoord
    );

    // Get offset of starting chunk
    this.zOffset = zCurrentCoord % 16;
    this.zOffset = 0 - (this.zOffset >= 0 ? this.zOffset : 16 + this.zOffset);
    this.xOffset = xCurrentCoord % 16;
    this.xOffset = 0 - (this.xOffset >= 0 ? this.xOffset : 16 + this.xOffset);

    this.drawnChunks.length = 0;
    for (
      let z = this.zOffset, chunkZ = chunkCoords.chunkZ;
      z < this.mapCanvas.height;
      z += 16, ++chunkZ
    ) {
      for (
        let x = this.xOffset, chunkX = chunkCoords.chunkX;
        x < this.mapCanvas.width;
        x += 16, ++chunkX
      ) {
        const chunkKey = `${chunkX},${chunkZ}`;
        this.drawnChunks.push(chunkKey);

        let storedImageBitmap = this.chunkImageData.get(chunkKey);
        if (storedImageBitmap === null) continue;

        if (storedImageBitmap) {
          this.ctx.drawImage(storedImageBitmap, x, z);
          continue;
        }

        this.saveChunkImage(chunkX, chunkZ).then((imageBitmap) => {
          if (imageBitmap) {
            this.ctx!.drawImage(imageBitmap, x, z);
          }
        });
      }
    }
  }

  private async saveChunkImage(
    chunkX: number,
    chunkZ: number
  ): Promise<ImageBitmap | null> {
    try {
      // Get region file
      const regionCoords = this.anvilService.worldChunkCoordsToRegionCoords(
        chunkX,
        chunkZ
      );
      const regionData = this.regionFiles.get(
        `${regionCoords.regionX},${regionCoords.regionZ}`
      );
      if (!regionData) {
        this.chunkImageData.set(`${chunkX},${chunkZ}`, null);
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
        this.chunkImageData.set(`${chunkX},${chunkZ}`, null);
        return null;
      }

      // Get map colors
      const mapIds = this.anvilService.getChunkMapIds(chunkData, this.yLevel);

      // Create image data
      const imageData = new ImageData(16, 16);
      for (let x = 0; x < 16; ++x) {
        for (let z = 0; z < 16; ++z) {
          const mapIdIndex = z * 16 + x;
          const mapId = mapIds[mapIdIndex];
          let color: RGBAColor;
          if (z === 0) {
            color = MapColors[mapId.mapColorId].color.same;
          } else {
            const previousYLevel = mapIds[mapIdIndex - 16].yLevel;
            if (previousYLevel < mapId.yLevel) {
              color = MapColors[mapId.mapColorId].color.above;
            } else if (previousYLevel === mapId.yLevel) {
              color = MapColors[mapId.mapColorId].color.same;
            } else {
              color = MapColors[mapId.mapColorId].color.below;
            }
          }
          const imageDataIndex = mapIdIndex * 4;
          imageData.data[imageDataIndex] = color.r;
          imageData.data[imageDataIndex + 1] = color.g;
          imageData.data[imageDataIndex + 2] = color.b;
          imageData.data[imageDataIndex + 3] = color.a;
        }
      }

      const imageBitmap = await createImageBitmap(imageData);
      this.chunkImageData.set(`${chunkX},${chunkZ}`, imageBitmap);
      return imageBitmap;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  mouseDown = (event: MouseEvent) => {
    if (this.draggingMap) return;
    this.draggingMap = true;
    this.dragStartOriginCoords.xCoord = this.xCoord;
    this.dragStartOriginCoords.zCoord = this.zCoord;
    this.dragStartCoords.xCoord = event.x;
    this.dragStartCoords.zCoord = event.y;
    this.dragCoords.xCoord = event.x;
    this.dragCoords.zCoord = event.y;
    window.addEventListener("mouseup", this.mouseUp);
    requestAnimationFrame(this.animationFrame);
  };

  mouseMove = (event: MouseEvent) => {
    if (!this.draggingMap) return;
    this.dragCoords.xCoord = event.x;
    this.dragCoords.zCoord = event.y;
  };

  mouseUp = () => {
    if (!this.draggingMap) return;
    this.draggingMap = false;
    window.removeEventListener("mouseup", this.mouseUp);
  };

  animationFrame = () => {
    if (!this.mapCanvas || !this.ctx) return;

    const xShift = Math.round(
      (this.dragCoords.xCoord - this.dragStartCoords.xCoord) / 4
    );
    this.xCoord = this.dragStartOriginCoords.xCoord - xShift;

    const zShift = Math.round(
      (this.dragCoords.zCoord - this.dragStartCoords.zCoord) / 4
    );
    this.zCoord = this.dragStartOriginCoords.zCoord - zShift;

    this.ctx.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
    for (
      let z = this.zOffset + zShift, chunkIndex = 0;
      z < this.mapCanvas.height + zShift;
      z += 16
    ) {
      for (
        let x = this.xOffset + xShift;
        x < this.mapCanvas.width + xShift;
        x += 16, ++chunkIndex
      ) {
        let storedImageBitmap = this.chunkImageData.get(
          this.drawnChunks[chunkIndex]
        );

        if (storedImageBitmap) {
          this.ctx.drawImage(storedImageBitmap, x, z);
        }
      }
    }

    if (this.draggingMap) {
      requestAnimationFrame(this.animationFrame);
    } else {
      this.drawMap();
    }
  };
}
