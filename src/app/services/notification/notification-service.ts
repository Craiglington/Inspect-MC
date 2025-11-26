import { inject, Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from "@angular/material/snack-bar";
import { Notification } from "../../components/notification/notification";

export interface INotification {
  message: string;
  duration?: number | "infinite";
  horizontalPosition?: MatSnackBarHorizontalPosition;
  verticalPosition?: MatSnackBarVerticalPosition;
}

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  notify(notification: INotification) {
    this.snackBar.openFromComponent(Notification, {
      data: notification.message,
      duration: notification.duration
        ? notification.duration === "infinite"
          ? undefined
          : notification.duration
        : 10000,
      horizontalPosition: notification.horizontalPosition || "center",
      verticalPosition: notification.verticalPosition || "top"
    });
  }
}
