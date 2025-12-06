import { FormControl } from "@angular/forms";

export type MapOrigin = "center" | "top-left";
export const MapOriginOptions = [
  {
    text: "Center",
    value: "center"
  },
  {
    text: "Top Left",
    value: "top-left"
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
  yStartingLevel: number;
  origin: MapOrigin;
  colorPalette: MapColorPalette;
}

export interface MapDialogOutputData extends MapDialogInputData {
  files?: FileList;
}

export interface MapDialogForm {
  xStartingCoord: FormControl<number>;
  zStartingCoord: FormControl<number>;
  yStartingLevel: FormControl<number>;
  origin: FormControl<MapOrigin>;
  colorPalette: FormControl<MapColorPalette>;
}
