import { Component, Input } from "@angular/core";

@Component({
  selector: "app-minecraft-face",
  imports: [],
  templateUrl: "./minecraft-face.html",
  styleUrl: "./minecraft-face.scss"
})
export class MinecraftFace {
  backgroundImage: string = "";
  @Input() set imageUrl(value: string) {
    this.backgroundImage = `url("${value}")`;
  }
}
