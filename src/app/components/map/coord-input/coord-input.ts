import { NgClass } from "@angular/common";
import { Component, forwardRef, Input } from "@angular/core";
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR
} from "@angular/forms";

@Component({
  selector: "app-coord-input",
  imports: [FormsModule, NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CoordInput),
      multi: true
    }
  ],
  templateUrl: "./coord-input.html",
  styleUrl: "./coord-input.scss"
})
export class CoordInput implements ControlValueAccessor {
  @Input("label") label: string = "";
  @Input("name") name: string = "";
  @Input("placeholder") placeholder: number = 0;
  @Input("step") step: number = 1;
  @Input("disabled") disabled: boolean = false;
  protected value?: number;
  private onChange?: (value: number) => void;
  private onTouched?: () => void;

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  valueChanged(value: number) {
    this.value = value;
    if (this.onChange) {
      this.onChange(this.value);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }
}
