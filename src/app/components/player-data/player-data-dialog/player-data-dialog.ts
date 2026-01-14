import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
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
import { MinecraftPlayerProfile } from "../../../models/minecraft-profile";

export type PlayerDataCategory = "general-info" | "inventory" | "ender-chest";

export interface PlayerDataDialogInputData {
  profiles: Map<string, MinecraftPlayerProfile>;
  activeProfiles: string[];
  playerDataCategory: PlayerDataCategory;
}

export type PlayerDataDialogOutputData = Omit<
  PlayerDataDialogInputData,
  "profiles"
>;

export interface PlayerDataDialogForm {
  activeProfiles: FormControl<string[]>;
  playerDataCategory: FormControl<PlayerDataCategory>;
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

  protected readonly playerDataCategoryOptions: {
    text: string;
    value: PlayerDataCategory;
  }[] = [
    {
      text: "General Player Info",
      value: "general-info"
    },
    {
      text: "Player Inventory",
      value: "inventory"
    },
    {
      text: "Ender Chest Contents",
      value: "ender-chest"
    }
  ];

  protected profiles!: Map<string, MinecraftPlayerProfile>;
  protected formGroup!: FormGroup<PlayerDataDialogForm>;

  ngOnInit(): void {
    this.profiles = this.dialogData.profiles;
    this.formGroup = this.formBuilder.group({
      activeProfiles: new FormControl<string[]>(
        {
          value: this.dialogData.activeProfiles,
          disabled: !this.profiles.size
        },
        {
          nonNullable: true
        }
      ),
      playerDataCategory: new FormControl(this.dialogData.playerDataCategory, {
        nonNullable: true,
        validators: Validators.required
      })
    });
  }
}
