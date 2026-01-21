import { createFeature, createReducer, on } from "@ngrx/store";
import {
  clearWorldFiles,
  setAdvancementsFiles,
  setLevelFile,
  setPlayerDataFiles,
  setRegionFiles,
  setStatsFiles,
  setWorldFiles
} from "./world-files.actions";
import { initialWorldFilesState, WorldFilesState } from "./world-files.state";

const worldFilesReducer = createReducer<WorldFilesState>(
  { ...initialWorldFilesState },
  on(clearWorldFiles, (_) => ({ ...initialWorldFilesState })),
  on(setWorldFiles, (_, action) => action.files),
  on(setLevelFile, (state, action) => ({
    ...state,
    level: action.file
  })),
  on(setRegionFiles, (state, action) => ({
    ...state,
    region: action.files
  })),
  on(setStatsFiles, (state, action) => ({
    ...state,
    stats: action.files
  })),
  on(setPlayerDataFiles, (state, action) => ({
    ...state,
    playerData: action.files
  })),
  on(setAdvancementsFiles, (state, action) => ({
    ...state,
    advancements: action.files
  }))
);

export const worldFilesFeature = createFeature({
  name: "worldFiles",
  reducer: worldFilesReducer
});
