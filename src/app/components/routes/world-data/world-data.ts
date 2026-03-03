import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Store } from "@ngrx/store";
import { Subscription, withLatestFrom } from "rxjs";
import { SNBT } from "../../../models/snbt";
import { DatService } from "../../../services/dat/dat-service";
import { setWorldDataSettings } from "../../../store/settings/settings.actions";
import { settingsFeature } from "../../../store/settings/settings.feature";
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
  private readonly dialog = inject(MatDialog);

  protected readonly title = "General World Data";
  protected readonly description =
    "World version, spawn location, game rules, time of day, difficulty, etc.";

  private readonly worldDataFiles$ = this.store.select(
    worldFilesFeature.selectWorldData
  );
  private readonly worldDataSettings$ = this.store.select(
    settingsFeature.selectWorldData
  );
  private worldDataFiles: WorldFilesState["worldData"] = [];
  private readonly worldData: Map<string, SNBT | null> = new Map();
  protected activeWorldData: SNBT | null = null;
  private worldDataFilePath: string | null = null;

  private readonly subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this.worldDataFiles$
        .pipe(withLatestFrom(this.worldDataSettings$))
        .subscribe(([files, worldDataSettings]) => {
          this.worldDataFiles = files;
          this.worldData.clear();
          this.activeWorldData = null;
          this.worldDataFilePath = worldDataSettings.worldDataFilePath;
          if (this.worldDataFiles.length > 0) {
            if (this.worldDataFilePath) {
              this.updateWorldInfoData();
            } else {
              this.openWorldInfoDialog();
            }
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
      this.store.dispatch(
        setWorldDataSettings({
          settings: {
            worldDataFilePath: this.worldDataFilePath
          }
        })
      );
      this.updateWorldInfoData();
    });
  }

  async updateWorldInfoData() {
    if (!this.worldDataFilePath) {
      this.activeWorldData = null;
      return;
    }

    const worldDataFile = this.worldDataFiles.find(
      (file) => file.webkitRelativePath === this.worldDataFilePath
    )!;

    let storedWorldData = this.worldData.get(this.worldDataFilePath);
    if (storedWorldData === undefined) {
      storedWorldData = (await this.datService.getSNBT(worldDataFile)) || null;
      this.worldData.set(this.worldDataFilePath, storedWorldData);
    }

    this.activeWorldData = storedWorldData
      ? {
          [worldDataFile.webkitRelativePath]: storedWorldData
        }
      : null;
  }
}
