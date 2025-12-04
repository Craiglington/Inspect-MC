export interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface MapColor {
  id: number;
  name: string;
  color: {
    below: RGBAColor;
    same: RGBAColor;
    above: RGBAColor;
  };
}
