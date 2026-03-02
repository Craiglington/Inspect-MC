import { createAction, props } from "@ngrx/store";
import { SettingsState } from "./settings.state";

export const clearSettings = createAction("[Settings] Clear Settings");
export const setWorldDataSettings = createAction(
  "[Settings] Set World Data Settings",
  props<{ settings: SettingsState["worldData"] }>()
);
export const setMapsSettings = createAction(
  "[Settings] Set Maps Settings",
  props<{ settings: SettingsState["maps"] }>()
);
export const setPlayerDataSettings = createAction(
  "[Settings] Set Player Data Settings",
  props<{ settings: SettingsState["playerData"] }>()
);
export const setStatsSettings = createAction(
  "[Settings] Set Stats Settings",
  props<{ settings: SettingsState["stats"] }>()
);
export const setAdvancementsSettings = createAction(
  "[Settings] Set Advancements Settings",
  props<{ settings: SettingsState["advancements"] }>()
);
