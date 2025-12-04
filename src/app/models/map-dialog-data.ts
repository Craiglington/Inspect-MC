import { FormControl } from "@angular/forms";

export type MapOrigin = "center" | "top-left";
export const MapOriginOptions = [
  {
    text: "Top Left",
    value: "top-left"
  },
  {
    text: "Center",
    value: "center"
  }
];

export type MapColorPalette = "original" | "blocks-only";
export const MapColorPaletteOptions = [
  {
    text: "Original",
    value: "original"
  },
  {
    text: "Blocks Only",
    value: "blocks-only"
  }
];

export interface MapDialogInputData {
  xStartingCoord: number;
  zStartingCoord: number;
  origin: MapOrigin;
  colorPalette: MapColorPalette;
}

export interface MapDialogOutputData extends Partial<MapDialogInputData> {
  files?: FileList;
}

export interface MapDialogForm {
  xStartingCoord: FormControl<number>;
  zStartingCoord: FormControl<number>;
  origin: FormControl<MapOrigin>;
  colorPalette: FormControl<MapColorPalette>;
}
