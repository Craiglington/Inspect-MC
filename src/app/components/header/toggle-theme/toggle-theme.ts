import { Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { themeFeature } from "../../../store/theme/theme.feature";
import { toggle } from "../../../store/theme/theme.actions";
import { MatIconModule } from "@angular/material/icon";
import { AsyncPipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-toggle-theme",
  imports: [MatIconModule, AsyncPipe, MatButtonModule, MatTooltipModule],
  templateUrl: "./toggle-theme.html",
  styleUrl: "./toggle-theme.scss"
})
export class ToggleTheme {
  private readonly store = inject(Store);
  protected theme$ = this.store.select(themeFeature.selectThemeState);

  toggleTheme() {
    this.store.dispatch(toggle());
  }
}
