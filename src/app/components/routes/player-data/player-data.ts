import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Store } from "@ngrx/store";
import {
  catchError,
  EMPTY,
  finalize,
  Subscription,
  withLatestFrom
} from "rxjs";
import { MinecraftPlayerProfile } from "../../../models/minecraft-profile";
import { SNBT } from "../../../models/snbt";
import { DatService } from "../../../services/dat/dat-service";
import { MinecraftProfileService } from "../../../services/minecraft-profile/minecraft-profile-service";
import { NotificationService } from "../../../services/notification/notification-service";
import { setPlayerDataSettings } from "../../../store/settings/settings.actions";
import { settingsFeature } from "../../../store/settings/settings.feature";
import { worldFilesFeature } from "../../../store/world-files/world-files.feature";
import { NoDataComponent } from "../../no-data/no-data";
import { SnbtObjectViewerComponent } from "../../snbt-object-viewer/snbt-object-viewer";
import { SpinnerComponent } from "../../spinner/spinner";
import {
  PlayerDataDialogComponent,
  PlayerDataDialogInputData,
  PlayerDataDialogOutputData
} from "./player-data-dialog/player-data-dialog";

@Component({
  selector: "app-player-data",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    SpinnerComponent,
    SnbtObjectViewerComponent,
    NoDataComponent
  ],
  templateUrl: "./player-data.html",
  styleUrl: "./player-data.scss"
})
export class PlayerDataComponent implements OnInit, OnDestroy {
  private readonly minecraftProfileService = inject(MinecraftProfileService);
  private readonly notificationService = inject(NotificationService);
  private readonly datService = inject(DatService);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);

  protected readonly title = "Player Data";
  protected readonly description =
    "Current location, respawn location, xp level, inventory items, health, hunger, etc.";

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
  private readonly playerDataSettings$ = this.store.select(
    settingsFeature.selectPlayerData
  );
  private playerDataFiles?: Map<string, File>;
  private readonly playerData: Map<string, SNBT | null> = new Map();
  protected activePlayerData: SNBT | null = null;
  private profiles: Map<string, MinecraftPlayerProfile> = new Map();
  private activeProfile: string | null = null;

  ngOnInit(): void {
    this.subscriptions.push(
      this.playerDataFiles$
        .pipe(withLatestFrom(this.playerDataSettings$))
        .subscribe(([files, playerDataSettings]) => {
          this.playerDataFiles = files;
          this.activeProfile = playerDataSettings.activeProfile;
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
    this.playerData.clear();
    this.profiles.clear();
    this.activePlayerData = null;

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
          if (this.activeProfile) {
            this.updatePlayerData();
          } else {
            this.openPlayerDataDialog();
          }
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
        activeProfile: this.activeProfile
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return;
      this.activeProfile = data.activeProfile;
      this.store.dispatch(
        setPlayerDataSettings({
          settings: {
            activeProfile: this.activeProfile
          }
        })
      );
      this.updatePlayerData();
    });
  }

  private async updatePlayerData() {
    if (!this.playerDataFiles || !this.activeProfile) {
      this.activePlayerData = null;
      return;
    }

    let storedPlayerData = this.playerData.get(this.activeProfile);
    const profile = this.profiles.get(this.activeProfile);
    if (storedPlayerData === undefined) {
      storedPlayerData =
        (await this.datService.getSNBT(
          this.playerDataFiles.get(this.activeProfile)!
        )) || null;
      this.playerData.set(this.activeProfile, storedPlayerData);
    }
    this.activePlayerData = storedPlayerData
      ? {
          [`${this.activeProfile}.dat (${profile?.username})`]: storedPlayerData
        }
      : null;
  }
}
