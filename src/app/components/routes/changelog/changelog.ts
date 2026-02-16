import { Component } from "@angular/core";
import { ChangeLogData } from "./changelog-data";
import { SnbtObjectViewerComponent } from "../../snbt-object-viewer/snbt-object-viewer";

@Component({
  selector: "app-change-log",
  imports: [SnbtObjectViewerComponent],
  templateUrl: "./changelog.html",
  styleUrl: "./changelog.scss"
})
export class ChangeLogComponent {
  protected readonly changeLogData = ChangeLogData;
}
