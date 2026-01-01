import { MapIds } from "../constants/map-colors";

export interface BlockColorWithProperties {
  id: MapIds;
  properties: {
    [key: string]: string;
  };
}

export interface MapPalette {
  [key: string]: MapIds | BlockColorWithProperties[] | undefined;
}
