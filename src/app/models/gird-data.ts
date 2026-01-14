import { type ColDef } from "ag-grid-community";

export type GridCell = string | number | boolean | bigint | undefined;
export type GridRow = {
  [key: string]: GridCell;
};
export type GridColumn = ColDef;
