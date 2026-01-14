import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { GridCell, GridColumn, GridRow } from "../../models/gird-data";
import { Level } from "../../models/level";
import { DatService } from "../../services/dat/dat-service";
import {
  LocalStorageKey,
  LocalStorageService
} from "../../services/local-storage/local-storage";
import { worldFilesFeature } from "../../store/world-files/world-files.feature";
import { GridComponent } from "../grid/grid";
import {
  WorldInfoCategory,
  WorldInfoDialogComponent,
  WorldInfoDialogData
} from "./world-info-dialog/world-info-dialog";

@Component({
  selector: "app-world",
  imports: [MatIconModule, MatButtonModule, GridComponent],
  templateUrl: "./world-info.html",
  styleUrl: "./world-info.scss"
})
export class WorldInfoComponent implements OnInit, OnDestroy {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly datService = inject(DatService);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);

  private readonly levelFile$ = this.store.select(
    worldFilesFeature.selectLevel
  );
  private levelSubscription!: Subscription;
  private levelData?: Level;

  private worldInfoCategory: WorldInfoCategory;
  protected rows: GridRow[] = [];
  protected columns: GridColumn[] = [];

  protected readonly generalTableColumns: GridColumn[] = [
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

  protected readonly dataPacksTableColumns: GridColumn[] = [
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

  protected readonly gameRulesTableColumns: GridColumn[] = [
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

  constructor() {
    const worldInfoSettings = this.localStorageService.get<WorldInfoDialogData>(
      LocalStorageKey.WORLD_INFO_SETTINGS
    );
    this.worldInfoCategory =
      worldInfoSettings?.worldInfoCategory ?? "general_world_info";
  }

  ngOnInit(): void {
    this.levelSubscription = this.levelFile$.subscribe(async (levelFile) => {
      if (levelFile) {
        this.levelData = await this.datService.getSNBT<Level>(levelFile);
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
      WorldInfoDialogData,
      WorldInfoDialogData
    >(WorldInfoDialogComponent, {
      data: {
        worldInfoCategory: this.worldInfoCategory
      }
    });

    dialogRef.afterClosed().subscribe(async (data) => {
      if (!data) return;
      this.worldInfoCategory = data.worldInfoCategory;
      this.localStorageService.set(LocalStorageKey.WORLD_INFO_SETTINGS, data);
      this.updateTable();
    });
  }

  private async updateTable() {
    if (!this.levelData) {
      this.columns = [];
      this.rows = [];
    } else if (this.worldInfoCategory === "general_world_info") {
      this.columns = this.generalTableColumns;
      this.rows = this.createGeneralWorldInfoData(this.levelData);
    } else if (this.worldInfoCategory === "data_packs") {
      this.columns = this.dataPacksTableColumns;
      this.rows = this.createDataPacksData(this.levelData);
    } else if (this.worldInfoCategory === "game_rules") {
      this.columns = this.gameRulesTableColumns;
      this.rows = this.createGameRulesData(this.levelData);
    }
  }

  private createGeneralWorldInfoData(worldData: Level): GridRow[] {
    const rows: GridRow[] = [];

    // World Name
    const worldName = worldData.Data?.LevelName;
    if (worldName !== undefined) {
      rows.push(
        this.createRow(this.generalTableColumns, "World Name", worldName)
      );
    }

    // Seed
    const seed = worldData.Data?.WorldGenSettings?.seed;
    if (seed !== undefined) {
      rows.push(this.createRow(this.generalTableColumns, "Seed", seed));
    }

    // Minecraft Version
    const minecraftVersion = worldData.Data?.Version?.Name;
    if (minecraftVersion !== undefined) {
      rows.push(
        this.createRow(
          this.generalTableColumns,
          "Minecraft Version",
          minecraftVersion
        )
      );
    }

    // Spawn Location
    const pos = worldData.Data?.spawn?.pos;
    const dimension = worldData.Data?.spawn?.dimension;
    if (pos !== undefined && dimension !== undefined) {
      rows.push(
        this.createRow(
          this.generalTableColumns,
          "Spawn Location",
          `${pos[0]}, ${pos[1]}, ${pos[2]} (${dimension})`
        )
      );
    }

    // Time of Day
    const dayTime = worldData.Data?.DayTime;
    if (dayTime !== undefined) {
      rows.push(
        this.createRow(
          this.generalTableColumns,
          "Time of Day [0, 24000)",
          dayTime
        )
      );
    }

    // World Age
    const time = worldData.Data?.Time;
    if (time !== undefined) {
      rows.push(
        this.createRow(this.generalTableColumns, "World Age (Ticks)", time)
      );
    }

    // Difficulty
    const difficulty = worldData.Data?.Difficulty;
    const difficultyLocked = worldData.Data?.DifficultyLocked;
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
          this.generalTableColumns,
          "Difficulty",
          `${difficultyName} (${!difficultyLocked ? "Not " : ""}Locked)`
        )
      );
    }

    // Hardcore
    const hardcore = worldData.Data?.hardcore;
    if (hardcore !== undefined) {
      rows.push(
        this.createRow(
          this.generalTableColumns,
          "Hardcore",
          hardcore ? true : false
        )
      );
    }

    // Default Game Type
    const gameType = worldData.Data?.GameType;
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
        this.createRow(
          this.generalTableColumns,
          "Default Game Type",
          gameTypeName
        )
      );
    }

    // Was Modded
    const wasModded = worldData.Data?.WasModded;
    if (wasModded !== undefined) {
      rows.push(
        this.createRow(
          this.generalTableColumns,
          "Was Modded",
          wasModded ? true : false
        )
      );
    }

    // Allow Commands
    const allowCommands = worldData.Data?.allowCommands;
    if (allowCommands !== undefined) {
      rows.push(
        this.createRow(
          this.generalTableColumns,
          "Allow Commands",
          allowCommands ? true : false
        )
      );
    }
    return rows;
  }

  private createDataPacksData(worldData: Level): GridRow[] {
    const rows: GridRow[] = [];
    const disabledDataPacks = worldData.Data?.DataPacks?.Disabled;
    const enabledDataPacks = worldData.Data?.DataPacks?.Enabled;
    if (disabledDataPacks !== undefined) {
      for (const dataPack of disabledDataPacks) {
        rows.push(this.createRow(this.dataPacksTableColumns, dataPack, false));
      }
    }
    if (enabledDataPacks !== undefined) {
      for (const dataPack of enabledDataPacks) {
        rows.push(this.createRow(this.dataPacksTableColumns, dataPack, true));
      }
    }
    return rows;
  }

  private createGameRulesData(worldData: Level): GridRow[] {
    const rows: GridRow[] = [];
    const gameRules = worldData.Data?.game_rules;
    if (gameRules !== undefined) {
      for (const gameRule in gameRules) {
        rows.push(
          this.createRow(
            this.gameRulesTableColumns,
            gameRule,
            gameRules[gameRule]
          )
        );
      }
    }
    return rows;
  }

  private createRow(cols: GridColumn[], ...values: GridCell[]): GridRow {
    const row: GridRow = {};
    for (let i = 0; i < cols.length; ++i) {
      const field = cols[i]?.field;
      const value = values[i];
      if (field === undefined || value === undefined) continue;
      row[field] = value;
    }
    return row;
  }
}
