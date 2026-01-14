import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import {
  PlayerDataCategory,
  PlayerDataDialogComponent,
  PlayerDataDialogInputData,
  PlayerDataDialogOutputData
} from "./player-data-dialog/player-data-dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SpinnerComponent } from "../spinner/spinner";
import { GridComponent } from "../grid/grid";
import {
  LocalStorageKey,
  LocalStorageService
} from "../../services/local-storage/local-storage";
import { FileReaderService } from "../../services/file-reader/file-reader-service";
import { MinecraftProfileService } from "../../services/minecraft-profile/minecraft-profile-service";
import { NotificationService } from "../../services/notification/notification-service";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { catchError, EMPTY, finalize, Subscription } from "rxjs";
import { worldFilesFeature } from "../../store/world-files/world-files.feature";
import { Player } from "../../models/player";
import { MinecraftPlayerProfile } from "../../models/minecraft-profile";
import { GridColumn, GridRow } from "../../models/gird-data";
import { DatService } from "../../services/dat/dat-service";

export type PlayerDataStoredSettings = Pick<
  PlayerDataDialogInputData,
  "playerDataCategory"
>;

@Component({
  selector: "app-player-data",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    SpinnerComponent,
    GridComponent
  ],
  templateUrl: "./player-data.html",
  styleUrl: "./player-data.scss"
})
export class PlayerDataComponent implements OnInit, OnDestroy {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly minecraftProfileService = inject(MinecraftProfileService);
  private readonly notificationService = inject(NotificationService);
  private readonly datService = inject(DatService);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);

  protected loading: boolean = false;
  private readonly subscriptions: Subscription[] = [];

  /**
   * Stored files, stats data, and profiles. Also the stats settings like
   * which profiles are currently active (displayed in the table) and which
   * category of stats is being displayed.
   */
  private readonly playerDataFiles$ = this.store.select(
    worldFilesFeature.selectPlayerData
  );
  private playerDataFiles?: Map<string, File>;
  private readonly playerDataFileData: Map<string, Player> = new Map();
  private profiles: Map<string, MinecraftPlayerProfile> = new Map();
  private activeProfiles: string[] = [];
  private playerDataCategory: PlayerDataCategory;

  /**
   * AG Grid row and column data.
   */
  protected rows: GridRow[] = [];
  protected columns: GridColumn[] = [];

  constructor() {
    const playerDataSettings =
      this.localStorageService.get<PlayerDataStoredSettings>(
        LocalStorageKey.PLAYER_DATA_SETTINGS
      );
    this.playerDataCategory =
      playerDataSettings?.playerDataCategory ?? "general-info";
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.playerDataFiles$.subscribe((files) => {
        this.playerDataFiles = files;
        this.processPlayerDataFiles();
      })
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private processPlayerDataFiles() {
    this.playerDataFileData.clear();
    this.profiles.clear();
    this.activeProfiles = [];

    if (!this.playerDataFiles) return;

    this.loading = true;
    const uuids: string[] = [];
    for (const uuid of this.playerDataFiles.keys()) {
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
          this.openPlayerDataDialog();
        } else {
          this.notificationService.notify({
            message: "No Minecraft profiles found."
          });
        }
      });
  }

  protected openPlayerDataDialog() {
    const dialogRef = this.dialog.open<
      PlayerDataDialogComponent,
      PlayerDataDialogInputData,
      PlayerDataDialogOutputData
    >(PlayerDataDialogComponent, {
      data: {
        profiles: this.profiles,
        activeProfiles: this.activeProfiles,
        playerDataCategory: this.playerDataCategory
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return;
      this.activeProfiles = data.activeProfiles;
      this.playerDataCategory = data.playerDataCategory;

      this.localStorageService.set<PlayerDataStoredSettings>(
        LocalStorageKey.PLAYER_DATA_SETTINGS,
        { playerDataCategory: this.playerDataCategory }
      );
      this.updateTable();
    });
  }

  private async updateTable() {
    if (!this.playerDataFiles) {
      this.columns = [];
      this.rows = [];
    } else if (this.playerDataCategory === "general-info") {
      console.log(
        await this.datService.getSNBT(
          this.playerDataFiles.get(this.activeProfiles[0])!
        )
      );
    } else if (this.playerDataCategory === "inventory") {
    } else if (this.playerDataCategory === "ender-chest") {
    }
    // const newGridColumns: GridColumn[] = [
    //   { field: this.playerDataCategory, filter: true }
    // ];
    // const newGridRows: GridRow[] = [];
  }

  // private createGeneralWorldInfoData(): GridRow[] {
  //     const rows: GridRow[] = [];

  //     // Position
  //     const worldName = worldData.Data?.LevelName;
  //     if (worldName !== undefined) {
  //       rows.push(
  //         this.createRow(this.generalTableColumns, "World Name", worldName)
  //       );
  //     }

  //     return rows;
  //   }
}
