import { Component, inject, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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

export type AdvancementsCategory =
  | "minecraft:story"
  | "minecraft:nether"
  | "minecraft:end"
  | "minecraft:adventure"
  | "minecraft:husbandry"
  | "minecraft:recipes";

export interface AdvancementsDialogInputData {
  profiles: Map<string, MinecraftPlayerProfile>;
  activeProfiles: string[];
  advancementsCategory: AdvancementsCategory;
}

export type AdvancementsDialogOutputData = Omit<
  AdvancementsDialogInputData,
  "profiles"
>;

export interface AdvancementsDialogForm {
  activeProfiles: FormControl<string[]>;
  advancementsCategory: FormControl<AdvancementsCategory>;
}

@Component({
  selector: "app-advancements-dialog",
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
  templateUrl: "./advancements-dialog.html",
  styleUrl: "./advancements-dialog.scss"
})
export class AdvancementsDialogComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogData =
    inject<AdvancementsDialogInputData>(MAT_DIALOG_DATA);

  protected readonly advancementsCategoryOptions: {
    text: string;
    value: AdvancementsCategory;
  }[] = [
    {
      text: "Minecraft",
      value: "minecraft:story"
    },
    {
      text: "The Nether",
      value: "minecraft:nether"
    },
    {
      text: "The End",
      value: "minecraft:end"
    },
    {
      text: "Adventure",
      value: "minecraft:adventure"
    },
    {
      text: "Husbandry",
      value: "minecraft:husbandry"
    },
    {
      text: "Recipes",
      value: "minecraft:recipes"
    }
  ];

  protected profiles!: Map<string, MinecraftPlayerProfile>;
  protected formGroup!: FormGroup<AdvancementsDialogForm>;

  ngOnInit(): void {
    this.profiles = this.dialogData.profiles;
    this.formGroup = this.formBuilder.group({
      activeProfiles: new FormControl<string[]>(
        {
          value: this.dialogData.activeProfiles,
          disabled: !this.profiles.size
        },
        {
          nonNullable: true,
          validators: this.maxLength()
        }
      ),
      advancementsCategory: new FormControl(
        this.dialogData.advancementsCategory,
        {
          nonNullable: true,
          validators: Validators.required
        }
      )
    });
  }

  private maxLength = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value.length <= 10) return null;
      return { maxLengthExceeded: true };
    };
  };
}
