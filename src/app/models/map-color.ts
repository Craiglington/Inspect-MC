export interface MapColor {
  id: number;
  name: string;
  color: {
    below: string;
    same: string;
    above: string;
  };
}
