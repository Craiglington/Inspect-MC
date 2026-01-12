import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogTitle,
  MatDialogClose
} from "@angular/material/dialog";
import { AppConstants } from "../../../constants/app-constants";
import { environment } from "../../../../environments/environment";

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
  protected readonly appVersion = environment.version;
  protected readonly supportedMinecraftVersions =
    AppConstants.supportedMinecraftVersions;
}
