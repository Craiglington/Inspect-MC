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

  readonly dialogRef = inject(MatDialogRef<MapDialogComponent>);
  readonly data = inject<MapDialogInputData>(MAT_DIALOG_DATA);
  readonly originOptions = MapOriginOptions;
  readonly colorPaletteOptions = MapColorPaletteOptions;

  formGroup!: FormGroup<MapDialogForm>;
  files?: FileList;
  errorMessage = "Range: [-30 million, 30 million]";

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      xStartingCoord: new FormControl(this.data.xStartingCoord, {
        nonNullable: true,
        validators: [Validators.max(30_000_000), Validators.min(-30_000_000)]
      }),
      zStartingCoord: new FormControl(this.data.zStartingCoord, {
        nonNullable: true,
        validators: [Validators.max(30_000_000), Validators.min(-30_000_000)]
      }),
      origin: new FormControl(this.data.origin, {
        nonNullable: true
      }),
      colorPalette: new FormControl(this.data.colorPalette, {
        nonNullable: true
      })
    });
  }

  filesUploaded(files: FileList) {
    this.files = files;
  }

  getOutputData(): MapDialogOutputData {
    return {
      ...this.formGroup.value,
      files: this.files
    };
  }
}
