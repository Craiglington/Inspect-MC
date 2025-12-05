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
import { MapDialogComponent } from "./map-dialog/map-dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CoordInput } from "./coord-input/coord-input";
import {
  LocalStorageKey,
  LocalStorageService
} from "../../services/local-storage/local-storage";
import { debounceTime } from "rxjs";

@Component({
  selector: "app-map",
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatTooltipModule,
    CoordInput
  ],
  templateUrl: "./map.html",
  styleUrl: "./map.scss"
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("mapCanvas") mapCanvas?: ElementRef<HTMLCanvasElement>;

  private readonly fileReaderService = inject(FileReaderService);
  private readonly anvilService = inject(AnvilService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly dialog = inject(MatDialog);
  private readonly $resizeCanvas: EventEmitter<void> = new EventEmitter();

  private regionFiles: Map<string, Promise<ArrayBuffer>> = new Map();
  private chunkImageData: Map<string, ImageBitmap | null> = new Map();

  regionFilesProcessed = false;
  xStartingCoord: number;
  xCoord: number;
  zStartingCoord: number;
  zCoord: number;
  origin: MapOrigin;
  colorPalette: MapColorPalette;

  constructor() {
    const mapSettings = this.localStorageService.get<MapDialogInputData>(
      LocalStorageKey.MAP_SETTINGS
    );
    this.xStartingCoord = mapSettings?.xStartingCoord ?? 0;
    this.xCoord = this.xStartingCoord;
    this.zStartingCoord = mapSettings?.zStartingCoord ?? 0;
    this.zCoord = this.zStartingCoord;
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
    window.addEventListener("resize", this.windowResizeHandler);
    this.resizeCanvas();
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.windowResizeHandler);
    this.$resizeCanvas.unsubscribe();
  }

  private windowResizeHandler = () => {
    this.$resizeCanvas.emit();
  };

  private resizeCanvas() {
    if (!this.mapCanvas || !this.mapCanvas.nativeElement) return;
    const canvas = this.mapCanvas.nativeElement;
    canvas.width = canvas.offsetWidth / 4;
    canvas.height = canvas.offsetHeight / 4;
    this.drawMap();
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
        origin: this.origin,
        colorPalette: this.colorPalette
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return;
      const { files, ...storedSettings } = data;
      this.xStartingCoord = storedSettings.xStartingCoord;
      this.zStartingCoord = storedSettings.zStartingCoord;
      this.origin = storedSettings.origin;
      this.colorPalette = storedSettings.colorPalette;
      if (files) {
        this.xCoord = this.xStartingCoord;
        this.zCoord = this.zStartingCoord;
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
    if (!this.mapCanvas || !this.mapCanvas.nativeElement) return;
    const canvas = this.mapCanvas.nativeElement;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get current map coords
    const zCurrentCoord = this.zCoord;
    const xCurrentCoord = this.xCoord;
    const chunkCoords = this.anvilService.worldBlockCoordsToChunkCoords(
      xCurrentCoord,
      zCurrentCoord
    );

    // Get offset of starting chunk
    let zOffset = zCurrentCoord % 16;
    zOffset = 0 - (zOffset >= 0 ? zOffset : 16 + zOffset);
    let xOffset = xCurrentCoord % 16;
    xOffset = 0 - (xOffset >= 0 ? xOffset : 16 + xOffset);
    for (
      let z = zOffset, chunkZ = chunkCoords.chunkZ;
      z < canvas.height;
      z += 16, ++chunkZ
    ) {
      for (
        let x = xOffset, chunkX = chunkCoords.chunkX;
        x < canvas.width;
        x += 16, ++chunkX
      ) {
        let storedImageBitmap = this.chunkImageData.get(`${chunkX},${chunkZ}`);
        if (storedImageBitmap === null) continue;

        if (storedImageBitmap) {
          ctx.drawImage(storedImageBitmap, x, z);
          continue;
        }

        this.saveChunkImage(chunkX, chunkZ).then((imageBitmap) => {
          if (imageBitmap) {
            ctx.drawImage(imageBitmap, x, z);
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
      const mapIds = this.anvilService.getChunkMapIds(chunkData);

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
}
