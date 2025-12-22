import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-stats",
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: "./stats.html",
  styleUrl: "./stats.scss"
})
export class Stats {}
