import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
  MatSnackBarRef
} from "@angular/material/snack-bar";

@Component({
  selector: "app-notification",
  imports: [MatSnackBarModule, MatIconModule, MatButtonModule],
  templateUrl: "./notification.html",
  styleUrl: "./notification.scss"
})
export class Notification {
  protected readonly snackBarRef = inject(MatSnackBarRef);
  protected readonly message = inject<string>(MAT_SNACK_BAR_DATA);
}
