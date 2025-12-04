import { FormControl } from "@angular/forms";

export interface MapForm {
  xCoord: FormControl<number>;
  zCoord: FormControl<number>;
}
