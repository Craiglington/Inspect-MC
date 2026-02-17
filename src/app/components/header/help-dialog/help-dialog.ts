import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import { RouterLink } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { ROUTE_PATHS } from "../../../app.routes";
import { AppConstants } from "../../../constants/app-constants";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-help-dialog",
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    RouterLink,
    MatTooltipModule
  ],
  templateUrl: "./help-dialog.html",
  styleUrl: "./help-dialog.scss"
})
export class HelpDialogComponent {
  protected readonly appTitle = AppConstants.appTitle;
  protected readonly appVersion = environment.version;
  protected readonly supportedMinecraftVersions =
    AppConstants.supportedMinecraftVersions;
  protected readonly routePaths = ROUTE_PATHS;
}
