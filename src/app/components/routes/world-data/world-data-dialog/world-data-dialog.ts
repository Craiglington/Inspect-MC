import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
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
import { WorldFilesState } from "../../../../store/world-files/world-files.state";

export interface WorldDataDialogInputData {
  worldDataFiles: WorldFilesState["worldData"];
  worldDataFilePath: string | null;
}

export interface WorldDataDialogOutputData {
  worldDataFilePath: string | null;
}

export interface WorldInfoDialogForm {
  worldDataFilePath: FormControl<string | null>;
}

@Component({
  selector: "app-world-info-dialog",
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
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: "./world-data-dialog.html",
  styleUrl: "./world-data-dialog.scss"
})
export class WorldDataDialogComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly data = inject<WorldDataDialogInputData>(MAT_DIALOG_DATA);

  protected formGroup!: FormGroup<WorldInfoDialogForm>;

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      worldDataFilePath: new FormControl(
        {
          value: this.data.worldDataFilePath,
          disabled: !this.data.worldDataFiles.length
        },
        {
          nonNullable: true,
          validators: [Validators.required]
        }
      )
    });
  }

  getOutputData(): WorldDataDialogOutputData {
    return {
      ...this.formGroup.getRawValue()
    };
  }
}
