import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Store } from "@ngrx/store";
import { catchError, EMPTY, finalize, Subscription } from "rxjs";
import { GridColumn, GridRow } from "../../../models/gird-data";
import { MinecraftPlayerProfile } from "../../../models/minecraft-profile";
import { Stats } from "../../../models/stats";
import { FileReaderService } from "../../../services/file-reader/file-reader-service";
import {
  LocalStorageKey,
  LocalStorageService
} from "../../../services/local-storage/local-storage";
import { MinecraftProfileService } from "../../../services/minecraft-profile/minecraft-profile-service";
import { NotificationService } from "../../../services/notification/notification-service";
import { worldFilesFeature } from "../../../store/world-files/world-files.feature";
import { GridComponent } from "../../grid/grid";
import { NoDataComponent } from "../../no-data/no-data";
import { SpinnerComponent } from "../../spinner/spinner";
import {
  StatsCategory,
  StatsDialogComponent,
  StatsDialogInputData,
  StatsDialogOutputData
} from "./stats-dialog/stats-dialog";

export type StatsStoredSettings = Pick<StatsDialogInputData, "statsCategory">;

@Component({
  selector: "app-stats",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    SpinnerComponent,
    GridComponent,
    NoDataComponent
  ],
  templateUrl: "./stats.html",
  styleUrl: "./stats.scss"
})
export class StatsComponent implements OnInit, OnDestroy {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly fileReaderService = inject(FileReaderService);
  private readonly minecraftProfileService = inject(MinecraftProfileService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);

  protected title = "Player Statistics";
  protected description =
    "Compare times died, blocks mined, items crafted, monsters killed, etc.";

  protected loading: boolean = false;
  private readonly subscriptions: Subscription[] = [];

  /**
   * Stored files, stats data, and profiles. Also the stats settings like
   * which profiles are currently active (displayed in the table) and which
   * category of stats is being displayed.
   */
  private readonly statsFiles$ = this.store.select(
    worldFilesFeature.selectStats
  );
  private statsFiles?: Map<string, File>;
  private readonly statsFileData: Map<string, Stats> = new Map();
  private profiles: Map<string, MinecraftPlayerProfile> = new Map();
  private activeProfiles: string[] = [];
  private statsCategory: StatsCategory;

  /**
   * AG Grid row and column data.
   */
  protected rows: GridRow[] = [];
  protected columns: GridColumn[] = [];

  constructor() {
    const statsSettings = this.localStorageService.get<StatsStoredSettings>(
      LocalStorageKey.STATS_SETTINGS
    );
    this.statsCategory = statsSettings?.statsCategory ?? "minecraft:custom";
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.statsFiles$.subscribe((files) => {
        this.statsFiles = files;
        this.processStatsFiles();
      })
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private processStatsFiles() {
    this.columns = [];
    this.rows = [];
    this.statsFileData.clear();
    this.profiles.clear();
    this.activeProfiles = [];

    if (!this.statsFiles) return;

    this.loading = true;
    const uuids: string[] = [];
    for (const uuid of this.statsFiles.keys()) {
      uuids.push(uuid);
    }
    this.minecraftProfileService
      .getSortedProfiles(uuids)
      .pipe(
        catchError((error) => {
          console.error(error);
          this.notificationService.notify({
            message: `Failed to load Minecraft profiles: ${error.message ?? error}`
          });
          return EMPTY;
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((sortedProfiles) => {
        for (const profile of sortedProfiles) {
          this.profiles.set(profile.data.player.id, profile.data.player);
        }
        if (this.profiles.size > 0) {
          this.openStatsDialog();
        } else {
          this.notificationService.notify({
            message: "No Minecraft profiles found."
          });
        }
      });
  }

  protected openStatsDialog() {
    const dialogRef = this.dialog.open<
      StatsDialogComponent,
      StatsDialogInputData,
      StatsDialogOutputData
    >(StatsDialogComponent, {
      data: {
        profiles: this.profiles,
        activeProfiles: this.activeProfiles,
        statsCategory: this.statsCategory
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return;
      this.activeProfiles = data.activeProfiles;
      this.statsCategory = data.statsCategory;

      this.localStorageService.set<StatsStoredSettings>(
        LocalStorageKey.STATS_SETTINGS,
        { statsCategory: this.statsCategory }
      );
      this.updateTable();
    });
  }

  private async updateTable() {
    const newGridColumns: GridColumn[] = [
      {
        field: this.statsCategory,
        headerName: this.statsCategory,
        filter: true
      }
    ];
    const newGridRows: GridRow[] = [];

    /**
     * Every stats category has subcategories. For instance, the mined
     * category has subcategories for every block that can be mined.
     * This is a collection of unique subcategories to display in our table.
     * In other words, there is a column for every active profile and a row
     * for every subcategory.
     */
    const statsSubcategories: Set<string> = new Set();

    /**
     * A list of stats data that corresponds to the list
     * of active profiles or profiles that are being displayed.
     */
    const activeStatsData: Stats[] = [];

    // We need a column for every profile being displayed.
    for (const activeProfile of this.activeProfiles) {
      /**
       * Make sure the stats file and profile exist.
       * Add a new column for the active profile.
       */
      const file = this.statsFiles?.get(activeProfile);
      const profile = this.profiles.get(activeProfile);
      if (!file || !profile) continue;
      newGridColumns.push({
        field: profile.username,
        headerName: profile.username
      });

      /**
       * Get the profile's stats. If it is not already loaded,
       * retrieve and store. Also add it to the list of
       * active stats.
       */
      let statsData = this.statsFileData.get(activeProfile);
      if (!statsData) {
        statsData = JSON.parse(
          await this.fileReaderService.readAsText(file)
        ) as Stats;
        this.statsFileData.set(activeProfile, statsData);
      }
      activeStatsData.push(statsData);

      /**
       * If this profile's stats has the current category, add
       * every subcategory to the collection of unique
       * subcategories to display.
       */
      const category = statsData.stats[this.statsCategory];
      if (!category) continue;
      for (const subcategory in category) {
        statsSubcategories.add(subcategory);
      }
    }

    /**
     * Add a new row for each unique subcategory. For each row,
     * add the subcategory and the value for each active profile.
     */
    for (const subcategory of statsSubcategories.values()) {
      const newGridRow: GridRow = {};
      newGridRow[this.statsCategory] = subcategory;
      for (let i = 1; i < newGridColumns.length; ++i) {
        newGridRow[newGridColumns[i].field!] =
          activeStatsData[i - 1].stats[this.statsCategory]?.[subcategory];
      }
      newGridRows.push(newGridRow);
    }

    /**
     * Update the table data
     */
    this.columns = newGridColumns;
    this.rows = newGridRows;
  }
}
