import { SNBT } from "./snbt";

export interface Level extends SNBT {
  Data?: {
    LevelName?: string;
    WorldGenSettings?: {
      seed?: bigint;
    };
    Version?: {
      Name?: string;
    };
    spawn?: {
      pos?: number[];
      dimension?: string;
    };
    DayTime?: bigint;
    Time?: bigint;
    Difficulty?: number;
    DifficultyLocked?: number;
    hardcore?: number;
    GameType?: number;
    WasModded?: number;
    allowCommands?: number;
    DataPacks?: {
      Disabled?: string[];
      Enabled?: string[];
    };
    game_rules?: {
      [key: string]: number;
    };
  };
}
