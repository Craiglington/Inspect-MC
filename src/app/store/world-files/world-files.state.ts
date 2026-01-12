export interface WorldFilesState {
  level: File | undefined;
  region: {
    overworld: Map<string, File> | undefined;
    nether: Map<string, File> | undefined;
    end: Map<string, File> | undefined;
  };
  stats: Map<string, File> | undefined;
  playerData: Map<string, File> | undefined;
}

export const initialWorldFilesState: WorldFilesState = {
  level: undefined,
  region: {
    overworld: undefined,
    nether: undefined,
    end: undefined
  },
  stats: undefined,
  playerData: undefined
};
