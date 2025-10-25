import { Component } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { NBTService } from "./services/nbt/nbt-service";

export interface WorldFormGroup {
  worldDirectory: FormControl<string[]>;
}

@Component({
  selector: "app-root",
  imports: [ReactiveFormsModule],
  templateUrl: "./app.html",
  styleUrl: "./app.scss"
})
export class App {
  constructor(private readonly NBTService: NBTService) {}

  async worldDirectoryChanged(event: Event) {
    if (!event.target) {
      return;
    }

    const inputElement: HTMLInputElement = event.target as HTMLInputElement;
    if (!inputElement.files?.length) {
      return;
    }

    // Process level.dat
    let levelDatData: ArrayBuffer | undefined = undefined;
    for (const file of inputElement.files) {
      if (file.name === "level.dat") {
        levelDatData = await this.NBTService.getNBTFileData(file);
        break;
      }
    }

    if (!levelDatData) {
      return;
    }

    const snbt = this.NBTService.getSNBT(levelDatData);
    console.log(snbt);
  }
}
