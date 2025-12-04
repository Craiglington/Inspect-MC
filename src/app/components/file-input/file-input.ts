import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-file-input",
  imports: [MatButtonModule, MatIconModule],
  templateUrl: "./file-input.html",
  styleUrl: "./file-input.scss"
})
export class FileInput {
  @Input("label") label: string = "";
  @Output("filesUploaded") filesUploaded: EventEmitter<FileList> =
    new EventEmitter();
  numFilesUploaded: number = 0;

  filesUploadedEvent(event: Event) {
    if (!event.target) return;
    const inputElement: HTMLInputElement = event.target as HTMLInputElement;
    if (!inputElement.files?.length) {
      return;
    }
    this.numFilesUploaded = inputElement.files?.length;
    this.filesUploaded.emit(inputElement.files);
  }
}
