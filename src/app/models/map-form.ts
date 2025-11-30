import { FormControl } from "@angular/forms";

export interface MapForm {
  xCoordinate: FormControl<number | null>;
  zCoordinate: FormControl<number | null>;
}
