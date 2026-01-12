import { AsyncPipe } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { Store } from "@ngrx/store";
import { AgGridAngular } from "ag-grid-angular";
import { type ColDef } from "ag-grid-community";
import { darkTheme } from "../../constants/grid-themes/dark-theme";
import { lightTheme } from "../../constants/grid-themes/light-theme";
import { RowData, RowDataType } from "../../models/row-data";
import { SNBT } from "../../models/snbt";
import { DecompressionService } from "../../services/decompression/decompression-service";
import { FileReaderService } from "../../services/file-reader/file-reader-service";
import { NBTService } from "../../services/nbt/nbt-service";
import { NotificationService } from "../../services/notification/notification-service";
import { themeFeature } from "../../store/theme/theme.feature";
import {
  WorldInfoDialogComponent,
  WorldDialogData,
  WorldInfoCategory
} from "./world-info-dialog/world-info-dialog";
import { worldFilesFeature } from "../../store/world-files/world-files.feature";
import { Subscription } from "rxjs";

@Component({
  selector: "app-world",
  imports: [MatIconModule, AgGridAngular, AsyncPipe, MatButtonModule],
  templateUrl: "./world-info.html",
  styleUrl: "./world-info.scss"
})
export class WorldInfoComponent implements OnInit, OnDestroy {
  private readonly fileReaderService = inject(FileReaderService);
  private readonly decompressionService = inject(DecompressionService);
  private readonly notificationService = inject(NotificationService);
  private readonly nbtService = inject(NBTService);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);

  protected readonly appTheme$ = this.store.select(
    themeFeature.selectThemeState
  );
  protected readonly darkTheme = darkTheme;
  protected readonly lightTheme = lightTheme;

  private readonly levelFile$ = this.store.select(
    worldFilesFeature.selectLevel
  );
  private levelSubscription!: Subscription;
  private levelData?: SNBT;

  private worldInfoCategory: WorldInfoCategory = "general_world_info";
  protected rows: RowData[] = [];
  protected columns: ColDef[] = [];
  protected readonly defaultColDef: ColDef = {
    flex: 1
  };

  protected readonly generalTableCols: ColDef[] = [
    {
      headerName: "Data",
      field: "data",
      filter: true
    },
    {
      headerName: "Value",
      field: "value"
    }
  ];

  protected readonly dataPacksTableCols: ColDef[] = [
    {
      headerName: "Data Pack",
      field: "dataPack",
      filter: true
    },
    {
      headerName: "Enabled",
      field: "enabled"
    }
  ];

  protected readonly gameRulesTableCols: ColDef[] = [
    {
      headerName: "Game Rule",
      field: "gameRule",
      filter: true
    },
    {
      headerName: "Value",
      field: "value"
    }
  ];

  ngOnInit(): void {
    this.levelSubscription = this.levelFile$.subscribe(async (levelFile) => {
      if (levelFile) {
        this.levelData = await this.processWorldInfoFile(levelFile);
      } else {
        this.levelData = undefined;
      }
      this.updateTable();
    });
  }

  ngOnDestroy(): void {
    this.levelSubscription.unsubscribe();
  }

  protected openWorldDialog() {
    const dialogRef = this.dialog.open<
      WorldInfoDialogComponent,
      WorldDialogData,
      WorldDialogData
    >(WorldInfoDialogComponent, {
      data: {
        worldInfoCategory: this.worldInfoCategory
      }
    });

    dialogRef.afterClosed().subscribe(async (data) => {
      if (!data) return;
      this.worldInfoCategory = data.worldInfoCategory;
      this.updateTable();
    });
  }

  private async processWorldInfoFile(file: File): Promise<SNBT | undefined> {
    // Get the file data.
    const compressedData = await this.fileReaderService.readAsArrayBuffer(file);

    // Check which compression method was used and decompress the data.
    let decompressedData: ArrayBuffer;
    if (this.decompressionService.isValidGzipData(compressedData)) {
      decompressedData = await this.decompressionService.decompressData(
        compressedData,
        "gzip"
      );
    } else if (this.decompressionService.isValidZlibData(compressedData)) {
      decompressedData = await this.decompressionService.decompressData(
        compressedData,
        "deflate"
      );
    } else {
      decompressedData = compressedData;
    }

    // Check the NBT validity.
    if (!this.nbtService.isValidNBTData(decompressedData)) {
      this.notificationService.notify({
        message: "Invalid level.dat file/format."
      });
      return undefined;
    }

    // Parse the NBT data to get an SNBT.
    return this.nbtService.getSNBT(decompressedData)["Data"] as SNBT;
  }

  private async updateTable() {
    if (!this.levelData) {
      this.columns = [];
      this.rows = [];
    } else if (this.worldInfoCategory === "general_world_info") {
      this.columns = this.generalTableCols;
      this.rows = this.createGeneralWorldInfoData(this.levelData);
    } else if (this.worldInfoCategory === "data_packs") {
      this.columns = this.dataPacksTableCols;
      this.rows = this.createDataPacksData(this.levelData);
    } else if (this.worldInfoCategory === "game_rules") {
      this.columns = this.gameRulesTableCols;
      this.rows = this.createGameRulesData(this.levelData);
    }
  }

  private createGeneralWorldInfoData(worldData: SNBT): RowData[] {
    const rows: RowData[] = [];

    // World Name
    const worldName = worldData["LevelName"] as RowDataType;
    if (worldName !== undefined) {
      rows.push(this.createRow(this.generalTableCols, "World Name", worldName));
    }

    // Seed
    const seed = (worldData["WorldGenSettings"] as SNBT)?.[
      "seed"
    ] as RowDataType;
    if (seed !== undefined) {
      rows.push(this.createRow(this.generalTableCols, "Seed", seed));
    }

    // Minecraft Version
    const minecraftVersion = (worldData["Version"] as SNBT)?.[
      "Name"
    ] as RowDataType;
    if (minecraftVersion !== undefined) {
      rows.push(
        this.createRow(
          this.generalTableCols,
          "Minecraft Version",
          minecraftVersion
        )
      );
    }

    // Spawn Location
    const spawn = worldData["spawn"] as SNBT;
    if (spawn !== undefined) {
      const pos = spawn["pos"] as number[];
      const dimension = spawn["dimension"] as string;
      rows.push(
        this.createRow(
          this.generalTableCols,
          "Spawn Location",
          `${pos[0]}, ${pos[1]}, ${pos[2]} (${dimension})`
        )
      );
    }

    // Time of Day
    const dayTime = worldData["DayTime"] as RowDataType;
    if (dayTime !== undefined) {
      rows.push(
        this.createRow(this.generalTableCols, "Time of Day [0, 24000)", dayTime)
      );
    }

    // World Age
    const time = worldData["Time"] as RowDataType;
    if (time !== undefined) {
      rows.push(
        this.createRow(this.generalTableCols, "World Age (Ticks)", time)
      );
    }

    // Difficulty
    const difficulty = worldData["Difficulty"] as number;
    const difficultyLocked = worldData["DifficultyLocked"] as number;
    if (difficulty !== undefined && difficultyLocked !== undefined) {
      let difficultyName = "";
      if (difficulty === 0) {
        difficultyName = "Peaceful";
      } else if (difficulty === 1) {
        difficultyName = "Easy";
      } else if (difficulty === 2) {
        difficultyName = "Normal";
      } else if (difficulty === 3) {
        difficultyName = "Hard";
      }
      rows.push(
        this.createRow(
          this.generalTableCols,
          "Difficulty",
          `${difficultyName} (${!difficultyLocked ? "Not " : ""}Locked)`
        )
      );
    }

    // Hardcore
    const hardcore = worldData["hardcore"] as number;
    if (hardcore !== undefined) {
      rows.push(
        this.createRow(
          this.generalTableCols,
          "Hardcore",
          hardcore ? true : false
        )
      );
    }

    // Default Game Type
    const gameType = worldData["GameType"] as number;
    if (gameType !== undefined) {
      let gameTypeName = "";
      if (gameType === 0) {
        gameTypeName = "Survival";
      } else if (gameType === 1) {
        gameTypeName = "Creative";
      } else if (gameType === 2) {
        gameTypeName = "Adventure";
      } else if (gameType === 3) {
        gameTypeName = "Spectator";
      }
      rows.push(
        this.createRow(this.generalTableCols, "Default Game Type", gameTypeName)
      );
    }

    // Was Modded
    const wasModded = worldData["WasModded"] as number;
    if (wasModded !== undefined) {
      rows.push(
        this.createRow(
          this.generalTableCols,
          "Was Modded",
          wasModded ? true : false
        )
      );
    }

    // Allow Commands
    const allowCommands = worldData["allowCommands"] as number;
    if (allowCommands !== undefined) {
      rows.push(
        this.createRow(
          this.generalTableCols,
          "Allow Commands",
          allowCommands ? true : false
        )
      );
    }
    return rows;
  }

  private createDataPacksData(worldData: SNBT): RowData[] {
    const rows: RowData[] = [];
    const dataPacks = worldData["DataPacks"] as SNBT;
    const disabledDataPacks = dataPacks?.["Disabled"] as string[];
    const enabledDataPacks = dataPacks?.["Enabled"] as string[];
    if (disabledDataPacks !== undefined) {
      for (const dataPack of disabledDataPacks) {
        rows.push(this.createRow(this.dataPacksTableCols, dataPack, false));
      }
    }
    if (enabledDataPacks !== undefined) {
      for (const dataPack of enabledDataPacks) {
        rows.push(this.createRow(this.dataPacksTableCols, dataPack, true));
      }
    }
    return rows;
  }

  private createGameRulesData(worldData: SNBT): RowData[] {
    const rows: RowData[] = [];
    const gameRules = worldData["game_rules"] as SNBT;
    if (gameRules !== undefined) {
      for (const gameRule in gameRules) {
        rows.push(
          this.createRow(
            this.gameRulesTableCols,
            gameRule,
            gameRules[gameRule] as RowDataType
          )
        );
      }
    }
    return rows;
  }

  private createRow(cols: ColDef[], ...values: RowDataType[]): RowData {
    const row: RowData = {};
    for (let i = 0; i < cols.length; ++i) {
      const field = cols[i]?.field;
      const value = values[i];
      if (field === undefined || value === undefined) continue;
      row[field] = value;
    }
    return row;
  }
}
