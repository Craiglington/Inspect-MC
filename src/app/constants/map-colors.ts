import { MapColor } from "../models/map-color";
export enum MapIds {
  NONE,
  GRASS,
  SAND,
  WOOL,
  FIRE,
  ICE,
  METAL,
  PLANT,
  SNOW,
  CLAY,
  DIRT,
  STONE,
  WATER,
  WOOD,
  QUARTZ,
  COLOR_ORANGE,
  COLOR_MAGENTA,
  COLOR_LIGHT_BLUE,
  COLOR_YELLOW,
  COLOR_LIGHT_GREEN,
  COLOR_PINK,
  COLOR_GRAY,
  COLOR_LIGHT_GRAY,
  COLOR_CYAN,
  COLOR_PURPLE,
  COLOR_BLUE,
  COLOR_BROWN,
  COLOR_GREEN,
  COLOR_RED,
  COLOR_BLACK,
  GOLD,
  DIAMOND,
  LAPIS,
  EMERALD,
  PODZOL,
  NETHER,
  TERRACOTTA_WHITE,
  TERRACOTTA_ORANGE,
  TERRACOTTA_MAGENTA,
  TERRACOTTA_LIGHT_BLUE,
  TERRACOTTA_YELLOW,
  TERRACOTTA_LIGHT_GREEN,
  TERRACOTTA_PINK,
  TERRACOTTA_GRAY,
  TERRACOTTA_LIGHT_GRAY,
  TERRACOTTA_CYAN,
  TERRACOTTA_PURPLE,
  TERRACOTTA_BLUE,
  TERRACOTTA_BROWN,
  TERRACOTTA_GREEN,
  TERRACOTTA_RED,
  TERRACOTTA_BLACK,
  CRIMSON_NYLIUM,
  CRIMSON_STEM,
  CRIMSON_HYPHAE,
  WARPED_NYLIUM,
  WARPED_STEM,
  WARPED_HYPHAE,
  WARPED_WART_BLOCK,
  DEEPSLATE,
  RAW_IRON,
  GLOW_LICHEN
}

/**
 * The map color's id is equal to its index in the MapColors array.
 */
export const MapColors: MapColor[] = [
  {
    id: MapIds.NONE,
    color: {
      below: { r: 0, g: 0, b: 0, a: 0 },
      same: { r: 0, g: 0, b: 0, a: 0 },
      above: { r: 0, g: 0, b: 0, a: 0 }
    }
  },
  {
    id: MapIds.GRASS,
    color: {
      below: { r: 90, g: 126, b: 39, a: 255 },
      same: { r: 109, g: 153, b: 48, a: 255 },
      above: { r: 127, g: 178, b: 56, a: 255 }
    }
  },
  {
    id: MapIds.SAND,
    color: {
      below: { r: 175, g: 165, b: 115, a: 255 },
      same: { r: 212, g: 200, b: 140, a: 255 },
      above: { r: 247, g: 233, b: 163, a: 255 }
    }
  },
  {
    id: MapIds.WOOL,
    color: {
      below: { r: 141, g: 141, b: 141, a: 255 },
      same: { r: 171, g: 171, b: 171, a: 255 },
      above: { r: 199, g: 199, b: 199, a: 255 }
    }
  },
  {
    id: MapIds.FIRE,
    color: {
      below: { r: 181, g: 0, b: 0, a: 255 },
      same: { r: 219, g: 0, b: 0, a: 255 },
      above: { r: 255, g: 0, b: 0, a: 255 }
    }
  },
  {
    id: MapIds.ICE,
    color: {
      below: { r: 113, g: 113, b: 181, a: 255 },
      same: { r: 137, g: 137, b: 219, a: 255 },
      above: { r: 160, g: 160, b: 255, a: 255 }
    }
  },
  {
    id: MapIds.METAL,
    color: {
      below: { r: 118, g: 118, b: 118, a: 255 },
      same: { r: 143, g: 143, b: 143, a: 255 },
      above: { r: 167, g: 167, b: 167, a: 255 }
    }
  },
  {
    id: MapIds.PLANT,
    color: {
      below: { r: 0, g: 88, b: 0, a: 255 },
      same: { r: 0, g: 106, b: 0, a: 255 },
      above: { r: 0, g: 124, b: 0, a: 255 }
    }
  },
  {
    id: MapIds.SNOW,
    color: {
      below: { r: 181, g: 181, b: 181, a: 255 },
      same: { r: 219, g: 219, b: 219, a: 255 },
      above: { r: 255, g: 255, b: 255, a: 255 }
    }
  },
  {
    id: MapIds.CLAY,
    color: {
      below: { r: 116, g: 119, b: 130, a: 255 },
      same: { r: 141, g: 144, b: 158, a: 255 },
      above: { r: 164, g: 168, b: 184, a: 255 }
    }
  },
  {
    id: MapIds.DIRT,
    color: {
      below: { r: 107, g: 77, b: 54, a: 255 },
      same: { r: 129, g: 93, b: 66, a: 255 },
      above: { r: 151, g: 109, b: 77, a: 255 }
    }
  },
  {
    id: MapIds.STONE,
    color: {
      below: { r: 79, g: 79, b: 79, a: 255 },
      same: { r: 96, g: 96, b: 96, a: 255 },
      above: { r: 112, g: 112, b: 112, a: 255 }
    }
  },
  {
    id: MapIds.WATER,
    color: {
      below: { r: 45, g: 45, b: 181, a: 255 },
      same: { r: 55, g: 55, b: 219, a: 255 },
      above: { r: 64, g: 64, b: 255, a: 255 }
    }
  },
  {
    id: MapIds.WOOD,
    color: {
      below: { r: 101, g: 84, b: 51, a: 255 },
      same: { r: 122, g: 102, b: 61, a: 255 },
      above: { r: 143, g: 119, b: 72, a: 255 }
    }
  },
  {
    id: MapIds.QUARTZ,
    color: {
      below: { r: 181, g: 178, b: 173, a: 255 },
      same: { r: 219, g: 216, b: 210, a: 255 },
      above: { r: 255, g: 252, b: 245, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_ORANGE,
    color: {
      below: { r: 153, g: 90, b: 36, a: 255 },
      same: { r: 185, g: 109, b: 43, a: 255 },
      above: { r: 216, g: 127, b: 51, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_MAGENTA,
    color: {
      below: { r: 126, g: 53, b: 153, a: 255 },
      same: { r: 153, g: 65, b: 185, a: 255 },
      above: { r: 178, g: 76, b: 216, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_LIGHT_BLUE,
    color: {
      below: { r: 72, g: 108, b: 153, a: 255 },
      same: { r: 87, g: 131, b: 185, a: 255 },
      above: { r: 102, g: 153, b: 216, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_YELLOW,
    color: {
      below: { r: 162, g: 162, b: 36, a: 255 },
      same: { r: 196, g: 196, b: 43, a: 255 },
      above: { r: 229, g: 229, b: 51, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_LIGHT_GREEN,
    color: {
      below: { r: 90, g: 144, b: 17, a: 255 },
      same: { r: 109, g: 175, b: 21, a: 255 },
      above: { r: 127, g: 204, b: 25, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_PINK,
    color: {
      below: { r: 171, g: 90, b: 117, a: 255 },
      same: { r: 208, g: 109, b: 141, a: 255 },
      above: { r: 242, g: 127, b: 165, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_GRAY,
    color: {
      below: { r: 53, g: 53, b: 53, a: 255 },
      same: { r: 65, g: 65, b: 65, a: 255 },
      above: { r: 76, g: 76, b: 76, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_LIGHT_GRAY,
    color: {
      below: { r: 108, g: 108, b: 108, a: 255 },
      same: { r: 131, g: 131, b: 131, a: 255 },
      above: { r: 153, g: 153, b: 153, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_CYAN,
    color: {
      below: { r: 53, g: 90, b: 108, a: 255 },
      same: { r: 65, g: 109, b: 131, a: 255 },
      above: { r: 76, g: 127, b: 153, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_PURPLE,
    color: {
      below: { r: 90, g: 44, b: 126, a: 255 },
      same: { r: 109, g: 54, b: 153, a: 255 },
      above: { r: 127, g: 63, b: 178, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_BLUE,
    color: {
      below: { r: 36, g: 53, b: 126, a: 255 },
      same: { r: 43, g: 65, b: 153, a: 255 },
      above: { r: 51, g: 76, b: 178, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_BROWN,
    color: {
      below: { r: 72, g: 53, b: 36, a: 255 },
      same: { r: 87, g: 65, b: 43, a: 255 },
      above: { r: 102, g: 76, b: 51, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_GREEN,
    color: {
      below: { r: 72, g: 90, b: 36, a: 255 },
      same: { r: 87, g: 109, b: 43, a: 255 },
      above: { r: 102, g: 127, b: 51, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_RED,
    color: {
      below: { r: 108, g: 36, b: 36, a: 255 },
      same: { r: 131, g: 43, b: 43, a: 255 },
      above: { r: 153, g: 51, b: 51, a: 255 }
    }
  },
  {
    id: MapIds.COLOR_BLACK,
    color: {
      below: { r: 17, g: 17, b: 17, a: 255 },
      same: { r: 21, g: 21, b: 21, a: 255 },
      above: { r: 25, g: 25, b: 25, a: 255 }
    }
  },
  {
    id: MapIds.GOLD,
    color: {
      below: { r: 177, g: 168, b: 54, a: 255 },
      same: { r: 215, g: 204, b: 66, a: 255 },
      above: { r: 250, g: 238, b: 77, a: 255 }
    }
  },
  {
    id: MapIds.DIAMOND,
    color: {
      below: { r: 65, g: 155, b: 151, a: 255 },
      same: { r: 79, g: 188, b: 183, a: 255 },
      above: { r: 92, g: 219, b: 213, a: 255 }
    }
  },
  {
    id: MapIds.LAPIS,
    color: {
      below: { r: 52, g: 90, b: 181, a: 255 },
      same: { r: 63, g: 110, b: 219, a: 255 },
      above: { r: 74, g: 128, b: 255, a: 255 }
    }
  },
  {
    id: MapIds.EMERALD,
    color: {
      below: { r: 0, g: 154, b: 41, a: 255 },
      same: { r: 0, g: 186, b: 49, a: 255 },
      above: { r: 0, g: 217, b: 58, a: 255 }
    }
  },
  {
    id: MapIds.PODZOL,
    color: {
      below: { r: 91, g: 61, b: 34, a: 255 },
      same: { r: 110, g: 73, b: 42, a: 255 },
      above: { r: 129, g: 86, b: 49, a: 255 }
    }
  },
  {
    id: MapIds.NETHER,
    color: {
      below: { r: 79, g: 1, b: 0, a: 255 },
      same: { r: 96, g: 1, b: 0, a: 255 },
      above: { r: 112, g: 2, b: 0, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_WHITE,
    color: {
      below: { r: 148, g: 125, b: 114, a: 255 },
      same: { r: 179, g: 152, b: 138, a: 255 },
      above: { r: 209, g: 177, b: 161, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_ORANGE,
    color: {
      below: { r: 112, g: 58, b: 25, a: 255 },
      same: { r: 136, g: 70, b: 30, a: 255 },
      above: { r: 159, g: 82, b: 36, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_MAGENTA,
    color: {
      below: { r: 105, g: 61, b: 76, a: 255 },
      same: { r: 128, g: 74, b: 92, a: 255 },
      above: { r: 149, g: 87, b: 108, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_LIGHT_BLUE,
    color: {
      below: { r: 79, g: 76, b: 97, a: 255 },
      same: { r: 96, g: 92, b: 118, a: 255 },
      above: { r: 112, g: 108, b: 138, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_YELLOW,
    color: {
      below: { r: 132, g: 94, b: 25, a: 255 },
      same: { r: 159, g: 114, b: 30, a: 255 },
      above: { r: 186, g: 133, b: 36, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_LIGHT_GREEN,
    color: {
      below: { r: 73, g: 83, b: 37, a: 255 },
      same: { r: 88, g: 100, b: 45, a: 255 },
      above: { r: 103, g: 117, b: 53, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_PINK,
    color: {
      below: { r: 113, g: 54, b: 55, a: 255 },
      same: { r: 137, g: 66, b: 67, a: 255 },
      above: { r: 160, g: 77, b: 78, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_GRAY,
    color: {
      below: { r: 40, g: 29, b: 24, a: 255 },
      same: { r: 49, g: 35, b: 30, a: 255 },
      above: { r: 57, g: 41, b: 35, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_LIGHT_GRAY,
    color: {
      below: { r: 95, g: 75, b: 69, a: 255 },
      same: { r: 116, g: 92, b: 84, a: 255 },
      above: { r: 135, g: 107, b: 98, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_CYAN,
    color: {
      below: { r: 61, g: 65, b: 65, a: 255 },
      same: { r: 74, g: 79, b: 79, a: 255 },
      above: { r: 87, g: 92, b: 92, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_PURPLE,
    color: {
      below: { r: 86, g: 51, b: 62, a: 255 },
      same: { r: 104, g: 62, b: 75, a: 255 },
      above: { r: 122, g: 73, b: 88, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_BLUE,
    color: {
      below: { r: 53, g: 44, b: 65, a: 255 },
      same: { r: 65, g: 53, b: 79, a: 255 },
      above: { r: 76, g: 62, b: 92, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_BROWN,
    color: {
      below: { r: 53, g: 35, b: 24, a: 255 },
      same: { r: 65, g: 43, b: 30, a: 255 },
      above: { r: 76, g: 50, b: 35, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_GREEN,
    color: {
      below: { r: 53, g: 58, b: 29, a: 255 },
      same: { r: 65, g: 70, b: 36, a: 255 },
      above: { r: 76, g: 82, b: 42, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_RED,
    color: {
      below: { r: 100, g: 42, b: 32, a: 255 },
      same: { r: 122, g: 51, b: 39, a: 255 },
      above: { r: 142, g: 60, b: 46, a: 255 }
    }
  },
  {
    id: MapIds.TERRACOTTA_BLACK,
    color: {
      below: { r: 26, g: 15, b: 11, a: 255 },
      same: { r: 31, g: 18, b: 13, a: 255 },
      above: { r: 37, g: 22, b: 16, a: 255 }
    }
  },
  {
    id: MapIds.CRIMSON_NYLIUM,
    color: {
      below: { r: 134, g: 34, b: 34, a: 255 },
      same: { r: 162, g: 41, b: 42, a: 255 },
      above: { r: 189, g: 48, b: 49, a: 255 }
    }
  },
  {
    id: MapIds.CRIMSON_STEM,
    color: {
      below: { r: 105, g: 44, b: 68, a: 255 },
      same: { r: 127, g: 54, b: 83, a: 255 },
      above: { r: 148, g: 63, b: 97, a: 255 }
    }
  },
  {
    id: MapIds.CRIMSON_HYPHAE,
    color: {
      below: { r: 65, g: 17, b: 20, a: 255 },
      same: { r: 79, g: 21, b: 24, a: 255 },
      above: { r: 92, g: 25, b: 29, a: 255 }
    }
  },
  {
    id: MapIds.WARPED_NYLIUM,
    color: {
      below: { r: 15, g: 89, b: 95, a: 255 },
      same: { r: 18, g: 108, b: 115, a: 255 },
      above: { r: 22, g: 126, b: 134, a: 255 }
    }
  },
  {
    id: MapIds.WARPED_STEM,
    color: {
      below: { r: 41, g: 100, b: 99, a: 255 },
      same: { r: 49, g: 122, b: 120, a: 255 },
      above: { r: 58, g: 142, b: 140, a: 255 }
    }
  },
  {
    id: MapIds.WARPED_HYPHAE,
    color: {
      below: { r: 61, g: 31, b: 44, a: 255 },
      same: { r: 73, g: 37, b: 53, a: 255 },
      above: { r: 86, g: 44, b: 62, a: 255 }
    }
  },
  {
    id: MapIds.WARPED_WART_BLOCK,
    color: {
      below: { r: 14, g: 127, b: 94, a: 255 },
      same: { r: 17, g: 154, b: 114, a: 255 },
      above: { r: 20, g: 180, b: 133, a: 255 }
    }
  },
  {
    id: MapIds.DEEPSLATE,
    color: {
      below: { r: 71, g: 71, b: 71, a: 255 },
      same: { r: 86, g: 86, b: 86, a: 255 },
      above: { r: 100, g: 100, b: 100, a: 255 }
    }
  },
  {
    id: MapIds.RAW_IRON,
    color: {
      below: { r: 153, g: 124, b: 104, a: 255 },
      same: { r: 185, g: 150, b: 126, a: 255 },
      above: { r: 216, g: 175, b: 147, a: 255 }
    }
  },
  {
    id: MapIds.GLOW_LICHEN,
    color: {
      below: { r: 90, g: 118, b: 106, a: 255 },
      same: { r: 109, g: 143, b: 129, a: 255 },
      above: { r: 127, g: 167, b: 150, a: 255 }
    }
  }
];
