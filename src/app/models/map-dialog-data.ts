import { FormControl } from "@angular/forms";

export type MapPaletteType = "original" | "blocks-only" | "no-water";
export const MapPaletteOptions = [
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

export interface MapDialogInputData {
  startingXCoord: number;
  startingZCoord: number;
  startingYLevel: number;
  mapPalette: MapPaletteType;
  showCrosshairs: boolean;
}

export interface MapDialogOutputData extends MapDialogInputData {
  files?: FileList;
}

export interface MapDialogForm {
  startingXCoord: FormControl<number>;
  startingZCoord: FormControl<number>;
  startingYLevel: FormControl<number>;
  mapPalette: FormControl<MapPaletteType>;
  showCrosshairs: FormControl<boolean>;
}
