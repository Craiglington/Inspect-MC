import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Store } from "@ngrx/store";
import { catchError, EMPTY, finalize, Subscription } from "rxjs";
import { Advancements } from "../../models/advancements";
import { GridColumn, GridRow } from "../../models/gird-data";
import { MinecraftPlayerProfile } from "../../models/minecraft-profile";
import { FileReaderService } from "../../services/file-reader/file-reader-service";
import {
  LocalStorageKey,
  LocalStorageService
} from "../../services/local-storage/local-storage";
import { MinecraftProfileService } from "../../services/minecraft-profile/minecraft-profile-service";
import { NotificationService } from "../../services/notification/notification-service";
import { worldFilesFeature } from "../../store/world-files/world-files.feature";
import { GridComponent } from "../grid/grid";
import { NoDataComponent } from "../no-data/no-data";
import { SpinnerComponent } from "../spinner/spinner";
import {
  AdvancementsCategory,
  AdvancementsDialogComponent,
  AdvancementsDialogInputData,
  AdvancementsDialogOutputData
} from "./advancements-dialog/advancements-dialog";

export type AdvancementsStoredSettings = Pick<
  AdvancementsDialogInputData,
  "advancementsCategory"
>;

@Component({
  selector: "app-advancements",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    SpinnerComponent,
    GridComponent,
    NoDataComponent
  ],
  templateUrl: "./advancements.html",
  styleUrl: "./advancements.scss"
})
export class AdvancementsComponent implements OnInit, OnDestroy {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly fileReaderService = inject(FileReaderService);
  private readonly minecraftProfileService = inject(MinecraftProfileService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);

  protected loading: boolean = false;
  private readonly subscriptions: Subscription[] = [];

  private readonly advancementsFiles$ = this.store.select(
    worldFilesFeature.selectAdvancements
  );
  private advancementsFiles?: Map<string, File>;
  private readonly advancementsFileData: Map<string, Advancements> = new Map();
  private profiles: Map<string, MinecraftPlayerProfile> = new Map();
  private activeProfiles: string[] = [];
  private advancementsCategory: AdvancementsCategory;

  /**
   * AG Grid row and column data.
   */
  protected rows: GridRow[] = [];
  protected columns: GridColumn[] = [];

  constructor() {
    const advancementsSettings =
      this.localStorageService.get<AdvancementsStoredSettings>(
        LocalStorageKey.ADVANCEMENTS_SETTINGS
      );
    this.advancementsCategory =
      advancementsSettings?.advancementsCategory ?? "minecraft:story";
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.advancementsFiles$.subscribe((files) => {
        this.advancementsFiles = files;
        this.processAdvancementsFiles();
      })
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private processAdvancementsFiles() {
    this.columns = [];
    this.rows = [];
    this.advancementsFileData.clear();
    this.profiles.clear();
    this.activeProfiles = [];

    if (!this.advancementsFiles) return;

    this.loading = true;
    const uuids: string[] = [];
    for (const uuid of this.advancementsFiles.keys()) {
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
          this.openAdvancementsDialog();
        } else {
          this.notificationService.notify({
            message: "No Minecraft profiles found."
          });
        }
      });
  }

  protected openAdvancementsDialog() {
    const dialogRef = this.dialog.open<
      AdvancementsDialogComponent,
      AdvancementsDialogInputData,
      AdvancementsDialogOutputData
    >(AdvancementsDialogComponent, {
      data: {
        profiles: this.profiles,
        activeProfiles: this.activeProfiles,
        advancementsCategory: this.advancementsCategory
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return;
      this.activeProfiles = data.activeProfiles;
      this.advancementsCategory = data.advancementsCategory;

      this.localStorageService.set<AdvancementsStoredSettings>(
        LocalStorageKey.STATS_SETTINGS,
        { advancementsCategory: this.advancementsCategory }
      );
      this.updateTable();
    });
  }

  private async updateTable() {
    const newGridColumns: GridColumn[] = [
      { field: this.advancementsCategory, filter: true }
    ];
    const newGridRows: GridRow[] = [];

    const uniqueAdvancements: Set<string> = new Set();
    const activeAdvancementsData: Advancements[] = [];

    for (const activeProfile of this.activeProfiles) {
      const file = this.advancementsFiles?.get(activeProfile);
      const profile = this.profiles.get(activeProfile);
      if (!file || !profile) continue;
      newGridColumns.push({ field: profile.username });

      let advancementsData = this.advancementsFileData.get(activeProfile);
      if (!advancementsData) {
        advancementsData = JSON.parse(
          await this.fileReaderService.readAsText(file)
        ) as Advancements;
        this.advancementsFileData.set(activeProfile, advancementsData);
      }
      activeAdvancementsData.push(advancementsData);

      const advancementEntries = Object.entries(advancementsData).filter(
        (entry) =>
          entry[0].startsWith(this.advancementsCategory) && entry[1]?.done
      );
      for (const advancementEntry of advancementEntries) {
        uniqueAdvancements.add(advancementEntry[0]);
      }
    }

    for (const advancementName of uniqueAdvancements.values()) {
      const newGridRow: GridRow = {};
      newGridRow[this.advancementsCategory] = advancementName.slice(
        this.advancementsCategory.length + 1
      );
      for (let i = 1; i < newGridColumns.length; ++i) {
        const criteria =
          activeAdvancementsData[i - 1][advancementName]?.criteria;
        newGridRow[newGridColumns[i].field!] = criteria
          ? this.getDateAchieved(Object.values(criteria))
          : undefined;
      }
      newGridRows.push(newGridRow);
    }

    /**
     * Update the table data
     */
    this.columns = newGridColumns;
    this.rows = newGridRows;
  }

  private getDateAchieved(dates: string[]): string {
    let date: Date;
    if (dates.length === 1) {
      date = new Date(dates[0]);
    } else {
      date = new Date([...dates].sort()[dates.length - 1]);
    }
    return date.toISOString().slice(0, 10);
  }
}
