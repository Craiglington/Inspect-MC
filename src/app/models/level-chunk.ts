import { BlockPaletteEntry } from "./chunk";
import { SNBT } from "./snbt";

export interface LevelChunkSection extends SNBT {
  Y: number;
  BlockStates?: bigint[];
  Palette?: BlockPaletteEntry[];
}

export interface LevelChunk extends SNBT {
  DataVersion: number;
  Level: {
    HeightMap: bigint[];
    Heightmaps?: {
      WORLD_SURFACE?: bigint[];
    };
    InhabitedTime: bigint;
    LastUpdate: bigint;
    Status: string;
    xPos: number;
    zPos: number;
    Sections: LevelChunkSection[];
  };
}
