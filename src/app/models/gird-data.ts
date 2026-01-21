import { type ColDef } from "ag-grid-community";

export type GridCell =
  | string
  | number
  | boolean
  | bigint
  | Date
  | undefined
  | null;
export type GridRow = {
  [key: string]: GridCell;
};
export type GridColumn = ColDef;
