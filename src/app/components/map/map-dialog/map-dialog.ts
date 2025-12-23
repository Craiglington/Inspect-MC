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
import {
  MapDialogForm,
  MapDialogInputData,
  MapDialogOutputData,
  MapPaletteOptions
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
    FileInput,
    MatCheckboxModule
  ],
  templateUrl: "./map-dialog.html",
  styleUrl: "./map-dialog.scss"
})
export class MapDialogComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly data = inject<MapDialogInputData>(MAT_DIALOG_DATA);
  protected files?: FileList;

  readonly blockPaletteOptions = MapPaletteOptions;

  formGroup!: FormGroup<MapDialogForm>;

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      startingXCoord: new FormControl(this.data.startingXCoord, {
        nonNullable: true,
        validators: [
          Validators.max(30_000_000),
          Validators.min(-30_000_000),
          Validators.required
        ]
      }),
      startingZCoord: new FormControl(this.data.startingZCoord, {
        nonNullable: true,
        validators: [
          Validators.max(30_000_000),
          Validators.min(-30_000_000),
          Validators.required
        ]
      }),
      startingYLevel: new FormControl(this.data.startingYLevel, {
        nonNullable: true,
        validators: [
          Validators.max(319),
          Validators.min(-64),
          Validators.required
        ]
      }),
      mapPaletteType: new FormControl(this.data.mapPaletteType, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      showCrosshairs: new FormControl(this.data.showCrosshairs, {
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
