import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { filter, Subscription } from "rxjs";
import { AppConstants } from "../../constants/app-constants";
import { setWorldFiles } from "../../store/world-files/world-files.actions";
import { worldFilesFeature } from "../../store/world-files/world-files.feature";
import { WorldFilesState } from "../../store/world-files/world-files.state";
import { HelpDialogComponent } from "./help-dialog/help-dialog";
import { ToggleTheme } from "./toggle-theme/toggle-theme";
import { UploadDialogComponent } from "./upload-dialog/upload-dialog";
import { NgClass } from "@angular/common";
import { ROUTE_PATHS } from "../../app.routes";
import { clearSettings } from "../../store/settings/settings.actions";

@Component({
  selector: "app-header",
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    ToggleTheme,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
    NgClass
  ],
  templateUrl: "./header.html",
  styleUrl: "./header.scss"
})
export class Header implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  protected readonly title = AppConstants.appTitle;
  protected route?: string;
  protected routePaths = ROUTE_PATHS;

  private readonly subscriptions: Subscription[] = [];
  private readonly worldFiles$ = this.store.select(
    worldFilesFeature.selectWorldFilesState
  );
  protected worldFiles?: WorldFilesState;

  private readonly datRegex = new RegExp(/^(?!.*map_[0-9]+\.dat$).+\.dat$/);

  private readonly overworldRegionRegex = new RegExp(
    /^[^/]+(?:\/dimensions\/minecraft\/overworld)?\/region\/r\.(?<x>-?[0-9]+)\.(?<z>-?[0-9]+)\.mca$/
  );
  private readonly netherRegionRegex = new RegExp(
    /^[^/]+\/(?:(?:DIM-1)|(?:dimensions\/minecraft\/the_nether))\/region\/r\.(?<x>-?[0-9]+)\.(?<z>-?[0-9]+)\.mca$/
  );
  private readonly endRegionRegex = new RegExp(
    /^[^/]+\/(?:(?:DIM1)|(?:dimensions\/minecraft\/the_end))\/region\/r\.(?<x>-?[0-9]+)\.(?<z>-?[0-9]+)\.mca$/
  );
  private readonly statsRegex = new RegExp(
    /^[^/]+(?:\/players)?\/stats\/(?<uuid>[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})\.json$/
  );
  private readonly playerDataRegex = new RegExp(
    /^[^/]+\/(?:(?:playerdata)|(?:players\/data))\/(?<uuid>[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})\.dat$/
  );
  private readonly advancementsRegex = new RegExp(
    /^[^/]+(?:\/players)?\/advancements\/(?<uuid>[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})\.json$/
  );

  ngOnInit(): void {
    this.subscriptions.push(
      this.worldFiles$.subscribe((files) => {
        this.worldFiles = files;
      }),
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.route = event.urlAfterRedirects;

          // Only open the upload dialog on the first route navigation
          if (event.id === 1 && this.route !== ROUTE_PATHS.CHANGELOG) {
            this.openUploadDialog();
          }
        })
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  protected openUploadDialog() {
    const dialogRef = this.dialog.open<
      UploadDialogComponent,
      undefined,
      FileList
    >(UploadDialogComponent);

    dialogRef.afterClosed().subscribe((files) => {
      if (!files) return;
      this.processFiles(files);
    });
  }

  private async processFiles(files: FileList) {
    const worldDataFiles: File[] = [];
    const overworldFiles: Map<string, File> = new Map();
    const netherFiles: Map<string, File> = new Map();
    const endFiles: Map<string, File> = new Map();
    const statsFiles: Map<string, File> = new Map();
    const playerDataFiles: Map<string, File> = new Map();
    const advancementsFiles: Map<string, File> = new Map();
    for (const file of files) {
      // Overworld
      if (
        this.processRegionFile(file, this.overworldRegionRegex, overworldFiles)
      ) {
        continue;
      }

      // Nether
      if (this.processRegionFile(file, this.netherRegionRegex, netherFiles)) {
        continue;
      }

      // End
      if (this.processRegionFile(file, this.endRegionRegex, endFiles)) {
        continue;
      }

      // Stats
      if (this.processUuidFile(file, this.statsRegex, statsFiles)) {
        continue;
      }

      // Player Data
      if (this.processUuidFile(file, this.playerDataRegex, playerDataFiles)) {
        continue;
      }

      // Advancements
      this.processUuidFile(file, this.advancementsRegex, advancementsFiles);

      // World Data
      if (this.datRegex.exec(file.webkitRelativePath)) {
        worldDataFiles.push(file);
        continue;
      }
    }

    this.store.dispatch(clearSettings());
    this.store.dispatch(
      setWorldFiles({
        files: {
          worldData: worldDataFiles,
          region: {
            overworld: overworldFiles.size > 0 ? overworldFiles : undefined,
            nether: netherFiles.size > 0 ? netherFiles : undefined,
            end: endFiles.size > 0 ? endFiles : undefined
          },
          stats: statsFiles.size > 0 ? statsFiles : undefined,
          playerData: playerDataFiles.size > 0 ? playerDataFiles : undefined,
          advancements:
            advancementsFiles.size > 0 ? advancementsFiles : undefined
        }
      })
    );
  }

  private processRegionFile(
    file: File,
    regex: RegExp,
    map: Map<string, File>
  ): boolean {
    const match = regex.exec(file.webkitRelativePath);
    if (match) {
      map.set(`${match.groups!["x"]},${match.groups!["z"]}`, file);
      return true;
    }
    return false;
  }

  private processUuidFile(
    file: File,
    regex: RegExp,
    map: Map<string, File>
  ): boolean {
    const match = regex.exec(file.webkitRelativePath);
    if (match) {
      map.set(match.groups!["uuid"], file);
      return true;
    }
    return false;
  }

  protected openHelpDialog() {
    this.dialog.open(HelpDialogComponent);
  }
}
