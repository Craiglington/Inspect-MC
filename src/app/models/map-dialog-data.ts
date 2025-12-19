import { FormControl } from "@angular/forms";

export type MapColorPalette = "original" | "blocks-only" | "no-water";
export const MapColorPaletteOptions = [
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
  colorPalette: MapColorPalette;
  showCrosshair: boolean;
}

export interface MapDialogOutputData extends MapDialogInputData {
  files?: FileList;
}

export interface MapDialogForm {
  startingXCoord: FormControl<number>;
  startingZCoord: FormControl<number>;
  startingYLevel: FormControl<number>;
  colorPalette: FormControl<MapColorPalette>;
  showCrosshair: FormControl<boolean>;
}
