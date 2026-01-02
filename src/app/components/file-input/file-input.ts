import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

// webkitdirectory

@Component({
  selector: "app-file-input",
  imports: [MatButtonModule, MatIconModule],
  templateUrl: "./file-input.html",
  styleUrl: "./file-input.scss"
})
export class FileInput implements AfterViewInit, OnChanges {
  @Input("label") label: string = "";
  @Input("multiple") multiple: boolean = false;
  @Input("directory") directory: boolean = false;
  @Output("filesUploaded") filesUploaded: EventEmitter<FileList> =
    new EventEmitter();
  @ViewChild("fileInput") fileInput?: ElementRef<HTMLInputElement>;

  protected numFilesUploaded: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["directory"]) {
      this.toggleDirectoryAttribute();
    }
  }

  ngAfterViewInit(): void {
    this.toggleDirectoryAttribute();
  }

  toggleDirectoryAttribute() {
    if (!this.fileInput || !this.fileInput.nativeElement) return;
    if (this.directory) {
      this.fileInput.nativeElement.setAttribute(
        "webkitdirectory",
        "webkitdirectory"
      );
    } else {
      this.fileInput.nativeElement.removeAttribute("webkitdirectory");
    }
  }

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
