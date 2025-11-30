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
  @Output("change") change: EventEmitter<Event> = new EventEmitter();
}
