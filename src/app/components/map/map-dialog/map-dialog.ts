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
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import {
  MapColorPaletteOptions,
  MapDialogForm,
  MapDialogInputData,
  MapDialogOutputData,
  MapOriginOptions
} from "../../../models/map-dialog-data";
import { FileInput } from "../../file-input/file-input";

@Component({
  selector: "app-map-dialog",
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
    FileInput
  ],
  templateUrl: "./map-dialog.html",
  styleUrl: "./map-dialog.scss"
})
export class MapDialogComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly data = inject<MapDialogInputData>(MAT_DIALOG_DATA);
  protected files?: FileList;

  readonly originOptions = MapOriginOptions;
  readonly colorPaletteOptions = MapColorPaletteOptions;

  formGroup!: FormGroup<MapDialogForm>;

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      xStartingCoord: new FormControl(this.data.xStartingCoord, {
        nonNullable: true,
        validators: [
          Validators.max(30_000_000),
          Validators.min(-30_000_000),
          Validators.required
        ]
      }),
      zStartingCoord: new FormControl(this.data.zStartingCoord, {
        nonNullable: true,
        validators: [
          Validators.max(30_000_000),
          Validators.min(-30_000_000),
          Validators.required
        ]
      }),
      yStartingLevel: new FormControl(this.data.yStartingLevel, {
        nonNullable: true,
        validators: [
          Validators.max(319),
          Validators.min(-64),
          Validators.required
        ]
      }),
      origin: new FormControl(this.data.origin, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      colorPalette: new FormControl(this.data.colorPalette, {
        nonNullable: true,
        validators: [Validators.required]
      })
    });
  }

  filesUploaded(files: FileList) {
    this.files = files;
  }

  getOutputData(): MapDialogOutputData {
    return {
      ...this.formGroup.getRawValue(),
      files: this.files
    };
  }
}
