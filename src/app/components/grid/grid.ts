import { Component, inject, Input } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import { GridColumn, GridRow } from "../../models/gird-data";
import { themeQuartz } from "ag-grid-community";
import { Store } from "@ngrx/store";
import { themeFeature } from "../../store/theme/theme.feature";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-grid",
  imports: [AgGridAngular, AsyncPipe],
  templateUrl: "./grid.html",
  styleUrl: "./grid.scss"
})
export class GridComponent {
  private readonly store = inject(Store);
  @Input("rows") rows: GridRow[] = [];
  @Input("columns") columns: GridColumn[] = [];

  protected readonly defaultColDef: GridColumn = {
    flex: 1
  };

  protected readonly appTheme$ = this.store.select(
    themeFeature.selectThemeState
  );
  protected readonly darkTheme = themeQuartz.withParams({
    headerBackgroundColor: "#131313",
    backgroundColor: "#121212",
    foregroundColor: "#e1e2e6"
  });
  protected readonly lightTheme = themeQuartz.withParams({
    headerBackgroundColor: "#fcf8f8",
    backgroundColor: "#ffffff",
    foregroundColor: "#44474a"
  });
}
