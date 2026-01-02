import { Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { FileInput } from "../../file-input/file-input";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { MatFormField } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

export type WorldInfoCategory =
  | "general_world_info"
  | "data_packs"
  | "game_rules";

export interface WorldDialogInputData {
  worldInfoCategory: WorldInfoCategory;
}

export interface WorldDialogOutputData extends WorldDialogInputData {
  files?: FileList;
}

export interface WorldDialogForm {
  worldInfoCategory: FormControl<WorldInfoCategory>;
}

@Component({
  selector: "app-world-dialog",
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FileInput,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: "./world-info-dialog.html",
  styleUrl: "./world-info-dialog.scss"
})
export class WorldInfoDialogComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogData = inject<WorldDialogInputData>(MAT_DIALOG_DATA);

  protected readonly worldInfoCategoryOptions: {
    text: string;
    value: WorldInfoCategory;
  }[] = [
    {
      text: "General World Info",
      value: "general_world_info"
    },
    {
      text: "Data Packs",
      value: "data_packs"
    },
    {
      text: "Game Rules",
      value: "game_rules"
    }
  ];
  protected files?: FileList;
  protected formGroup!: FormGroup<WorldDialogForm>;

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      worldInfoCategory: new FormControl(this.dialogData.worldInfoCategory, {
        nonNullable: true,
        validators: Validators.required
      })
    });
  }

  filesUploaded(files: FileList) {
    this.files = files;
  }

  getOutputData(): WorldDialogOutputData {
    return {
      ...this.formGroup.getRawValue(),
      files: this.files
    };
  }
}
