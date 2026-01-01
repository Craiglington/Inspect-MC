import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";
import { AppConstants } from "../../constants/app-constants";
import { ToggleTheme } from "./toggle-theme/toggle-theme";
import { MatDialog } from "@angular/material/dialog";
import { HelpDialogComponent } from "./help-dialog/help-dialog";

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
  private readonly dialog = inject(MatDialog);
  protected readonly title = AppConstants.appTitle;

  protected help() {
    this.dialog.open(HelpDialogComponent);
  }
}
