import { createAction, props } from "@ngrx/store";
import { WorldFilesState } from "./world-files.state";

export const clearWorldFiles = createAction("[World Files] Clear World Files");
export const setWorldFiles = createAction(
  "[World Files] Clear World Files",
  props<{ files: WorldFilesState }>()
);
export const setLevelFile = createAction(
  "[World Files] Set Level File",
  props<{ file: File | undefined }>()
);
export const setRegionFiles = createAction(
  "[World Files] Set Region Files",
  props<{ files: WorldFilesState["region"] }>()
);
export const setStatsFiles = createAction(
  "[World Files] Set Stats Files",
  props<{ files: Map<string, File> | undefined }>()
);
export const setPlayerDataFiles = createAction(
  "[World Files] Set Player Data Files",
  props<{ files: Map<string, File> | undefined }>()
);
