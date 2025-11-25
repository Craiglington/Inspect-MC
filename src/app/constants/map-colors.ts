import { MapColor } from "../models/map-color";

/**
 * The map color's id is equal to its index in the MapColors array.
 */
export const MapColors: MapColor[] = [
  {
    id: 0,
    name: "NONE",
    color: {
      below: "rgba(0, 0, 0, 0)",
      same: "rgba(0, 0, 0, 0)",
      above: "rgba(0, 0, 0, 0)"
    }
  },
  {
    id: 1,
    name: "GRASS",
    color: {
      below: "rgb(90, 126, 39)",
      same: "rgb(109, 153, 48)",
      above: "rgb(127, 178, 56)"
    }
  },
  {
    id: 2,
    name: "SAND",
    color: {
      below: "rgb(175, 165, 115)",
      same: "rgb(212, 200, 140)",
      above: "rgb(247, 233, 163)"
    }
  },
  {
    id: 3,
    name: "WOOL",
    color: {
      below: "rgb(141, 141, 141)",
      same: "rgb(171, 171, 171)",
      above: "rgb(199, 199, 199)"
    }
  },
  {
    id: 4,
    name: "FIRE",
    color: {
      below: "rgb(181, 0, 0)",
      same: "rgb(219, 0, 0)",
      above: "rgb(255, 0, 0)"
    }
  },
  {
    id: 5,
    name: "ICE",
    color: {
      below: "rgb(113, 113, 181)",
      same: "rgb(137, 137, 219)",
      above: "rgb(160, 160, 255)"
    }
  },
  {
    id: 6,
    name: "METAL",
    color: {
      below: "rgb(118, 118, 118)",
      same: "rgb(143, 143, 143)",
      above: "rgb(167, 167, 167)"
    }
  },
  {
    id: 7,
    name: "PLANT",
    color: {
      below: "rgb(0, 88, 0)",
      same: "rgb(0, 106, 0)",
      above: "rgb(0, 124, 0)"
    }
  },
  {
    id: 8,
    name: "SNOW",
    color: {
      below: "rgb(181, 181, 181)",
      same: "rgb(219, 219, 219)",
      above: "rgb(255, 255, 255)"
    }
  },
  {
    id: 9,
    name: "CLAY",
    color: {
      below: "rgb(116, 119, 130)",
      same: "rgb(141, 144, 158)",
      above: "rgb(164, 168, 184)"
    }
  },
  {
    id: 10,
    name: "DIRT",
    color: {
      below: "rgb(107, 77, 54)",
      same: "rgb(129, 93, 66)",
      above: "rgb(151, 109, 77)"
    }
  },
  {
    id: 11,
    name: "STONE",
    color: {
      below: "rgb(79, 79, 79)",
      same: "rgb(96, 96, 96)",
      above: "rgb(112, 112, 112)"
    }
  },
  {
    id: 12,
    name: "WATER",
    color: {
      below: "rgb(45, 45, 181)",
      same: "rgb(55, 55, 219)",
      above: "rgb(64, 64, 255)"
    }
  },
  {
    id: 13,
    name: "WOOD",
    color: {
      below: "rgb(101, 84, 51)",
      same: "rgb(122, 102, 61)",
      above: "rgb(143, 119, 72)"
    }
  },
  {
    id: 14,
    name: "QUARTZ",
    color: {
      below: "rgb(181, 178, 173)",
      same: "rgb(219, 216, 210)",
      above: "rgb(255, 252, 245)"
    }
  },
  {
    id: 15,
    name: "COLOR_ORANGE",
    color: {
      below: "rgb(153, 90, 36)",
      same: "rgb(185, 109, 43)",
      above: "rgb(216, 127, 51)"
    }
  },
  {
    id: 16,
    name: "COLOR_MAGENTA",
    color: {
      below: "rgb(126, 53, 153)",
      same: "rgb(153, 65, 185)",
      above: "rgb(178, 76, 216)"
    }
  },
  {
    id: 17,
    name: "COLOR_LIGHT_BLUE",
    color: {
      below: "rgb(72, 108, 153)",
      same: "rgb(87, 131, 185)",
      above: "rgb(102, 153, 216)"
    }
  },
  {
    id: 18,
    name: "COLOR_YELLOW",
    color: {
      below: "rgb(162, 162, 36)",
      same: "rgb(196, 196, 43)",
      above: "rgb(229, 229, 51)"
    }
  },
  {
    id: 19,
    name: "COLOR_LIGHT_GREEN",
    color: {
      below: "rgb(90, 144, 17)",
      same: "rgb(109, 175, 21)",
      above: "rgb(127, 204, 25)"
    }
  },
  {
    id: 20,
    name: "COLOR_PINK",
    color: {
      below: "rgb(171, 90, 117)",
      same: "rgb(208, 109, 141)",
      above: "rgb(242, 127, 165)"
    }
  },
  {
    id: 21,
    name: "COLOR_GRAY",
    color: {
      below: "rgb(53, 53, 53)",
      same: "rgb(65, 65, 65)",
      above: "rgb(76, 76, 76)"
    }
  },
  {
    id: 22,
    name: "COLOR_LIGHT_GRAY",
    color: {
      below: "rgb(108, 108, 108)",
      same: "rgb(131, 131, 131)",
      above: "rgb(153, 153, 153)"
    }
  },
  {
    id: 23,
    name: "COLOR_CYAN",
    color: {
      below: "rgb(53, 90, 108)",
      same: "rgb(65, 109, 131)",
      above: "rgb(76, 127, 153)"
    }
  },
  {
    id: 24,
    name: "COLOR_PURPLE",
    color: {
      below: "rgb(90, 44, 126)",
      same: "rgb(109, 54, 153)",
      above: "rgb(127, 63, 178)"
    }
  },
  {
    id: 25,
    name: "COLOR_BLUE",
    color: {
      below: "rgb(36, 53, 126)",
      same: "rgb(43, 65, 153)",
      above: "rgb(51, 76, 178)"
    }
  },
  {
    id: 26,
    name: "COLOR_BROWN",
    color: {
      below: "rgb(72, 53, 36)",
      same: "rgb(87, 65, 43)",
      above: "rgb(102, 76, 51)"
    }
  },
  {
    id: 27,
    name: "COLOR_GREEN",
    color: {
      below: "rgb(72, 90, 36)",
      same: "rgb(87, 109, 43)",
      above: "rgb(102, 127, 51)"
    }
  },
  {
    id: 28,
    name: "COLOR_RED",
    color: {
      below: "rgb(108, 36, 36)",
      same: "rgb(131, 43, 43)",
      above: "rgb(153, 51, 51)"
    }
  },
  {
    id: 29,
    name: "COLOR_BLACK",
    color: {
      below: "rgb(17, 17, 17)",
      same: "rgb(21, 21, 21)",
      above: "rgb(25, 25, 25)"
    }
  },
  {
    id: 30,
    name: "GOLD",
    color: {
      below: "rgb(177, 168, 54)",
      same: "rgb(215, 204, 66)",
      above: "rgb(250, 238, 77)"
    }
  },
  {
    id: 31,
    name: "DIAMOND",
    color: {
      below: "rgb(65, 155, 151)",
      same: "rgb(79, 188, 183)",
      above: "rgb(92, 219, 213)"
    }
  },
  {
    id: 32,
    name: "LAPIS",
    color: {
      below: "rgb(52, 90, 181)",
      same: "rgb(63, 110, 219)",
      above: "rgb(74, 128, 255)"
    }
  },
  {
    id: 33,
    name: "EMERALD",
    color: {
      below: "rgb(0, 154, 41)",
      same: "rgb(0, 186, 49)",
      above: "rgb(0, 217, 58)"
    }
  },
  {
    id: 34,
    name: "PODZOL",
    color: {
      below: "rgb(91, 61, 34)",
      same: "rgb(110, 73, 42)",
      above: "rgb(129, 86, 49)"
    }
  },
  {
    id: 35,
    name: "NETHER",
    color: {
      below: "rgb(79, 1, 0)",
      same: "rgb(96, 1, 0)",
      above: "rgb(112, 2, 0)"
    }
  },
  {
    id: 36,
    name: "TERRACOTTA_WHITE",
    color: {
      below: "rgb(148, 125, 114)",
      same: "rgb(179, 152, 138)",
      above: "rgb(209, 177, 161)"
    }
  },
  {
    id: 37,
    name: "TERRACOTTA_ORANGE",
    color: {
      below: "rgb(112, 58, 25)",
      same: "rgb(136, 70, 30)",
      above: "rgb(159, 82, 36)"
    }
  },
  {
    id: 38,
    name: "TERRACOTTA_MAGENTA",
    color: {
      below: "rgb(105, 61, 76)",
      same: "rgb(128, 74, 92)",
      above: "rgb(149, 87, 108)"
    }
  },
  {
    id: 39,
    name: "TERRACOTTA_LIGHT_BLUE",
    color: {
      below: "rgb(79, 76, 97)",
      same: "rgb(96, 92, 118)",
      above: "rgb(112, 108, 138)"
    }
  },
  {
    id: 40,
    name: "TERRACOTTA_YELLOW",
    color: {
      below: "rgb(132, 94, 25)",
      same: "rgb(159, 114, 30)",
      above: "rgb(186, 133, 36)"
    }
  },
  {
    id: 41,
    name: "TERRACOTTA_LIGHT_GREEN",
    color: {
      below: "rgb(73, 83, 37)",
      same: "rgb(88, 100, 45)",
      above: "rgb(103, 117, 53)"
    }
  },
  {
    id: 42,
    name: "TERRACOTTA_PINK",
    color: {
      below: "rgb(113, 54, 55)",
      same: "rgb(137, 66, 67)",
      above: "rgb(160, 77, 78)"
    }
  },
  {
    id: 43,
    name: "TERRACOTTA_GRAY",
    color: {
      below: "rgb(40, 29, 24)",
      same: "rgb(49, 35, 30)",
      above: "rgb(57, 41, 35)"
    }
  },
  {
    id: 44,
    name: "TERRACOTTA_LIGHT_GRAY",
    color: {
      below: "rgb(95, 75, 69)",
      same: "rgb(116, 92, 84)",
      above: "rgb(135, 107, 98)"
    }
  },
  {
    id: 45,
    name: "TERRACOTTA_CYAN",
    color: {
      below: "rgb(61, 65, 65)",
      same: "rgb(74, 79, 79)",
      above: "rgb(87, 92, 92)"
    }
  },
  {
    id: 46,
    name: "TERRACOTTA_PURPLE",
    color: {
      below: "rgb(86, 51, 62)",
      same: "rgb(104, 62, 75)",
      above: "rgb(122, 73, 88)"
    }
  },
  {
    id: 47,
    name: "TERRACOTTA_BLUE",
    color: {
      below: "rgb(53, 44, 65)",
      same: "rgb(65, 53, 79)",
      above: "rgb(76, 62, 92)"
    }
  },
  {
    id: 48,
    name: "TERRACOTTA_BROWN",
    color: {
      below: "rgb(53, 35, 24)",
      same: "rgb(65, 43, 30)",
      above: "rgb(76, 50, 35)"
    }
  },
  {
    id: 49,
    name: "TERRACOTTA_GREEN",
    color: {
      below: "rgb(53, 58, 29)",
      same: "rgb(65, 70, 36)",
      above: "rgb(76, 82, 42)"
    }
  },
  {
    id: 50,
    name: "TERRACOTTA_RED",
    color: {
      below: "rgb(100, 42, 32)",
      same: "rgb(122, 51, 39)",
      above: "rgb(142, 60, 46)"
    }
  },
  {
    id: 51,
    name: "TERRACOTTA_BLACK",
    color: {
      below: "rgb(26, 15, 11)",
      same: "rgb(31, 18, 13)",
      above: "rgb(37, 22, 16)"
    }
  },
  {
    id: 52,
    name: "CRIMSON_NYLIUM",
    color: {
      below: "rgb(134, 34, 34)",
      same: "rgb(162, 41, 42)",
      above: "rgb(189, 48, 49)"
    }
  },
  {
    id: 53,
    name: "CRIMSON_STEM",
    color: {
      below: "rgb(105, 44, 68)",
      same: "rgb(127, 54, 83)",
      above: "rgb(148, 63, 97)"
    }
  },
  {
    id: 54,
    name: "CRIMSON_HYPHAE",
    color: {
      below: "rgb(65, 17, 20)",
      same: "rgb(79, 21, 24)",
      above: "rgb(92, 25, 29)"
    }
  },
  {
    id: 55,
    name: "WARPED_NYLIUM",
    color: {
      below: "rgb(15, 89, 95)",
      same: "rgb(18, 108, 115)",
      above: "rgb(22, 126, 134)"
    }
  },
  {
    id: 56,
    name: "WARPED_STEM",
    color: {
      below: "rgb(41, 100, 99)",
      same: "rgb(49, 122, 120)",
      above: "rgb(58, 142, 140)"
    }
  },
  {
    id: 57,
    name: "WARPED_HYPHAE",
    color: {
      below: "rgb(61, 31, 44)",
      same: "rgb(73, 37, 53)",
      above: "rgb(86, 44, 62)"
    }
  },
  {
    id: 58,
    name: "WARPED_WART_BLOCK",
    color: {
      below: "rgb(14, 127, 94)",
      same: "rgb(17, 154, 114)",
      above: "rgb(20, 180, 133)"
    }
  },
  {
    id: 59,
    name: "DEEPSLATE",
    color: {
      below: "rgb(71, 71, 71)",
      same: "rgb(86, 86, 86)",
      above: "rgb(100, 100, 100)"
    }
  },
  {
    id: 60,
    name: "RAW_IRON",
    color: {
      below: "rgb(153, 124, 104)",
      same: "rgb(185, 150, 126)",
      above: "rgb(216, 175, 147)"
    }
  },
  {
    id: 61,
    name: "GLOW_LICHEN",
    color: {
      below: "rgb(90, 118, 106)",
      same: "rgb(109, 143, 129)",
      above: "rgb(127, 167, 150)"
    }
  }
];
