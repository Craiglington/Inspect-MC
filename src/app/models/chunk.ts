import { SNBT } from "./snbt";

/**
 * This interface is the object version of a palette entry.
 */
export interface BlockPaletteEntryObject extends SNBT {
  "Name"?: string;
  "id"?: string;
  ""?: string;
  "Properties"?: {
    [key: string]: string;
  };
  "properties"?: {
    [key: string]: string;
  };
}

/**
 * A palette entry as of 26.3 is no longer always an object but can also be a string.
 * A palette entry is a Minecraft block with certain properties.
 * The same Minecraft block with different properties can have different map colors.
 */
export type BlockPaletteEntry = string | BlockPaletteEntryObject;

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
