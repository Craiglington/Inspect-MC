export interface SettingsState {
  worldData: {
    worldDataFilePath: string | null;
  };
  maps: {
    coords: {
      x: number;
      y: number;
      z: number;
    } | null;
    zoom: number | null;
  };
  playerData: {
    activeProfile: string | null;
  };
  stats: {
    activeProfiles: string[];
  };
  advancements: {
    activeProfiles: string[];
  };
}

export const initialSettingsState: SettingsState = {
  worldData: {
    worldDataFilePath: null
  },
  maps: {
    coords: null,
    zoom: null
  },
  playerData: {
    activeProfile: null
  },
  stats: {
    activeProfiles: []
  },
  advancements: {
    activeProfiles: []
  }
};
