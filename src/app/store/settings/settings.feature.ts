import { createFeature, createReducer, on } from "@ngrx/store";
import {
  clearSettings,
  setAdvancementsSettings,
  setMapsSettings,
  setPlayerDataSettings,
  setStatsSettings,
  setWorldDataSettings
} from "./settings.actions";
import { initialSettingsState, SettingsState } from "./settings.state";

const settingsReducer = createReducer<SettingsState>(
  { ...initialSettingsState },
  on(clearSettings, () => ({ ...initialSettingsState })),
  on(setWorldDataSettings, (state, action) => ({
    ...state,
    worldData: action.settings
  })),
  on(setMapsSettings, (state, action) => ({
    ...state,
    maps: action.settings
  })),
  on(setPlayerDataSettings, (state, action) => ({
    ...state,
    playerData: action.settings
  })),
  on(setStatsSettings, (state, action) => ({
    ...state,
    stats: action.settings
  })),
  on(setAdvancementsSettings, (state, action) => ({
    ...state,
    advancements: action.settings
  }))
);

export const settingsFeature = createFeature({
  name: "settings",
  reducer: settingsReducer
});
