import { EnvironmentProviders } from "@angular/core";
import { provideEffects as provideStoreEffects } from "@ngrx/effects";
import { provideState } from "@ngrx/store";
import { ThemeEffects } from "./theme/theme.effects";
import { themeFeature } from "./theme/theme.feature";
import { worldFilesFeature } from "./world-files/world-files.feature";

/**
 * Add all features here.
 * @returns A list of EnvironmentProviders objects that contain states made from features.
 */
export function provideFeatures(): EnvironmentProviders[] {
  return [provideState(themeFeature), provideState(worldFilesFeature)];
}

/**
 * Add all effects here.
 * @returns An EnvironmentProviders object that contains effects.
 */
export function provideEffects(): EnvironmentProviders {
  return provideStoreEffects(ThemeEffects);
}
