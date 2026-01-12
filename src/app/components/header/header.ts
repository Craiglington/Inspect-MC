import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";
import { AppConstants } from "../../constants/app-constants";
import { ToggleTheme } from "./toggle-theme/toggle-theme";
import { MatDialog } from "@angular/material/dialog";
import { HelpDialogComponent } from "./help-dialog/help-dialog";
import { UploadDialogComponent } from "./upload-dialog/upload-dialog";
import { Store } from "@ngrx/store";
import { worldFilesFeature } from "../../store/world-files/world-files.feature";
import { AsyncPipe } from "@angular/common";
import { Subscription } from "rxjs";
import {
  initialWorldFilesState,
  WorldFilesState
} from "../../store/world-files/world-files.state";
import { setWorldFiles } from "../../store/world-files/world-files.actions";

@Component({
  selector: "app-header",
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    ToggleTheme,
    MatButtonModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: "./header.html",
  styleUrl: "./header.scss"
})
export class Header implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  protected readonly title = AppConstants.appTitle;

  private readonly worldFiles$ = this.store.select(
    worldFilesFeature.selectWorldFilesState
  );
  private worldFilesSubscription!: Subscription;
  protected worldFiles?: WorldFilesState;

  private readonly levelRegex = new RegExp(/^[^\/]+\/level\.dat$/);
  private readonly overworldRegionRegex = new RegExp(
    /^[^\/]+\/region\/r\.(?<x>-?[0-9]+)\.(?<z>-?[0-9]+)\.mca$/
  );
  private readonly netherRegionRegex = new RegExp(
    /^[^\/]+\/DIM-1\/region\/r\.(?<x>-?[0-9]+)\.(?<z>-?[0-9]+)\.mca$/
  );
  private readonly endRegionRegex = new RegExp(
    /^[^\/]+\/DIM1\/region\/r\.(?<x>-?[0-9]+)\.(?<z>-?[0-9]+)\.mca$/
  );
  private readonly statsRegex = new RegExp(
    /^[^\/]+\/stats\/(?<uuid>[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})\.json$/
  );
  private readonly playerDataRegex = new RegExp(
    /^[^\/]+\/playerdata\/(?<uuid>[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})\.dat$/
  );
  //private readonly overworldRegex

  ngOnInit(): void {
    this.worldFilesSubscription = this.worldFiles$.subscribe((files) => {
      this.worldFiles = files;
    });
    this.openUploadDialog();
  }

  ngOnDestroy(): void {
    this.worldFilesSubscription.unsubscribe();
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
    let levelFile: File | undefined = undefined;
    const overworldFiles: Map<string, File> = new Map();
    const netherFiles: Map<string, File> = new Map();
    const endFiles: Map<string, File> = new Map();
    const statsFiles: Map<string, File> = new Map();
    const playerDataFiles: Map<string, File> = new Map();
    for (const file of files) {
      // Level
      if (this.levelRegex.exec(file.webkitRelativePath)) {
        levelFile = file;
      }

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

      // PlayerData
      this.processUuidFile(file, this.playerDataRegex, playerDataFiles);
    }

    this.store.dispatch(
      setWorldFiles({
        files: {
          level: levelFile,
          region: {
            overworld: overworldFiles.size > 0 ? overworldFiles : undefined,
            nether: netherFiles.size > 0 ? netherFiles : undefined,
            end: endFiles.size > 0 ? endFiles : undefined
          },
          stats: statsFiles.size > 0 ? statsFiles : undefined,
          playerData: playerDataFiles.size > 0 ? playerDataFiles : undefined
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
