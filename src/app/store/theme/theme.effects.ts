import { DOCUMENT } from "@angular/common";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType, OnInitEffects } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { tap, withLatestFrom } from "rxjs";
import { init as initAction, toggle as toggleAction } from "./theme.actions";

@Injectable()
export class ThemeEffects implements OnInitEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private document = inject(DOCUMENT);

  ngrxOnInitEffects(): Action {
    return initAction();
  }

  setAppTheme = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(toggleAction, initAction),
        withLatestFrom(
          this.store.select((state: { theme: string }) => state.theme)
        ),
        tap(([, theme]) => {
          localStorage.setItem("theme", theme);
          if (theme === "light") {
            this.document.documentElement.classList.remove("dark-mode");
          } else {
            this.document.documentElement.classList.add("dark-mode");
          }
        })
      );
    },
    { functional: true, dispatch: false }
  );
}
