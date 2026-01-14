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
import { StatsCategory } from "../../../models/stats";

export interface StatsDialogInputData {
  profiles: Map<string, MinecraftPlayerProfile>;
  activeProfiles: string[];
  statsCategory: StatsCategory;
}

export type StatsDialogOutputData = Omit<StatsDialogInputData, "profiles">;

export interface StatsDialogForm {
  activeProfiles: FormControl<string[]>;
  statsCategory: FormControl<StatsCategory>;
}

@Component({
  selector: "app-stats-dialog",
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
  templateUrl: "./stats-dialog.html",
  styleUrl: "./stats-dialog.scss"
})
export class StatsDialogComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogData = inject<StatsDialogInputData>(MAT_DIALOG_DATA);

  protected readonly statsCategoryOptions: {
    text: string;
    value: StatsCategory;
  }[] = [
    {
      text: "Broken",
      value: "minecraft:broken"
    },
    {
      text: "Crafted",
      value: "minecraft:crafted"
    },
    {
      text: "Dropped",
      value: "minecraft:dropped"
    },
    {
      text: "General",
      value: "minecraft:custom"
    },
    {
      text: "Killed",
      value: "minecraft:killed"
    },
    {
      text: "Killed By",
      value: "minecraft:killed_by"
    },
    {
      text: "Mined",
      value: "minecraft:mined"
    },

    {
      text: "Picked Up",
      value: "minecraft:picked_up"
    },
    {
      text: "Used",
      value: "minecraft:used"
    }
  ];

  protected files!: Map<string, File>;
  protected profiles!: Map<string, MinecraftPlayerProfile>;
  protected formGroup!: FormGroup<StatsDialogForm>;

  ngOnInit(): void {
    this.files = new Map();
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
      statsCategory: new FormControl(this.dialogData.statsCategory, {
        nonNullable: true,
        validators: Validators.required
      })
    });
  }
}
