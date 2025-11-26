import { EnvironmentProviders } from "@angular/core";
import { provideEffects as provideStoreEffects } from "@ngrx/effects";
import { provideState } from "@ngrx/store";
import { ThemeEffects } from "./theme/theme.effects";
import { themeFeature } from "./theme/theme.feature";

/**
 * Add all features here.
 * @returns A list of EnvironmentProviders objects that contain states made from features.
 */
export function provideFeatures(): EnvironmentProviders[] {
  return [provideState(themeFeature)];
}

/**
 * Add all effects here.
 * @returns An EnvironmentProviders object that contains effects.
 */
export function provideEffects(): EnvironmentProviders {
  return provideStoreEffects(ThemeEffects);
}
