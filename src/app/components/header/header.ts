import { Component, inject } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { ToggleTheme } from "./toggle-theme/toggle-theme";
import { NotificationService } from "../../services/notification/notification-service";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AppConstants } from "../../constants/app-constants";
import { RouterLink } from "@angular/router";

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
  private readonly notification = inject(NotificationService);
  title = AppConstants.appTitle;
  contactUs() {
    this.notification.notify({
      message: `Email me at ${AppConstants.contactEmail}.`
    });
  }
}
