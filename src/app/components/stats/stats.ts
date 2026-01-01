import { Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AgGridAngular } from "ag-grid-angular";
import { themeQuartz, type ColDef } from "ag-grid-community";
import { MinecraftPlayerProfile } from "../../models/minecraft-profile";
import { Stats, StatsCategory } from "../../models/stats";
import { FileReaderService } from "../../services/file-reader/file-reader-service";
import {
  StatsDialogComponent,
  StatsDialogInputData,
  StatsDialogOutputData
} from "./stats-dialog/stats-dialog";
import { RowData } from "../../models/row-data";
import { Store } from "@ngrx/store";
import { themeFeature } from "../../store/theme/theme.feature";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-stats",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    AgGridAngular,
    AsyncPipe
  ],
  templateUrl: "./stats.html",
  styleUrl: "./stats.scss"
})
export class StatsComponent implements OnInit {
  private readonly fileReaderService = inject(FileReaderService);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);

  /**
   * Stored files, stats data, and profiles. Also the stats settings like
   * which profiles are currently active (displayed in the table) and which
   * category of stats is being displayed.
   */
  private statsFiles?: Map<string, File>;
  private readonly statsFileData: Map<string, Stats> = new Map();
  private profiles: Map<string, MinecraftPlayerProfile> = new Map();
  private activeProfiles: string[] = [];
  private statsCategory: StatsCategory = "minecraft:custom";

  /**
   * AG Grid row and column data.
   */
  protected rows: RowData[] = [];
  protected colDefs: ColDef[] = [];
  protected readonly defaultColDef: ColDef = {
    flex: 1
  };

  protected readonly appTheme$ = this.store.select(
    themeFeature.selectThemeState
  );
  protected readonly darkTheme = themeQuartz.withParams({
    headerBackgroundColor: "#131313",
    backgroundColor: "#121212",
    foregroundColor: "#e1e2e6"
  });
  protected readonly lightTheme = themeQuartz.withParams({
    headerBackgroundColor: "#fcf8f8",
    backgroundColor: "#ffffff",
    foregroundColor: "#44474a"
  });

  ngOnInit(): void {
    this.openStatsDialog();
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
      this.profiles = data.profiles;
      this.activeProfiles = data.activeProfiles;
      this.statsCategory = data.statsCategory;

      if (data.files) {
        this.statsFiles = data.files;
        this.statsFileData.clear();
      }
      this.updateTable();
    });
  }

  private async updateTable() {
    const newColDefs: ColDef[] = [{ field: this.statsCategory, filter: true }];
    const newRows: RowData[] = [];

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
      newColDefs.push({ field: profile.username });

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
      const newRow: RowData = {};
      newRow[this.statsCategory] = subcategory;
      for (let i = 1; i < newColDefs.length; ++i) {
        newRow[newColDefs[i].field!] =
          activeStatsData[i - 1].stats[this.statsCategory]?.[subcategory];
      }
      newRows.push(newRow);
    }

    /**
     * Update the table data
     */
    this.colDefs = newColDefs;
    this.rows = newRows;
  }
}
