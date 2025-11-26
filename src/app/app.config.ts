import { provideHttpClient } from "@angular/common/http";
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from "@angular/core";
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from "@angular/material/tooltip";
import { provideRouter } from "@angular/router";
import { provideStore } from "@ngrx/store";
import { routes } from "./app.routes";
import { provideEffects, provideFeatures } from "./store/store";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore(),
    ...provideFeatures(),
    provideEffects(),
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: { ...MAT_TOOLTIP_DEFAULT_OPTIONS, showDelay: 250 }
    }
  ]
};
