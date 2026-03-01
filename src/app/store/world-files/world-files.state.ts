export interface WorldFilesState {
  worldData: File[];
  region: {
    overworld: Map<string, File> | undefined;
    nether: Map<string, File> | undefined;
    end: Map<string, File> | undefined;
  };
  stats: Map<string, File> | undefined;
  playerData: Map<string, File> | undefined;
  advancements: Map<string, File> | undefined;
}

export const initialWorldFilesState: WorldFilesState = {
  worldData: [],
  region: {
    overworld: undefined,
    nether: undefined,
    end: undefined
  },
  stats: undefined,
  playerData: undefined,
  advancements: undefined
};
