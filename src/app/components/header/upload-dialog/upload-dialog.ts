import { Component } from "@angular/core";
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle
} from "@angular/material/dialog";
import { FileInput } from "../../file-input/file-input";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-upload-dialog",
  imports: [
    MatDialogContent,
    FileInput,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatDialogTitle
  ],
  templateUrl: "./upload-dialog.html",
  styleUrl: "./upload-dialog.scss"
})
export class UploadDialogComponent {
  protected files?: FileList;

  filesUploaded(files: FileList) {
    this.files = files;
  }
}
