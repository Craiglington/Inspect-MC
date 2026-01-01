import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";
import { AppConstants } from "../../constants/app-constants";
import { ToggleTheme } from "./toggle-theme/toggle-theme";

@Component({
  selector: "app-header",
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    ToggleTheme,
    MatButtonModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: "./header.html",
  styleUrl: "./header.scss"
})
export class Header {
  protected readonly title = AppConstants.appTitle;
}
