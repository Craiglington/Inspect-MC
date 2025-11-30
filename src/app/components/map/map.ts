import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { AnvilService } from "../../services/anvil/anvil-service";
import { FileReaderService } from "../../services/file-reader/file-reader-service";
import { MapColors } from "../../constants/map-colors";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FileInput } from "../file-input/file-input";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from "@angular/forms";
import { MapForm } from "../../models/map-form";

@Component({
  selector: "app-map",
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FileInput,
    ReactiveFormsModule
  ],
  templateUrl: "./map.html",
  styleUrl: "./map.scss"
})
export class Map implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("mapCanvas") mapCanvas?: ElementRef<HTMLCanvasElement>;
  private readonly fileReaderService = inject(FileReaderService);
  private readonly anvilService = inject(AnvilService);
  private coords = {
    x: 0,
    z: 0
  };

  formGroup!: FormGroup<MapForm>;

  ngOnInit(): void {
    const formBuilder = inject(FormBuilder);
    this.formGroup = formBuilder.group({
      xCoordinate: new FormControl(),
      zCoordinate: new FormControl()
    });
  }

  ngAfterViewInit(): void {
    window.addEventListener("resize", this.resizeCanvas);
    this.resizeCanvas();
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.resizeCanvas);
  }

  resizeCanvas = () => {
    if (!this.mapCanvas || !this.mapCanvas.nativeElement) return;
    const canvas = this.mapCanvas.nativeElement;
    canvas.width = Math.floor(canvas.offsetWidth / 4);
    canvas.height = Math.floor(canvas.offsetHeight / 4);
  };

  async fileUploadChange(event: Event) {
    if (!event.target || !this.mapCanvas || !this.mapCanvas.nativeElement)
      return;

    const ctx = this.mapCanvas.nativeElement.getContext("2d");
    if (!ctx) return;

    const inputElement: HTMLInputElement = event.target as HTMLInputElement;
    if (!inputElement.files?.length) {
      return;
    }
    const startingChunkCoords = this.anvilService.worldBlockCoordsToChunkCoords(
      this.coords.x - this.mapCanvas.nativeElement.width / 2,
      this.coords.z - this.mapCanvas.nativeElement.height / 2
    );
    const numChunksX = Math.ceil(this.mapCanvas.nativeElement.width / 16);
    const numChunksZ = Math.ceil(this.mapCanvas.nativeElement.height / 16);

    for (let i = 0; i < numChunksX; ++i) {
      for (let j = 0; j < numChunksZ; ++j) {
        this.drawChunk(
          inputElement.files,
          ctx,
          startingChunkCoords.chunkX + i,
          startingChunkCoords.chunkZ + j,
          i,
          j
        );
      }
    }
  }

  async drawChunk(
    inputFiles: FileList,
    ctx: CanvasRenderingContext2D,
    chunkX: number,
    chunkZ: number,
    offsetChunkX: number,
    offsetChunkZ: number
  ) {
    const regionCoords = this.anvilService.worldChunkCoordsToRegionCoords(
      chunkX,
      chunkZ
    );

    const regionChunkCoords =
      this.anvilService.worldChunkCoordsToRegionChunkCoords(chunkX, chunkZ);

    for (const file of inputFiles) {
      if (
        file.name === `r.${regionCoords.regionX}.${regionCoords.regionZ}.mca`
      ) {
        const anvilData = await this.fileReaderService.readAsArrayBuffer(file);
        const chunkData = await this.anvilService.getChunkData(
          anvilData,
          regionChunkCoords.chunkX,
          regionChunkCoords.chunkZ
        );

        const offsetX = offsetChunkX * 16;
        const offsetZ = offsetChunkZ * 16;
        if (!chunkData || chunkData.Status !== "minecraft:full") {
          //ctx.fillRect(offsetX, offsetZ, 16, 16);
          return;
        }

        const ids = this.anvilService.getChunkMapIds(chunkData);
        for (let i = 0; i < 16; ++i) {
          for (let j = 0; j < 16; ++j) {
            const mapId = ids[j * 16 + i];
            if (j === 0) {
              ctx.fillStyle = MapColors[mapId.mapColorId].color.same;
            } else {
              const previousYLevel = ids[(j - 1) * 16 + i].yLevel;
              if (previousYLevel < mapId.yLevel) {
                ctx.fillStyle = MapColors[mapId.mapColorId].color.above;
              } else if (previousYLevel === mapId.yLevel) {
                ctx.fillStyle = MapColors[mapId.mapColorId].color.same;
              } else {
                ctx.fillStyle = MapColors[mapId.mapColorId].color.below;
              }
            }
            ctx.fillRect(i + offsetX, j + offsetZ, 1, 1);
          }
        }
      }
    }
  }
}
