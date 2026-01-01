import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogTitle,
  MatDialogClose
} from "@angular/material/dialog";
import { AppConstants } from "../../../constants/app-constants";

@Component({
  selector: "app-help-dialog",
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule
  ],
  templateUrl: "./help-dialog.html",
  styleUrl: "./help-dialog.scss"
})
export class HelpDialogComponent {
  protected readonly appTitle = AppConstants.appTitle;
  protected readonly version = AppConstants.version;
}
