import { SNBT } from "./snbt";

/**
 * A palette entry is a Minecraft block with certain properties.
 * The same Minecraft block with different properties can have different map colors.
 */
export interface BlockPaletteEntry extends SNBT {
  Name: string;
  Properties?: {
    [key: string]: string;
  };
}

export interface ChunkSection extends SNBT {
  Y: number;
  biomes: {
    palette: string[];
  };
  block_states?: {
    palette: BlockPaletteEntry[];
    data: bigint[];
  };
}

export interface Chunk extends SNBT {
  DataVersion: number;
  Heightmaps?: {
    WORLD_SURFACE?: bigint[];
  };
  InhabitedTime: bigint;
  LastUpdate: bigint;
  Status: string;
  xPos: number;
  yPos: number;
  zPos: number;
  sections: ChunkSection[];
  yMin: number;
}
