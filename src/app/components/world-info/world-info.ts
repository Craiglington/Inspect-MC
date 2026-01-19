import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { DatService } from "../../services/dat/dat-service";
import { worldFilesFeature } from "../../store/world-files/world-files.feature";
import { SnbtObjectViewerComponent } from "../snbt-object-viewer/snbt-object-viewer";
import { SNBT } from "../../models/snbt";

@Component({
  selector: "app-world-info",
  imports: [MatIconModule, MatButtonModule, SnbtObjectViewerComponent],
  templateUrl: "./world-info.html",
  styleUrl: "./world-info.scss"
})
export class WorldInfoComponent implements OnInit, OnDestroy {
  private readonly datService = inject(DatService);
  private readonly store = inject(Store);

  private readonly levelFile$ = this.store.select(
    worldFilesFeature.selectLevel
  );
  private levelSubscription!: Subscription;
  protected levelData?: SNBT;

  constructor() {}

  ngOnInit(): void {
    this.levelSubscription = this.levelFile$.subscribe(async (levelFile) => {
      if (levelFile) {
        this.levelData = await this.datService.getSNBT(levelFile);
      } else {
        this.levelData = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    this.levelSubscription.unsubscribe();
  }
}
