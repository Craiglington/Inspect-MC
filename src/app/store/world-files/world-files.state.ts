export interface WorldFilesState {
  worldInfo: {
    level: File | undefined;
    gameRules: File | undefined;
    weather: File | undefined;
    wanderingTrader: File | undefined;
  };
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
  worldInfo: {
    level: undefined,
    gameRules: undefined,
    weather: undefined,
    wanderingTrader: undefined
  },
  region: {
    overworld: undefined,
    nether: undefined,
    end: undefined
  },
  stats: undefined,
  playerData: undefined,
  advancements: undefined
};
