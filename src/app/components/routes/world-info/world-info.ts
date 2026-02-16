import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { SNBT } from "../../../models/snbt";
import { DatService } from "../../../services/dat/dat-service";
import { worldFilesFeature } from "../../../store/world-files/world-files.feature";
import { NoDataComponent } from "../../no-data/no-data";
import { SnbtObjectViewerComponent } from "../../snbt-object-viewer/snbt-object-viewer";

@Component({
  selector: "app-world-info",
  imports: [
    MatIconModule,
    MatButtonModule,
    SnbtObjectViewerComponent,
    NoDataComponent
  ],
  templateUrl: "./world-info.html",
  styleUrl: "./world-info.scss"
})
export class WorldInfoComponent implements OnInit, OnDestroy {
  private readonly datService = inject(DatService);
  private readonly store = inject(Store);

  protected title = "General World Information";
  protected description =
    "World version, spawn location, game rules, time of day, difficulty, etc.";

  private readonly levelFile$ = this.store.select(
    worldFilesFeature.selectLevel
  );
  private levelSubscription!: Subscription;
  protected levelData?: SNBT;

  constructor() {}

  ngOnInit(): void {
    this.levelSubscription = this.levelFile$.subscribe(async (levelFile) => {
      if (levelFile) {
        const snbtData = (await this.datService.getSNBT(levelFile))?.["Data"];
        this.levelData = snbtData
          ? {
              [levelFile.name]: snbtData
            }
          : undefined;
      } else {
        this.levelData = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    this.levelSubscription.unsubscribe();
  }
}
