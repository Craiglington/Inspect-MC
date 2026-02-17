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

export type WorldInfoCategory =
  | "level"
  | "game_rules"
  | "weather"
  | "wandering_trader";

export interface WorldInfoDialogData {
  worldInfoCategory: WorldInfoCategory;
}

export interface WorldInfoDialogForm {
  worldInfoCategory: FormControl<WorldInfoCategory>;
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
  templateUrl: "./world-info-dialog.html",
  styleUrl: "./world-info-dialog.scss"
})
export class WorldInfoDialogComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly data = inject<WorldInfoDialogData>(MAT_DIALOG_DATA);

  protected readonly worldInfoOptions: {
    text: string;
    value: WorldInfoCategory;
  }[] = [
    {
      text: "Level",
      value: "level"
    },
    {
      text: "Game Rules*",
      value: "game_rules"
    },
    {
      text: "Weather*",
      value: "weather"
    },
    {
      text: "Wandering Trader*",
      value: "wandering_trader"
    }
  ];

  protected formGroup!: FormGroup<WorldInfoDialogForm>;

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      worldInfoCategory: new FormControl(this.data.worldInfoCategory, {
        nonNullable: true,
        validators: [Validators.required]
      })
    });
  }

  getOutputData(): WorldInfoDialogData {
    return {
      ...this.formGroup.getRawValue()
    };
  }
}
