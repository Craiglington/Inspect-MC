import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MinecraftPlayerProfile } from "../../../../models/minecraft-profile";

export interface PlayerDataDialogInputData {
  profiles: Map<string, MinecraftPlayerProfile>;
  activeProfile: string | null;
}

export type PlayerDataDialogOutputData = Omit<
  PlayerDataDialogInputData,
  "profiles"
>;

export interface PlayerDataDialogForm {
  activeProfile: FormControl<string | null>;
}

@Component({
  selector: "app-player-data-dialog",
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: "./player-data-dialog.html",
  styleUrl: "./player-data-dialog.scss"
})
export class PlayerDataDialogComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogData =
    inject<PlayerDataDialogInputData>(MAT_DIALOG_DATA);

  protected profiles!: Map<string, MinecraftPlayerProfile>;
  protected formGroup!: FormGroup<PlayerDataDialogForm>;

  ngOnInit(): void {
    this.profiles = this.dialogData.profiles;
    this.formGroup = this.formBuilder.group({
      activeProfile: new FormControl<string | null>({
        value: this.dialogData.activeProfile,
        disabled: !this.profiles.size
      })
    });
  }
}
