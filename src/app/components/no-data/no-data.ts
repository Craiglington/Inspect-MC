import { Component, Input } from "@angular/core";

@Component({
  selector: "app-no-data",
  imports: [],
  templateUrl: "./no-data.html",
  styleUrl: "./no-data.scss"
})
export class NoDataComponent {
  @Input() title: string = "";
  @Input() description: string = "";
}
