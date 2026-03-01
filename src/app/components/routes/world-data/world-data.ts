import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { SNBT } from "../../../models/snbt";
import { DatService } from "../../../services/dat/dat-service";
import { LocalStorageService } from "../../../services/local-storage/local-storage";
import { worldFilesFeature } from "../../../store/world-files/world-files.feature";
import { WorldFilesState } from "../../../store/world-files/world-files.state";
import { NoDataComponent } from "../../no-data/no-data";
import { SnbtObjectViewerComponent } from "../../snbt-object-viewer/snbt-object-viewer";
import {
  WorldDataDialogComponent,
  WorldDataDialogInputData,
  WorldDataDialogOutputData
} from "./world-data-dialog/world-data-dialog";

export type WorldDataStoredSettings = Pick<
  WorldDataDialogInputData,
  "worldDataFilePath"
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
  templateUrl: "./world-data.html",
  styleUrl: "./world-data.scss"
})
export class WorldDataComponent implements OnInit, OnDestroy {
  private readonly datService = inject(DatService);
  private readonly store = inject(Store);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly dialog = inject(MatDialog);

  protected title = "General World Data";
  protected description =
    "World version, spawn location, game rules, time of day, difficulty, etc.";

  private readonly worldDataFiles$ = this.store.select(
    worldFilesFeature.selectWorldData
  );
  private worldDataFiles: WorldFilesState["worldData"] = [];
  protected worldData?: SNBT;
  private worldDataFilePath: string | null = null;

  private readonly subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this.worldDataFiles$.subscribe((worldDataFiles) => {
        this.worldDataFiles = worldDataFiles;
        this.worldData = undefined;
        this.worldDataFilePath = null;
        if (this.worldDataFiles.length > 0) {
          this.openWorldInfoDialog();
        }
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
      WorldDataDialogComponent,
      WorldDataDialogInputData,
      WorldDataDialogOutputData
    >(WorldDataDialogComponent, {
      data: {
        worldDataFiles: this.worldDataFiles,
        worldDataFilePath: this.worldDataFilePath
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return;
      this.worldDataFilePath = data.worldDataFilePath;
      this.updateWorldInfoData();
    });
  }

  async updateWorldInfoData() {
    if (!this.worldDataFilePath) {
      this.worldData = undefined;
      return;
    }

    const worldDataFile = this.worldDataFiles.find(
      (file) => file.webkitRelativePath === this.worldDataFilePath
    );

    if (!worldDataFile) {
      this.worldData = undefined;
      return;
    }

    const snbtData = await this.datService.getSNBT(worldDataFile);
    this.worldData = snbtData
      ? {
          [worldDataFile.webkitRelativePath]: snbtData
        }
      : undefined;
  }
}
