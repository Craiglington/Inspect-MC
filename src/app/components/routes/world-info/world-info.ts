import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { SNBT } from "../../../models/snbt";
import { DatService } from "../../../services/dat/dat-service";
import {
  LocalStorageKey,
  LocalStorageService
} from "../../../services/local-storage/local-storage";
import { worldFilesFeature } from "../../../store/world-files/world-files.feature";
import { WorldFilesState } from "../../../store/world-files/world-files.state";
import { NoDataComponent } from "../../no-data/no-data";
import { SnbtObjectViewerComponent } from "../../snbt-object-viewer/snbt-object-viewer";
import {
  WorldInfoCategory,
  WorldInfoDialogComponent,
  WorldInfoDialogData
} from "./world-info-dialog/world-info-dialog";

export type WorldInfoStoredSettings = Pick<
  WorldInfoDialogData,
  "worldInfoCategory"
>;

@Component({
  selector: "app-world-info",
  imports: [
    MatIconModule,
    MatButtonModule,
    SnbtObjectViewerComponent,
    NoDataComponent,
    MatTooltipModule
  ],
  templateUrl: "./world-info.html",
  styleUrl: "./world-info.scss"
})
export class WorldInfoComponent implements OnInit, OnDestroy {
  private readonly datService = inject(DatService);
  private readonly store = inject(Store);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly dialog = inject(MatDialog);

  protected title = "General World Information";
  protected description =
    "World version, spawn location, game rules, time of day, difficulty, etc.";

  private readonly worldInfoFiles$ = this.store.select(
    worldFilesFeature.selectWorldInfo
  );
  private worldInfoFiles: WorldFilesState["worldInfo"];
  protected worldInfoData?: SNBT;

  private readonly subscriptions: Subscription[] = [];
  private worldInfoCategory: WorldInfoCategory;

  constructor() {
    const worldInfoSettings =
      this.localStorageService.get<WorldInfoStoredSettings>(
        LocalStorageKey.WORLD_INFO_SETTINGS
      );
    this.worldInfoCategory = worldInfoSettings?.worldInfoCategory ?? "level";

    this.worldInfoFiles = {
      level: undefined,
      gameRules: undefined,
      weather: undefined,
      wanderingTrader: undefined
    };
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.worldInfoFiles$.subscribe((worldInfoFiles) => {
        this.worldInfoFiles = worldInfoFiles;
        this.updateWorldInfoData();
      })
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  openWorldInfoDialog() {
    const dialogRef = this.dialog.open<
      WorldInfoDialogComponent,
      WorldInfoDialogData,
      WorldInfoDialogData
    >(WorldInfoDialogComponent, {
      data: {
        worldInfoCategory: this.worldInfoCategory
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return;
      this.worldInfoCategory = data.worldInfoCategory;
      this.localStorageService.set<WorldInfoStoredSettings>(
        LocalStorageKey.WORLD_INFO_SETTINGS,
        { worldInfoCategory: this.worldInfoCategory }
      );
      this.updateWorldInfoData();
    });
  }

  async updateWorldInfoData() {
    let worldInfoFile: File;
    if (this.worldInfoCategory === "level" && this.worldInfoFiles.level) {
      worldInfoFile = this.worldInfoFiles.level;
    } else if (
      this.worldInfoCategory === "game_rules" &&
      this.worldInfoFiles.gameRules
    ) {
      worldInfoFile = this.worldInfoFiles.gameRules;
    } else if (
      this.worldInfoCategory === "weather" &&
      this.worldInfoFiles.weather
    ) {
      worldInfoFile = this.worldInfoFiles.weather;
    } else if (
      this.worldInfoCategory === "wandering_trader" &&
      this.worldInfoFiles.wanderingTrader
    ) {
      worldInfoFile = this.worldInfoFiles.wanderingTrader;
    } else {
      this.worldInfoData = undefined;
      return;
    }

    const snbtData = await this.datService.getSNBT(worldInfoFile);
    this.worldInfoData = snbtData
      ? {
          [worldInfoFile.name]: snbtData
        }
      : undefined;
  }
}
