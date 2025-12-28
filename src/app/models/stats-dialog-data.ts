import { FormControl } from "@angular/forms";
import { MinecraftPlayerProfile } from "./minecraft-profile";

export interface StatsDialogInputData {
  profiles: Map<string, MinecraftPlayerProfile>;
  activeProfiles: string[];
}

export interface StatsDialogOutputData extends StatsDialogInputData {
  files?: FileList;
}

export interface StatsDialogForm {
  activeProfiles: FormControl<string[]>;
}
