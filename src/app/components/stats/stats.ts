import { Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FileReaderService } from "../../services/file-reader/file-reader-service";
import { MatDialog } from "@angular/material/dialog";
import { StatsDialogComponent } from "./stats-dialog/stats-dialog";
import {
  StatsDialogInputData,
  StatsDialogOutputData
} from "../../models/stats-dialog-data";
import { Stats } from "../../models/stats";
import { MinecraftPlayerProfile } from "../../models/minecraft-profile";

@Component({
  selector: "app-stats",
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: "./stats.html",
  styleUrl: "./stats.scss"
})
export class StatsComponent implements OnInit {
  private readonly fileReaderService = inject(FileReaderService);
  private readonly dialog = inject(MatDialog);

  private readonly statsFilePromises: Map<string, Promise<Stats>> = new Map();
  private profiles: Map<string, MinecraftPlayerProfile> = new Map();
  private activeProfiles: string[] = [];

  constructor() {}

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
        activeProfiles: this.activeProfiles
      }
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return;
      this.profiles = data.profiles;
      this.activeProfiles = data.activeProfiles;

      if (data.files) {
        this.processStatsFiles(data.files);
      }
    });
  }

  private processStatsFiles(files: FileList) {
    this.statsFilePromises.clear();
    const statsRegex = new RegExp(
      /^(?<uuid>[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})\.json$/
    );
    for (const file of files) {
      const regexResult = statsRegex.exec(file.name);
      if (!regexResult || !regexResult.groups) continue;
      this.statsFilePromises.set(
        regexResult.groups["uuid"],
        this.fileReaderService.readAsText(file).then((data) => JSON.parse(data))
      );
    }
  }
}
