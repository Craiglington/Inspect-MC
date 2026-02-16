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

export type MapDimensionType = "overworld" | "nether" | "end";
export type MapPaletteType = "original" | "blocks-only" | "no-water";

export interface MapDialogData {
  mapDimension: MapDimensionType;
  startingXCoord: number;
  startingZCoord: number;
  startingYLevel: number;
  mapPaletteType: MapPaletteType;
  showCrosshairs: boolean;
}

export interface MapDialogForm {
  mapDimension: FormControl<MapDimensionType>;
  startingXCoord: FormControl<number>;
  startingZCoord: FormControl<number>;
  startingYLevel: FormControl<number>;
  mapPaletteType: FormControl<MapPaletteType>;
  showCrosshairs: FormControl<boolean>;
}

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
    MatCheckboxModule
  ],
  templateUrl: "./map-dialog.html",
  styleUrl: "./map-dialog.scss"
})
export class MapDialogComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly data = inject<MapDialogData>(MAT_DIALOG_DATA);

  protected readonly blockPaletteOptions: {
    text: string;
    value: MapPaletteType;
  }[] = [
    {
      text: "Original",
      value: "original"
    },
    {
      text: "Blocks Only",
      value: "blocks-only"
    },
    {
      text: "No Water",
      value: "no-water"
    }
  ];
  protected readonly mapDimensionOptions: {
    text: string;
    value: MapDimensionType;
  }[] = [
    {
      text: "The Overworld",
      value: "overworld"
    },
    {
      text: "The Nether",
      value: "nether"
    },
    {
      text: "The End",
      value: "end"
    }
  ];

  formGroup!: FormGroup<MapDialogForm>;

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      mapDimension: new FormControl(this.data.mapDimension, {
        nonNullable: true,
        validators: [Validators.required]
      }),
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

  getOutputData(): MapDialogData {
    return {
      ...this.formGroup.getRawValue()
    };
  }
}
