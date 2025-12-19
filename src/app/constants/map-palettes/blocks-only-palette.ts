import { MapIds } from "../map-colors";
import { MapPalette } from "./map-palette";

export const blocksOnlyMapPalette: MapPalette = {
  acacia_button: MapIds.NONE,
  acacia_door: MapIds.NONE,
  acacia_fence: MapIds.NONE,
  acacia_fence_gate: MapIds.NONE,
  acacia_hanging_sign: MapIds.NONE,
  acacia_leaves: [
    {
      id: MapIds.PLANT,
      properties: {
        waterlogged: "false"
      }
    },
    {
      id: MapIds.WATER,
      properties: {
        waterlogged: "true"
      }
    }
  ],
  acacia_log: [
    {
      id: MapIds.COLOR_ORANGE,
      properties: {
        axis: "y"
      }
    },
    {
      id: MapIds.STONE,
      properties: {
        axis: "z"
      }
    },
    {
      id: MapIds.STONE,
      properties: {
        axis: "x"
      }
    }
  ],
  acacia_planks: MapIds.COLOR_ORANGE,
  acacia_pressure_plate: MapIds.COLOR_ORANGE,
  acacia_sapling: MapIds.NONE,
  acacia_shelf: MapIds.NONE,
  acacia_sign: MapIds.NONE,
  acacia_slab: MapIds.COLOR_ORANGE,
  acacia_stairs: MapIds.COLOR_ORANGE,
  acacia_trapdoor: MapIds.COLOR_ORANGE,
  acacia_wall_hanging_sign: MapIds.NONE,
  acacia_wall_sign: MapIds.NONE,
  acacia_wood: MapIds.STONE,
  activator_rail: MapIds.NONE,
  air: MapIds.NONE,
  allium: MapIds.NONE,
  amethyst_block: MapIds.COLOR_PURPLE,
  amethyst_cluster: MapIds.NONE,
  ancient_debris: MapIds.COLOR_BLACK,
  andesite: MapIds.STONE,
  andesite_slab: MapIds.STONE,
  andesite_stairs: MapIds.STONE,
  andesite_wall: MapIds.NONE,
  anvil: MapIds.NONE,
  attached_melon_stem: MapIds.NONE,
  attached_pumpkin_stem: MapIds.NONE,
  azalea: MapIds.PLANT,
  azalea_leaves: [
    {
      id: MapIds.PLANT,
      properties: {
        waterlogged: "false"
      }
    },
    {
      id: MapIds.WATER,
      properties: {
        waterlogged: "true"
      }
    }
  ],
  azure_bluet: MapIds.NONE,
  bamboo: MapIds.NONE,
  bamboo_block: MapIds.PLANT,
  bamboo_button: MapIds.NONE,
  bamboo_door: MapIds.NONE,
  bamboo_fence: MapIds.NONE,
  bamboo_fence_gate: MapIds.NONE,
  bamboo_hanging_sign: MapIds.NONE,
  bamboo_mosaic: MapIds.COLOR_YELLOW,
  bamboo_mosaic_slab: MapIds.COLOR_YELLOW,
  bamboo_mosaic_stairs: MapIds.COLOR_YELLOW,
  bamboo_planks: MapIds.COLOR_YELLOW,
  bamboo_pressure_plate: MapIds.COLOR_YELLOW,
  bamboo_sapling: MapIds.NONE,
  bamboo_shelf: MapIds.NONE,
  bamboo_sign: MapIds.NONE,
  bamboo_slab: MapIds.COLOR_YELLOW,
  bamboo_stairs: MapIds.COLOR_YELLOW,
  bamboo_trapdoor: MapIds.COLOR_YELLOW,
  bamboo_wall_hanging_sign: MapIds.NONE,
  bamboo_wall_sign: MapIds.NONE,
  barrel: MapIds.WOOD,
  barrier: MapIds.NONE,
  basalt: MapIds.COLOR_BLACK,
  beacon: MapIds.DIAMOND,
  bedrock: MapIds.STONE,
  bee_nest: MapIds.COLOR_YELLOW,
  beehive: MapIds.WOOD,
  beetroots: MapIds.NONE,
  bell: MapIds.NONE,
  big_dripleaf: MapIds.NONE,
  big_dripleaf_stem: MapIds.NONE,
  birch_button: MapIds.NONE,
  birch_door: MapIds.NONE,
  birch_fence: MapIds.NONE,
  birch_fence_gate: MapIds.NONE,
  birch_hanging_sign: MapIds.NONE,
  birch_leaves: [
    {
      id: MapIds.PLANT,
      properties: {
        waterlogged: "false"
      }
    },
    {
      id: MapIds.WATER,
      properties: {
        waterlogged: "true"
      }
    }
  ],
  birch_log: [
    {
      id: MapIds.SAND,
      properties: {
        axis: "y"
      }
    },
    {
      id: MapIds.QUARTZ,
      properties: {
        axis: "z"
      }
    },
    {
      id: MapIds.QUARTZ,
      properties: {
        axis: "x"
      }
    }
  ],
  birch_planks: MapIds.SAND,
  birch_pressure_plate: MapIds.SAND,
  birch_sapling: MapIds.NONE,
  birch_shelf: MapIds.NONE,
  birch_sign: MapIds.NONE,
  birch_slab: MapIds.SAND,
  birch_stairs: MapIds.SAND,
  birch_trapdoor: MapIds.SAND,
  birch_wall_hanging_sign: MapIds.NONE,
  birch_wall_sign: MapIds.NONE,
  birch_wood: MapIds.QUARTZ,
  black_banner: MapIds.NONE,
  black_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_BLACK,
      properties: {
        part: "foot"
      }
    }
  ],
  black_candle: MapIds.NONE,
  black_candle_cake: MapIds.NONE,
  black_carpet: MapIds.COLOR_BLACK,
  black_concrete: MapIds.COLOR_BLACK,
  black_concrete_powder: MapIds.COLOR_BLACK,
  black_glazed_terracotta: MapIds.COLOR_BLACK,
  black_shulker_box: MapIds.COLOR_BLACK,
  black_stained_glass: MapIds.COLOR_BLACK,
  black_stained_glass_pane: MapIds.NONE,
  black_terracotta: MapIds.TERRACOTTA_BLACK,
  black_wall_banner: MapIds.NONE,
  black_wool: MapIds.COLOR_BLACK,
  blackstone: MapIds.COLOR_BLACK,
  blackstone_slab: MapIds.COLOR_BLACK,
  blackstone_stairs: MapIds.COLOR_BLACK,
  blackstone_wall: MapIds.NONE,
  blast_furnace: MapIds.STONE,
  blue_banner: MapIds.NONE,
  blue_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_BLUE,
      properties: {
        part: "foot"
      }
    }
  ],
  blue_candle: MapIds.NONE,
  blue_candle_cake: MapIds.NONE,
  blue_carpet: MapIds.COLOR_BLUE,
  blue_concrete: MapIds.COLOR_BLUE,
  blue_concrete_powder: MapIds.COLOR_BLUE,
  blue_glazed_terracotta: MapIds.COLOR_BLUE,
  blue_ice: MapIds.ICE,
  blue_orchid: MapIds.NONE,
  blue_shulker_box: MapIds.COLOR_BLUE,
  blue_stained_glass: MapIds.COLOR_BLUE,
  blue_stained_glass_pane: MapIds.NONE,
  blue_terracotta: MapIds.TERRACOTTA_BLUE,
  blue_wall_banner: MapIds.NONE,
  blue_wool: MapIds.COLOR_BLUE,
  bone_block: MapIds.SAND,
  bookshelf: MapIds.WOOD,
  brain_coral: MapIds.COLOR_PINK,
  brain_coral_block: MapIds.COLOR_PINK,
  brain_coral_fan: MapIds.NONE,
  brain_coral_wall_fan: MapIds.NONE,
  brewing_stand: MapIds.METAL,
  brick_slab: MapIds.COLOR_RED,
  brick_stairs: MapIds.COLOR_RED,
  brick_wall: MapIds.NONE,
  bricks: MapIds.COLOR_RED,
  brown_banner: MapIds.NONE,
  brown_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_BROWN,
      properties: {
        part: "foot"
      }
    }
  ],
  brown_candle: MapIds.NONE,
  brown_candle_cake: MapIds.NONE,
  brown_carpet: MapIds.COLOR_BROWN,
  brown_concrete: MapIds.COLOR_BROWN,
  brown_concrete_powder: MapIds.COLOR_BROWN,
  brown_glazed_terracotta: MapIds.COLOR_BROWN,
  brown_mushroom: MapIds.COLOR_BROWN,
  brown_mushroom_block: MapIds.DIRT,
  brown_shulker_box: MapIds.COLOR_BROWN,
  brown_stained_glass: MapIds.COLOR_BROWN,
  brown_stained_glass_pane: MapIds.NONE,
  brown_terracotta: MapIds.TERRACOTTA_BROWN,
  brown_wall_banner: MapIds.NONE,
  brown_wool: MapIds.COLOR_BROWN,
  bubble_column: MapIds.WATER,
  bubble_coral: MapIds.COLOR_PURPLE,
  bubble_coral_block: MapIds.COLOR_PURPLE,
  bubble_coral_fan: MapIds.NONE,
  bubble_coral_wall_fan: MapIds.NONE,
  budding_amethyst: MapIds.COLOR_PURPLE,
  bush: MapIds.NONE,
  cactus: MapIds.PLANT,
  cactus_flower: MapIds.COLOR_PINK,
  cake: MapIds.NONE,
  calcite: MapIds.TERRACOTTA_WHITE,
  calibrated_sculk_sensor: MapIds.COLOR_CYAN,
  campfire: MapIds.PODZOL,
  candle: MapIds.NONE,
  candle_cake: MapIds.NONE,
  carrots: MapIds.NONE,
  cartography_table: MapIds.WOOD,
  carved_pumpkin: MapIds.COLOR_ORANGE,
  cauldron: MapIds.STONE,
  cave_air: MapIds.NONE,
  cave_vines: MapIds.NONE,
  cave_vines_plant: MapIds.NONE,
  chain_command_block: MapIds.COLOR_GREEN,
  cherry_button: MapIds.NONE,
  cherry_door: MapIds.NONE,
  cherry_fence: MapIds.NONE,
  cherry_fence_gate: MapIds.NONE,
  cherry_hanging_sign: MapIds.NONE,
  cherry_leaves: [
    {
      id: MapIds.COLOR_PINK,
      properties: {
        waterlogged: "false"
      }
    },
    {
      id: MapIds.WATER,
      properties: {
        waterlogged: "true"
      }
    }
  ],
  cherry_log: [
    {
      id: MapIds.TERRACOTTA_WHITE,
      properties: {
        axis: "y"
      }
    },
    {
      id: MapIds.TERRACOTTA_GRAY,
      properties: {
        axis: "z"
      }
    },
    {
      id: MapIds.TERRACOTTA_GRAY,
      properties: {
        axis: "x"
      }
    }
  ],
  cherry_planks: MapIds.TERRACOTTA_WHITE,
  cherry_pressure_plate: MapIds.TERRACOTTA_WHITE,
  cherry_sapling: MapIds.NONE,
  cherry_shelf: MapIds.NONE,
  cherry_sign: MapIds.NONE,
  cherry_slab: MapIds.TERRACOTTA_WHITE,
  cherry_stairs: MapIds.TERRACOTTA_WHITE,
  cherry_trapdoor: MapIds.TERRACOTTA_WHITE,
  cherry_wall_hanging_sign: MapIds.NONE,
  cherry_wall_sign: MapIds.NONE,
  cherry_wood: MapIds.TERRACOTTA_GRAY,
  chest: MapIds.WOOD,
  chipped_anvil: MapIds.METAL,
  chiseled_bookshelf: MapIds.WOOD,
  chiseled_copper: MapIds.COLOR_ORANGE,
  chiseled_deepslate: MapIds.DEEPSLATE,
  chiseled_nether_bricks: MapIds.NETHER,
  chiseled_polished_blackstone: MapIds.COLOR_BLACK,
  chiseled_quartz_block: MapIds.QUARTZ,
  chiseled_red_sandstone: MapIds.COLOR_ORANGE,
  chiseled_resin_bricks: MapIds.TERRACOTTA_ORANGE,
  chiseled_sandstone: MapIds.SAND,
  chiseled_stone_bricks: MapIds.STONE,
  chiseled_tuff: MapIds.TERRACOTTA_GRAY,
  chiseled_tuff_bricks: MapIds.TERRACOTTA_GRAY,
  chorus_flower: MapIds.COLOR_PURPLE,
  chorus_plant: MapIds.COLOR_PURPLE,
  clay: MapIds.CLAY,
  closed_eyeblossom: MapIds.METAL,
  coal_block: MapIds.COLOR_BLACK,
  coal_ore: MapIds.STONE,
  coarse_dirt: MapIds.DIRT,
  cobbled_deepslate: MapIds.DEEPSLATE,
  cobbled_deepslate_slab: MapIds.DEEPSLATE,
  cobbled_deepslate_stairs: MapIds.DEEPSLATE,
  cobbled_deepslate_wall: MapIds.NONE,
  cobblestone: MapIds.STONE,
  cobblestone_slab: MapIds.STONE,
  cobblestone_stairs: MapIds.STONE,
  cobblestone_wall: MapIds.NONE,
  cobweb: MapIds.WOOL,
  cocoa: MapIds.NONE,
  command_block: MapIds.COLOR_BROWN,
  comparator: MapIds.NONE,
  composter: MapIds.WOOD,
  conduit: MapIds.DIAMOND,
  copper_bars: MapIds.NONE,
  copper_block: MapIds.COLOR_ORANGE,
  copper_bulb: MapIds.COLOR_ORANGE,
  copper_chain: MapIds.NONE,
  copper_chest: MapIds.COLOR_ORANGE,
  copper_door: MapIds.NONE,
  copper_golem_statue: MapIds.NONE,
  copper_grate: MapIds.COLOR_ORANGE,
  copper_lantern: MapIds.NONE,
  copper_ore: MapIds.STONE,
  copper_torch: MapIds.NONE,
  copper_trapdoor: MapIds.COLOR_ORANGE,
  copper_wall_torch: MapIds.NONE,
  cornflower: MapIds.NONE,
  cracked_deepslate_bricks: MapIds.DEEPSLATE,
  cracked_deepslate_tiles: MapIds.DEEPSLATE,
  cracked_nether_bricks: MapIds.NETHER,
  cracked_polished_blackstone_bricks: MapIds.COLOR_BLACK,
  cracked_stone_bricks: MapIds.STONE,
  crafter: MapIds.STONE,
  crafting_table: MapIds.WOOD,
  creaking_heart: MapIds.COLOR_ORANGE,
  creeper_head: MapIds.NONE,
  creeper_wall_head: MapIds.NONE,
  crimson_button: MapIds.NONE,
  crimson_door: MapIds.NONE,
  crimson_fence: MapIds.NONE,
  crimson_fence_gate: MapIds.NONE,
  crimson_fungus: MapIds.NETHER,
  crimson_hanging_sign: MapIds.NONE,
  crimson_hyphae: MapIds.CRIMSON_HYPHAE,
  crimson_nylium: MapIds.CRIMSON_NYLIUM,
  crimson_planks: MapIds.CRIMSON_STEM,
  crimson_pressure_plate: MapIds.CRIMSON_STEM,
  crimson_roots: MapIds.NETHER,
  crimson_shelf: MapIds.NONE,
  crimson_sign: MapIds.NONE,
  crimson_slab: MapIds.CRIMSON_STEM,
  crimson_stairs: MapIds.CRIMSON_STEM,
  crimson_stem: [
    {
      id: MapIds.CRIMSON_STEM,
      properties: {
        axis: "y"
      }
    },
    {
      id: MapIds.CRIMSON_HYPHAE,
      properties: {
        axis: "z"
      }
    },
    {
      id: MapIds.CRIMSON_HYPHAE,
      properties: {
        axis: "x"
      }
    }
  ],
  crimson_trapdoor: MapIds.CRIMSON_STEM,
  crimson_wall_hanging_sign: MapIds.NONE,
  crimson_wall_sign: MapIds.NONE,
  crying_obsidian: MapIds.COLOR_BLACK,
  cut_copper: MapIds.COLOR_ORANGE,
  cut_copper_slab: MapIds.COLOR_ORANGE,
  cut_copper_stairs: MapIds.COLOR_ORANGE,
  cut_red_sandstone: MapIds.COLOR_ORANGE,
  cut_red_sandstone_slab: MapIds.COLOR_ORANGE,
  cut_sandstone: MapIds.SAND,
  cut_sandstone_slab: MapIds.SAND,
  cyan_banner: MapIds.NONE,
  cyan_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_CYAN,
      properties: {
        part: "foot"
      }
    }
  ],
  cyan_candle: MapIds.NONE,
  cyan_candle_cake: MapIds.NONE,
  cyan_carpet: MapIds.COLOR_CYAN,
  cyan_concrete: MapIds.COLOR_CYAN,
  cyan_concrete_powder: MapIds.COLOR_CYAN,
  cyan_glazed_terracotta: MapIds.COLOR_CYAN,
  cyan_shulker_box: MapIds.COLOR_CYAN,
  cyan_stained_glass: MapIds.COLOR_CYAN,
  cyan_stained_glass_pane: MapIds.NONE,
  cyan_terracotta: MapIds.TERRACOTTA_CYAN,
  cyan_wall_banner: MapIds.NONE,
  cyan_wool: MapIds.COLOR_CYAN,
  damaged_anvil: MapIds.METAL,
  dandelion: MapIds.NONE,
  dark_oak_button: MapIds.NONE,
  dark_oak_door: MapIds.NONE,
  dark_oak_fence: MapIds.NONE,
  dark_oak_fence_gate: MapIds.NONE,
  dark_oak_hanging_sign: MapIds.NONE,
  dark_oak_leaves: [
    {
      id: MapIds.PLANT,
      properties: {
        waterlogged: "false"
      }
    },
    {
      id: MapIds.WATER,
      properties: {
        waterlogged: "true"
      }
    }
  ],
  dark_oak_log: MapIds.COLOR_BROWN,
  dark_oak_planks: MapIds.COLOR_BROWN,
  dark_oak_pressure_plate: MapIds.COLOR_BROWN,
  dark_oak_sapling: MapIds.NONE,
  dark_oak_shelf: MapIds.NONE,
  dark_oak_sign: MapIds.NONE,
  dark_oak_slab: MapIds.COLOR_BROWN,
  dark_oak_stairs: MapIds.COLOR_BROWN,
  dark_oak_trapdoor: MapIds.COLOR_BROWN,
  dark_oak_wall_hanging_sign: MapIds.NONE,
  dark_oak_wall_sign: MapIds.NONE,
  dark_oak_wood: MapIds.COLOR_BROWN,
  dark_prismarine: MapIds.DIAMOND,
  dark_prismarine_slab: MapIds.DIAMOND,
  dark_prismarine_stairs: MapIds.DIAMOND,
  daylight_detector: MapIds.WOOD,
  dead_brain_coral: MapIds.COLOR_GRAY,
  dead_brain_coral_block: MapIds.COLOR_GRAY,
  dead_brain_coral_fan: MapIds.NONE,
  dead_brain_coral_wall_fan: MapIds.NONE,
  dead_bubble_coral: MapIds.COLOR_GRAY,
  dead_bubble_coral_block: MapIds.COLOR_GRAY,
  dead_bubble_coral_fan: MapIds.NONE,
  dead_bubble_coral_wall_fan: MapIds.NONE,
  dead_bush: MapIds.WOOD,
  dead_fire_coral: MapIds.COLOR_GRAY,
  dead_fire_coral_block: MapIds.COLOR_GRAY,
  dead_fire_coral_fan: MapIds.NONE,
  dead_fire_coral_wall_fan: MapIds.NONE,
  dead_horn_coral: MapIds.COLOR_GRAY,
  dead_horn_coral_block: MapIds.COLOR_GRAY,
  dead_horn_coral_fan: MapIds.NONE,
  dead_horn_coral_wall_fan: MapIds.NONE,
  dead_tube_coral: MapIds.COLOR_GRAY,
  dead_tube_coral_block: MapIds.COLOR_GRAY,
  dead_tube_coral_fan: MapIds.NONE,
  dead_tube_coral_wall_fan: MapIds.NONE,
  decorated_pot: MapIds.NONE,
  deepslate: MapIds.DEEPSLATE,
  deepslate_brick_slab: MapIds.DEEPSLATE,
  deepslate_brick_stairs: MapIds.DEEPSLATE,
  deepslate_brick_wall: MapIds.NONE,
  deepslate_bricks: MapIds.DEEPSLATE,
  deepslate_coal_ore: MapIds.DEEPSLATE,
  deepslate_copper_ore: MapIds.DEEPSLATE,
  deepslate_diamond_ore: MapIds.DEEPSLATE,
  deepslate_emerald_ore: MapIds.DEEPSLATE,
  deepslate_gold_ore: MapIds.DEEPSLATE,
  deepslate_iron_ore: MapIds.DEEPSLATE,
  deepslate_lapis_ore: MapIds.DEEPSLATE,
  deepslate_redstone_ore: MapIds.DEEPSLATE,
  deepslate_tile_slab: MapIds.DEEPSLATE,
  deepslate_tile_stairs: MapIds.DEEPSLATE,
  deepslate_tile_wall: MapIds.NONE,
  deepslate_tiles: MapIds.DEEPSLATE,
  detector_rail: MapIds.NONE,
  diamond_block: MapIds.DIAMOND,
  diamond_ore: MapIds.STONE,
  diorite: MapIds.QUARTZ,
  diorite_slab: MapIds.QUARTZ,
  diorite_stairs: MapIds.QUARTZ,
  diorite_wall: MapIds.NONE,
  dirt: MapIds.DIRT,
  dirt_path: MapIds.DIRT,
  dispenser: MapIds.STONE,
  dragon_egg: MapIds.NONE,
  dragon_head: MapIds.NONE,
  dragon_wall_head: MapIds.NONE,
  dried_ghast: MapIds.NONE,
  dried_kelp_block: MapIds.COLOR_GREEN,
  dripstone_block: MapIds.TERRACOTTA_BROWN,
  dropper: MapIds.STONE,
  emerald_block: MapIds.EMERALD,
  emerald_ore: MapIds.STONE,
  enchanting_table: MapIds.COLOR_RED,
  end_gateway: MapIds.COLOR_BLACK,
  end_portal: MapIds.COLOR_BLACK,
  end_portal_frame: MapIds.COLOR_GREEN,
  end_rod: MapIds.NONE,
  end_stone: MapIds.SAND,
  end_stone_brick_slab: MapIds.SAND,
  end_stone_brick_stairs: MapIds.SAND,
  end_stone_brick_wall: MapIds.NONE,
  end_stone_bricks: MapIds.SAND,
  ender_chest: MapIds.STONE,
  exposed_chiseled_copper: MapIds.TERRACOTTA_LIGHT_GRAY,
  exposed_copper: MapIds.TERRACOTTA_LIGHT_GRAY,
  exposed_copper_bars: MapIds.NONE,
  exposed_copper_bulb: MapIds.TERRACOTTA_LIGHT_GRAY,
  exposed_copper_chain: MapIds.NONE,
  exposed_copper_chest: MapIds.TERRACOTTA_LIGHT_GRAY,
  exposed_copper_door: MapIds.NONE,
  exposed_copper_golem_statue: MapIds.NONE,
  exposed_copper_grate: MapIds.TERRACOTTA_LIGHT_GRAY,
  exposed_copper_lantern: MapIds.NONE,
  exposed_copper_trapdoor: MapIds.TERRACOTTA_LIGHT_GRAY,
  exposed_cut_copper: MapIds.TERRACOTTA_LIGHT_GRAY,
  exposed_cut_copper_slab: MapIds.TERRACOTTA_LIGHT_GRAY,
  exposed_cut_copper_stairs: MapIds.TERRACOTTA_LIGHT_GRAY,
  exposed_lightning_rod: MapIds.NONE,
  farmland: MapIds.DIRT,
  fern: MapIds.NONE,
  fire: MapIds.FIRE,
  fire_coral: MapIds.COLOR_RED,
  fire_coral_block: MapIds.COLOR_RED,
  fire_coral_fan: MapIds.NONE,
  fire_coral_wall_fan: MapIds.NONE,
  firefly_bush: MapIds.NONE,
  fletching_table: MapIds.WOOD,
  flower_pot: MapIds.NONE,
  flowering_azalea: MapIds.PLANT,
  flowering_azalea_leaves: [
    {
      id: MapIds.PLANT,
      properties: {
        waterlogged: "false"
      }
    },
    {
      id: MapIds.WATER,
      properties: {
        waterlogged: "true"
      }
    }
  ],
  frogspawn: MapIds.NONE,
  frosted_ice: MapIds.ICE,
  furnace: MapIds.STONE,
  gilded_blackstone: MapIds.COLOR_BLACK,
  glass: MapIds.NONE,
  glass_pane: MapIds.NONE,
  glow_item_frame: MapIds.NONE,
  glow_lichen: MapIds.NONE,
  glowstone: MapIds.SAND,
  gold_block: MapIds.GOLD,
  gold_ore: MapIds.STONE,
  granite: MapIds.DIRT,
  granite_slab: MapIds.DIRT,
  granite_stairs: MapIds.DIRT,
  granite_wall: MapIds.NONE,
  grass_block: MapIds.GRASS,
  gravel: MapIds.STONE,
  gray_banner: MapIds.NONE,
  gray_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_GRAY,
      properties: {
        part: "foot"
      }
    }
  ],
  gray_candle: MapIds.NONE,
  gray_candle_cake: MapIds.NONE,
  gray_carpet: MapIds.COLOR_GRAY,
  gray_concrete: MapIds.COLOR_GRAY,
  gray_concrete_powder: MapIds.COLOR_GRAY,
  gray_glazed_terracotta: MapIds.COLOR_GRAY,
  gray_shulker_box: MapIds.COLOR_GRAY,
  gray_stained_glass: MapIds.COLOR_GRAY,
  gray_stained_glass_pane: MapIds.NONE,
  gray_terracotta: MapIds.TERRACOTTA_GRAY,
  gray_wall_banner: MapIds.NONE,
  gray_wool: MapIds.COLOR_GRAY,
  green_banner: MapIds.NONE,
  green_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_GREEN,
      properties: {
        part: "foot"
      }
    }
  ],
  green_candle: MapIds.NONE,
  green_candle_cake: MapIds.NONE,
  green_carpet: MapIds.COLOR_GREEN,
  green_concrete: MapIds.COLOR_GREEN,
  green_concrete_powder: MapIds.COLOR_GREEN,
  green_glazed_terracotta: MapIds.COLOR_GREEN,
  green_shulker_box: MapIds.COLOR_GREEN,
  green_stained_glass: MapIds.COLOR_GREEN,
  green_stained_glass_pane: MapIds.NONE,
  green_terracotta: MapIds.TERRACOTTA_GREEN,
  green_wall_banner: MapIds.NONE,
  green_wool: MapIds.COLOR_GREEN,
  grindstone: MapIds.NONE,
  hanging_roots: MapIds.NONE,
  hay_block: MapIds.COLOR_YELLOW,
  heavy_core: MapIds.NONE,
  heavy_weighted_pressure_plate: MapIds.METAL,
  honey_block: MapIds.COLOR_ORANGE,
  honeycomb_block: MapIds.COLOR_ORANGE,
  hopper: MapIds.STONE,
  horn_coral: MapIds.COLOR_YELLOW,
  horn_coral_block: MapIds.COLOR_YELLOW,
  horn_coral_fan: MapIds.NONE,
  horn_coral_wall_fan: MapIds.NONE,
  ice: MapIds.ICE,
  infested_chiseled_stone_bricks: MapIds.CLAY,
  infested_cobblestone: MapIds.CLAY,
  infested_cracked_stone_bricks: MapIds.CLAY,
  infested_deepslate: MapIds.DEEPSLATE,
  infested_mossy_stone_bricks: MapIds.CLAY,
  infested_stone: MapIds.CLAY,
  infested_stone_bricks: MapIds.CLAY,
  iron_bars: MapIds.NONE,
  iron_block: MapIds.METAL,
  iron_chain: MapIds.NONE,
  iron_door: MapIds.NONE,
  iron_ore: MapIds.STONE,
  iron_trapdoor: MapIds.METAL,
  item_frame: MapIds.NONE,
  jack_o_lantern: MapIds.COLOR_ORANGE,
  jigsaw: MapIds.COLOR_LIGHT_GRAY,
  jukebox: MapIds.DIRT,
  jungle_button: MapIds.NONE,
  jungle_door: MapIds.NONE,
  jungle_fence: MapIds.NONE,
  jungle_fence_gate: MapIds.NONE,
  jungle_hanging_sign: MapIds.NONE,
  jungle_leaves: [
    {
      id: MapIds.PLANT,
      properties: {
        waterlogged: "false"
      }
    },
    {
      id: MapIds.WATER,
      properties: {
        waterlogged: "true"
      }
    }
  ],
  jungle_log: [
    {
      id: MapIds.DIRT,
      properties: {
        axis: "y"
      }
    },
    {
      id: MapIds.PODZOL,
      properties: {
        axis: "z"
      }
    },
    {
      id: MapIds.PODZOL,
      properties: {
        axis: "x"
      }
    }
  ],
  jungle_planks: MapIds.DIRT,
  jungle_pressure_plate: MapIds.DIRT,
  jungle_sapling: MapIds.NONE,
  jungle_shelf: MapIds.NONE,
  jungle_sign: MapIds.NONE,
  jungle_slab: MapIds.DIRT,
  jungle_stairs: MapIds.DIRT,
  jungle_trapdoor: MapIds.DIRT,
  jungle_wall_hanging_sign: MapIds.NONE,
  jungle_wall_sign: MapIds.NONE,
  jungle_wood: MapIds.PODZOL,
  kelp: MapIds.WATER,
  kelp_plant: MapIds.WATER,
  ladder: MapIds.NONE,
  lantern: MapIds.NONE,
  lapis_block: MapIds.LAPIS,
  lapis_ore: MapIds.STONE,
  large_amethyst_bud: MapIds.NONE,
  large_fern: MapIds.NONE,
  lava: MapIds.FIRE,
  lava_cauldron: MapIds.STONE,
  leaf_litter: MapIds.NONE,
  lectern: MapIds.WOOD,
  lever: MapIds.NONE,
  light: MapIds.NONE,
  light_blue_banner: MapIds.NONE,
  light_blue_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_LIGHT_BLUE,
      properties: {
        part: "foot"
      }
    }
  ],
  light_blue_candle: MapIds.NONE,
  light_blue_candle_cake: MapIds.NONE,
  light_blue_carpet: MapIds.COLOR_LIGHT_BLUE,
  light_blue_concrete: MapIds.COLOR_LIGHT_BLUE,
  light_blue_concrete_powder: MapIds.COLOR_LIGHT_BLUE,
  light_blue_glazed_terracotta: MapIds.COLOR_LIGHT_BLUE,
  light_blue_shulker_box: MapIds.COLOR_LIGHT_BLUE,
  light_blue_stained_glass: MapIds.COLOR_LIGHT_BLUE,
  light_blue_stained_glass_pane: MapIds.NONE,
  light_blue_terracotta: MapIds.TERRACOTTA_LIGHT_BLUE,
  light_blue_wall_banner: MapIds.NONE,
  light_blue_wool: MapIds.COLOR_LIGHT_BLUE,
  light_gray_banner: MapIds.NONE,
  light_gray_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_LIGHT_GRAY,
      properties: {
        part: "foot"
      }
    }
  ],
  light_gray_candle: MapIds.NONE,
  light_gray_candle_cake: MapIds.NONE,
  light_gray_carpet: MapIds.COLOR_LIGHT_GRAY,
  light_gray_concrete: MapIds.COLOR_LIGHT_GRAY,
  light_gray_concrete_powder: MapIds.COLOR_LIGHT_GRAY,
  light_gray_glazed_terracotta: MapIds.COLOR_LIGHT_GRAY,
  light_gray_shulker_box: MapIds.COLOR_LIGHT_GRAY,
  light_gray_stained_glass: MapIds.COLOR_LIGHT_GRAY,
  light_gray_stained_glass_pane: MapIds.NONE,
  light_gray_terracotta: MapIds.TERRACOTTA_LIGHT_GRAY,
  light_gray_wall_banner: MapIds.NONE,
  light_gray_wool: MapIds.COLOR_LIGHT_GRAY,
  light_weighted_pressure_plate: MapIds.GOLD,
  lightning_rod: MapIds.NONE,
  lilac: MapIds.NONE,
  lily_of_the_valley: MapIds.NONE,
  lily_pad: MapIds.NONE,
  lime_banner: MapIds.NONE,
  lime_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_LIGHT_GREEN,
      properties: {
        part: "foot"
      }
    }
  ],
  lime_candle: MapIds.NONE,
  lime_candle_cake: MapIds.NONE,
  lime_carpet: MapIds.COLOR_LIGHT_GREEN,
  lime_concrete: MapIds.COLOR_LIGHT_GREEN,
  lime_concrete_powder: MapIds.COLOR_LIGHT_GREEN,
  lime_glazed_terracotta: MapIds.COLOR_LIGHT_GREEN,
  lime_shulker_box: MapIds.COLOR_LIGHT_GREEN,
  lime_stained_glass: MapIds.COLOR_LIGHT_GREEN,
  lime_stained_glass_pane: MapIds.NONE,
  lime_terracotta: MapIds.TERRACOTTA_LIGHT_GREEN,
  lime_wall_banner: MapIds.NONE,
  lime_wool: MapIds.COLOR_LIGHT_GREEN,
  lodestone: MapIds.METAL,
  loom: MapIds.WOOD,
  magenta_banner: MapIds.NONE,
  magenta_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_MAGENTA,
      properties: {
        part: "foot"
      }
    }
  ],
  magenta_candle: MapIds.NONE,
  magenta_candle_cake: MapIds.NONE,
  magenta_carpet: MapIds.COLOR_MAGENTA,
  magenta_concrete: MapIds.COLOR_MAGENTA,
  magenta_concrete_powder: MapIds.COLOR_MAGENTA,
  magenta_glazed_terracotta: MapIds.COLOR_MAGENTA,
  magenta_shulker_box: MapIds.COLOR_MAGENTA,
  magenta_stained_glass: MapIds.COLOR_MAGENTA,
  magenta_stained_glass_pane: MapIds.NONE,
  magenta_terracotta: MapIds.TERRACOTTA_MAGENTA,
  magenta_wall_banner: MapIds.NONE,
  magenta_wool: MapIds.COLOR_MAGENTA,
  magma_block: MapIds.NETHER,
  mangrove_button: MapIds.NONE,
  mangrove_door: MapIds.NONE,
  mangrove_fence: MapIds.NONE,
  mangrove_fence_gate: MapIds.NONE,
  mangrove_hanging_sign: MapIds.NONE,
  mangrove_leaves: [
    {
      id: MapIds.PLANT,
      properties: {
        waterlogged: "false"
      }
    },
    {
      id: MapIds.WATER,
      properties: {
        waterlogged: "true"
      }
    }
  ],
  mangrove_log: [
    {
      id: MapIds.COLOR_RED,
      properties: {
        axis: "y"
      }
    },
    {
      id: MapIds.PODZOL,
      properties: {
        axis: "z"
      }
    },
    {
      id: MapIds.PODZOL,
      properties: {
        axis: "x"
      }
    }
  ],
  mangrove_planks: MapIds.COLOR_RED,
  mangrove_pressure_plate: MapIds.COLOR_RED,
  mangrove_propagule: MapIds.NONE,
  mangrove_roots: MapIds.PODZOL,
  mangrove_shelf: MapIds.NONE,
  mangrove_sign: MapIds.NONE,
  mangrove_slab: MapIds.COLOR_RED,
  mangrove_stairs: MapIds.COLOR_RED,
  mangrove_trapdoor: MapIds.COLOR_RED,
  mangrove_wall_hanging_sign: MapIds.NONE,
  mangrove_wall_sign: MapIds.NONE,
  mangrove_wood: MapIds.PODZOL,
  medium_amethyst_bud: MapIds.NONE,
  melon: MapIds.COLOR_LIGHT_GREEN,
  melon_stem: MapIds.NONE,
  moss_block: MapIds.COLOR_GREEN,
  moss_carpet: MapIds.COLOR_GREEN,
  mossy_cobblestone: MapIds.STONE,
  mossy_cobblestone_slab: MapIds.STONE,
  mossy_cobblestone_stairs: MapIds.STONE,
  mossy_cobblestone_wall: MapIds.NONE,
  mossy_stone_brick_slab: MapIds.STONE,
  mossy_stone_brick_stairs: MapIds.STONE,
  mossy_stone_brick_wall: MapIds.NONE,
  mossy_stone_bricks: MapIds.STONE,
  moving_piston: MapIds.STONE,
  mud: MapIds.TERRACOTTA_CYAN,
  mud_brick_slab: MapIds.TERRACOTTA_LIGHT_GRAY,
  mud_brick_stairs: MapIds.TERRACOTTA_LIGHT_GRAY,
  mud_brick_wall: MapIds.NONE,
  mud_bricks: MapIds.TERRACOTTA_LIGHT_GRAY,
  muddy_mangrove_roots: MapIds.PODZOL,
  mushroom_stem: MapIds.WOOL,
  mycelium: MapIds.COLOR_PURPLE,
  nether_brick_fence: MapIds.NONE,
  nether_brick_slab: MapIds.NETHER,
  nether_brick_stairs: MapIds.NETHER,
  nether_brick_wall: MapIds.NONE,
  nether_bricks: MapIds.NETHER,
  nether_gold_ore: MapIds.NETHER,
  nether_portal: MapIds.NONE,
  nether_quartz_ore: MapIds.NETHER,
  nether_sprouts: MapIds.NONE,
  nether_wart: MapIds.NONE,
  nether_wart_block: MapIds.COLOR_RED,
  netherite_block: MapIds.COLOR_BLACK,
  netherrack: MapIds.NETHER,
  note_block: MapIds.WOOD,
  oak_button: MapIds.NONE,
  oak_door: MapIds.NONE,
  oak_fence: MapIds.NONE,
  oak_fence_gate: MapIds.NONE,
  oak_hanging_sign: MapIds.NONE,
  oak_leaves: [
    {
      id: MapIds.PLANT,
      properties: {
        waterlogged: "false"
      }
    },
    {
      id: MapIds.WATER,
      properties: {
        waterlogged: "true"
      }
    }
  ],
  oak_log: [
    {
      id: MapIds.WOOD,
      properties: {
        axis: "y"
      }
    },
    {
      id: MapIds.PODZOL,
      properties: {
        axis: "z"
      }
    },
    {
      id: MapIds.PODZOL,
      properties: {
        axis: "x"
      }
    }
  ],
  oak_planks: MapIds.WOOD,
  oak_pressure_plate: MapIds.WOOD,
  oak_sapling: MapIds.NONE,
  oak_shelf: MapIds.NONE,
  oak_sign: MapIds.NONE,
  oak_slab: MapIds.WOOD,
  oak_stairs: MapIds.WOOD,
  oak_trapdoor: MapIds.WOOD,
  oak_wall_hanging_sign: MapIds.NONE,
  oak_wall_sign: MapIds.NONE,
  oak_wood: MapIds.PODZOL,
  observer: MapIds.STONE,
  obsidian: MapIds.COLOR_BLACK,
  ochre_froglight: MapIds.SAND,
  open_eyeblossom: MapIds.NONE,
  orange_banner: MapIds.NONE,
  orange_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_ORANGE,
      properties: {
        part: "foot"
      }
    }
  ],
  orange_candle: MapIds.NONE,
  orange_candle_cake: MapIds.NONE,
  orange_carpet: MapIds.COLOR_ORANGE,
  orange_concrete: MapIds.COLOR_ORANGE,
  orange_concrete_powder: MapIds.COLOR_ORANGE,
  orange_glazed_terracotta: MapIds.COLOR_ORANGE,
  orange_shulker_box: MapIds.COLOR_ORANGE,
  orange_stained_glass: MapIds.COLOR_ORANGE,
  orange_stained_glass_pane: MapIds.NONE,
  orange_terracotta: MapIds.TERRACOTTA_ORANGE,
  orange_tulip: MapIds.NONE,
  orange_wall_banner: MapIds.NONE,
  orange_wool: MapIds.COLOR_ORANGE,
  oxeye_daisy: MapIds.NONE,
  oxidized_chiseled_copper: MapIds.WARPED_NYLIUM,
  oxidized_copper: MapIds.WARPED_NYLIUM,
  oxidized_copper_bars: MapIds.NONE,
  oxidized_copper_bulb: MapIds.WARPED_NYLIUM,
  oxidized_copper_chain: MapIds.NONE,
  oxidized_copper_chest: MapIds.WARPED_NYLIUM,
  oxidized_copper_door: MapIds.NONE,
  oxidized_copper_golem_statue: MapIds.NONE,
  oxidized_copper_grate: MapIds.WARPED_NYLIUM,
  oxidized_copper_lantern: MapIds.NONE,
  oxidized_copper_trapdoor: MapIds.WARPED_NYLIUM,
  oxidized_cut_copper: MapIds.WARPED_NYLIUM,
  oxidized_cut_copper_slab: MapIds.WARPED_NYLIUM,
  oxidized_cut_copper_stairs: MapIds.WARPED_NYLIUM,
  oxidized_lightning_rod: MapIds.NONE,
  packed_ice: MapIds.ICE,
  packed_mud: MapIds.DIRT,
  pale_hanging_moss: MapIds.NONE,
  pale_moss_block: MapIds.COLOR_LIGHT_GRAY,
  pale_moss_carpet: MapIds.COLOR_LIGHT_GRAY,
  pale_oak_button: MapIds.NONE,
  pale_oak_door: MapIds.NONE,
  pale_oak_fence: MapIds.NONE,
  pale_oak_fence_gate: MapIds.NONE,
  pale_oak_hanging_sign: MapIds.NONE,
  pale_oak_leaves: [
    {
      id: MapIds.METAL,
      properties: {
        waterlogged: "false"
      }
    },
    {
      id: MapIds.WATER,
      properties: {
        waterlogged: "true"
      }
    }
  ],
  pale_oak_log: [
    {
      id: MapIds.QUARTZ,
      properties: {
        axis: "y"
      }
    },
    {
      id: MapIds.STONE,
      properties: {
        axis: "z"
      }
    },
    {
      id: MapIds.STONE,
      properties: {
        axis: "x"
      }
    }
  ],
  pale_oak_planks: MapIds.QUARTZ,
  pale_oak_pressure_plate: MapIds.QUARTZ,
  pale_oak_sapling: MapIds.NONE,
  pale_oak_shelf: MapIds.NONE,
  pale_oak_sign: MapIds.NONE,
  pale_oak_slab: MapIds.QUARTZ,
  pale_oak_stairs: MapIds.QUARTZ,
  pale_oak_trapdoor: MapIds.QUARTZ,
  pale_oak_wall_hanging_sign: MapIds.NONE,
  pale_oak_wall_sign: MapIds.NONE,
  pale_oak_wood: MapIds.STONE,
  pearlescent_froglight: MapIds.COLOR_PINK,
  peony: MapIds.NONE,
  petrified_oak_slab: MapIds.WOOD,
  piglin_head: MapIds.NONE,
  piglin_wall_head: MapIds.NONE,
  pink_banner: MapIds.NONE,
  pink_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_PINK,
      properties: {
        part: "foot"
      }
    }
  ],
  pink_candle: MapIds.NONE,
  pink_candle_cake: MapIds.NONE,
  pink_carpet: MapIds.COLOR_PINK,
  pink_concrete: MapIds.COLOR_PINK,
  pink_concrete_powder: MapIds.COLOR_PINK,
  pink_glazed_terracotta: MapIds.COLOR_PINK,
  pink_petals: MapIds.NONE,
  pink_shulker_box: MapIds.COLOR_PINK,
  pink_stained_glass: MapIds.COLOR_PINK,
  pink_stained_glass_pane: MapIds.NONE,
  pink_terracotta: MapIds.TERRACOTTA_PINK,
  pink_tulip: MapIds.NONE,
  pink_wall_banner: MapIds.NONE,
  pink_wool: MapIds.COLOR_PINK,
  piston: MapIds.STONE,
  piston_head: MapIds.STONE,
  pitcher_crop: MapIds.NONE,
  pitcher_plant: MapIds.NONE,
  player_head: MapIds.NONE,
  player_wall_head: MapIds.NONE,
  podzol: MapIds.PODZOL,
  pointed_dripstone: MapIds.NONE,
  polished_andesite: MapIds.STONE,
  polished_andesite_slab: MapIds.STONE,
  polished_andesite_stairs: MapIds.STONE,
  polished_basalt: MapIds.COLOR_BLACK,
  polished_blackstone: MapIds.COLOR_BLACK,
  polished_blackstone_brick_slab: MapIds.COLOR_BLACK,
  polished_blackstone_brick_stairs: MapIds.COLOR_BLACK,
  polished_blackstone_brick_wall: MapIds.NONE,
  polished_blackstone_bricks: MapIds.COLOR_BLACK,
  polished_blackstone_button: MapIds.NONE,
  polished_blackstone_pressure_plate: MapIds.COLOR_BLACK,
  polished_blackstone_slab: MapIds.COLOR_BLACK,
  polished_blackstone_stairs: MapIds.COLOR_BLACK,
  polished_blackstone_wall: MapIds.NONE,
  polished_deepslate: MapIds.DEEPSLATE,
  polished_deepslate_slab: MapIds.DEEPSLATE,
  polished_deepslate_stairs: MapIds.DEEPSLATE,
  polished_deepslate_wall: MapIds.NONE,
  polished_diorite: MapIds.QUARTZ,
  polished_diorite_slab: MapIds.QUARTZ,
  polished_diorite_stairs: MapIds.QUARTZ,
  polished_granite: MapIds.DIRT,
  polished_granite_slab: MapIds.DIRT,
  polished_granite_stairs: MapIds.DIRT,
  polished_tuff: MapIds.TERRACOTTA_GRAY,
  polished_tuff_slab: MapIds.TERRACOTTA_GRAY,
  polished_tuff_stairs: MapIds.TERRACOTTA_GRAY,
  polished_tuff_wall: MapIds.NONE,
  poppy: MapIds.NONE,
  potatoes: MapIds.NONE,
  potted_acacia_sapling: MapIds.NONE,
  potted_allium: MapIds.NONE,
  potted_azalea_bush: MapIds.NONE,
  potted_azure_bluet: MapIds.NONE,
  potted_bamboo: MapIds.NONE,
  potted_birch_sapling: MapIds.NONE,
  potted_blue_orchid: MapIds.NONE,
  potted_brown_mushroom: MapIds.NONE,
  potted_cactus: MapIds.NONE,
  potted_cherry_sapling: MapIds.NONE,
  potted_closed_eyeblossom: MapIds.NONE,
  potted_cornflower: MapIds.NONE,
  potted_crimson_fungus: MapIds.NONE,
  potted_crimson_roots: MapIds.NONE,
  potted_dandelion: MapIds.NONE,
  potted_dark_oak_sapling: MapIds.NONE,
  potted_dead_bush: MapIds.NONE,
  potted_fern: MapIds.NONE,
  potted_flowering_azalea_bush: MapIds.NONE,
  potted_jungle_sapling: MapIds.NONE,
  potted_lily_of_the_valley: MapIds.NONE,
  potted_mangrove_propagule: MapIds.NONE,
  potted_oak_sapling: MapIds.NONE,
  potted_open_eyeblossom: MapIds.NONE,
  potted_orange_tulip: MapIds.NONE,
  potted_oxeye_daisy: MapIds.NONE,
  potted_pale_oak_sapling: MapIds.NONE,
  potted_pink_tulip: MapIds.NONE,
  potted_poppy: MapIds.NONE,
  potted_red_mushroom: MapIds.NONE,
  potted_red_tulip: MapIds.NONE,
  potted_spruce_sapling: MapIds.NONE,
  potted_torchflower: MapIds.NONE,
  potted_warped_fungus: MapIds.NONE,
  potted_warped_roots: MapIds.NONE,
  potted_white_tulip: MapIds.NONE,
  potted_wither_rose: MapIds.NONE,
  powder_snow: MapIds.SNOW,
  powder_snow_cauldron: MapIds.STONE,
  powered_rail: MapIds.NONE,
  prismarine: MapIds.COLOR_CYAN,
  prismarine_brick_slab: MapIds.DIAMOND,
  prismarine_brick_stairs: MapIds.DIAMOND,
  prismarine_bricks: MapIds.DIAMOND,
  prismarine_slab: MapIds.COLOR_CYAN,
  prismarine_stairs: MapIds.COLOR_CYAN,
  prismarine_wall: MapIds.NONE,
  pumpkin: MapIds.COLOR_ORANGE,
  pumpkin_stem: MapIds.NONE,
  purple_banner: MapIds.NONE,
  purple_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_PURPLE,
      properties: {
        part: "foot"
      }
    }
  ],
  purple_candle: MapIds.NONE,
  purple_candle_cake: MapIds.NONE,
  purple_carpet: MapIds.COLOR_PURPLE,
  purple_concrete: MapIds.COLOR_PURPLE,
  purple_concrete_powder: MapIds.COLOR_PURPLE,
  purple_glazed_terracotta: MapIds.COLOR_PURPLE,
  purple_shulker_box: MapIds.TERRACOTTA_PURPLE,
  purple_stained_glass: MapIds.COLOR_PURPLE,
  purple_stained_glass_pane: MapIds.NONE,
  purple_terracotta: MapIds.TERRACOTTA_PURPLE,
  purple_wall_banner: MapIds.NONE,
  purple_wool: MapIds.COLOR_PURPLE,
  purpur_block: MapIds.COLOR_MAGENTA,
  purpur_pillar: MapIds.COLOR_MAGENTA,
  purpur_slab: MapIds.COLOR_MAGENTA,
  purpur_stairs: MapIds.COLOR_MAGENTA,
  quartz_block: MapIds.QUARTZ,
  quartz_bricks: MapIds.QUARTZ,
  quartz_pillar: MapIds.QUARTZ,
  quartz_slab: MapIds.QUARTZ,
  quartz_stairs: MapIds.QUARTZ,
  rail: MapIds.NONE,
  raw_copper_block: MapIds.COLOR_ORANGE,
  raw_gold_block: MapIds.GOLD,
  raw_iron_block: MapIds.RAW_IRON,
  red_banner: MapIds.NONE,
  red_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_RED,
      properties: {
        part: "foot"
      }
    }
  ],
  red_candle: MapIds.NONE,
  red_candle_cake: MapIds.NONE,
  red_carpet: MapIds.COLOR_RED,
  red_concrete: MapIds.COLOR_RED,
  red_concrete_powder: MapIds.COLOR_RED,
  red_glazed_terracotta: MapIds.COLOR_RED,
  red_mushroom: MapIds.COLOR_RED,
  red_mushroom_block: MapIds.COLOR_RED,
  red_nether_brick_slab: MapIds.NETHER,
  red_nether_brick_stairs: MapIds.NETHER,
  red_nether_brick_wall: MapIds.NONE,
  red_nether_bricks: MapIds.NETHER,
  red_sand: MapIds.COLOR_ORANGE,
  red_sandstone: MapIds.COLOR_ORANGE,
  red_sandstone_slab: MapIds.COLOR_ORANGE,
  red_sandstone_stairs: MapIds.COLOR_ORANGE,
  red_sandstone_wall: MapIds.NONE,
  red_shulker_box: MapIds.COLOR_RED,
  red_stained_glass: MapIds.COLOR_RED,
  red_stained_glass_pane: MapIds.NONE,
  red_terracotta: MapIds.TERRACOTTA_RED,
  red_tulip: MapIds.NONE,
  red_wall_banner: MapIds.NONE,
  red_wool: MapIds.COLOR_RED,
  redstone_block: MapIds.FIRE,
  redstone_lamp: MapIds.TERRACOTTA_ORANGE,
  redstone_ore: MapIds.STONE,
  redstone_torch: MapIds.NONE,
  redstone_wall_torch: MapIds.NONE,
  redstone_wire: MapIds.NONE,
  reinforced_deepslate: MapIds.DEEPSLATE,
  repeater: MapIds.NONE,
  repeating_command_block: MapIds.COLOR_PURPLE,
  resin_block: MapIds.TERRACOTTA_ORANGE,
  resin_brick_slab: MapIds.TERRACOTTA_ORANGE,
  resin_brick_stairs: MapIds.TERRACOTTA_ORANGE,
  resin_brick_wall: MapIds.NONE,
  resin_bricks: MapIds.TERRACOTTA_ORANGE,
  resin_clump: MapIds.NONE,
  respawn_anchor: MapIds.COLOR_BLACK,
  rooted_dirt: MapIds.DIRT,
  rose_bush: MapIds.NONE,
  sand: MapIds.SAND,
  sandstone: MapIds.SAND,
  sandstone_slab: MapIds.SAND,
  sandstone_stairs: MapIds.SAND,
  sandstone_wall: MapIds.NONE,
  scaffolding: MapIds.SAND,
  sculk: MapIds.COLOR_BLACK,
  sculk_catalyst: MapIds.COLOR_BLACK,
  sculk_sensor: MapIds.COLOR_CYAN,
  sculk_shrieker: MapIds.COLOR_BLACK,
  sculk_vein: MapIds.NONE,
  sea_lantern: MapIds.QUARTZ,
  sea_pickle: MapIds.NONE,
  seagrass: MapIds.WATER,
  short_dry_grass: MapIds.NONE,
  short_grass: MapIds.NONE,
  shroomlight: MapIds.COLOR_RED,
  shulker_box: MapIds.COLOR_PURPLE,
  skeleton_skull: MapIds.NONE,
  skeleton_wall_skull: MapIds.NONE,
  slime_block: MapIds.GRASS,
  small_amethyst_bud: MapIds.NONE,
  small_dripleaf: MapIds.NONE,
  smithing_table: MapIds.WOOD,
  smoker: MapIds.STONE,
  smooth_basalt: MapIds.COLOR_BLACK,
  smooth_quartz: MapIds.QUARTZ,
  smooth_quartz_slab: MapIds.QUARTZ,
  smooth_quartz_stairs: MapIds.QUARTZ,
  smooth_red_sandstone: MapIds.COLOR_ORANGE,
  smooth_red_sandstone_slab: MapIds.COLOR_ORANGE,
  smooth_red_sandstone_stairs: MapIds.COLOR_ORANGE,
  smooth_sandstone: MapIds.SAND,
  smooth_sandstone_slab: MapIds.SAND,
  smooth_sandstone_stairs: MapIds.SAND,
  smooth_stone: MapIds.STONE,
  smooth_stone_slab: MapIds.STONE,
  sniffer_egg: MapIds.NONE,
  snow: MapIds.SNOW,
  snow_block: MapIds.SNOW,
  soul_campfire: MapIds.NONE,
  soul_fire: MapIds.COLOR_LIGHT_BLUE,
  soul_lantern: MapIds.NONE,
  soul_sand: MapIds.COLOR_BROWN,
  soul_soil: MapIds.COLOR_BROWN,
  soul_torch: MapIds.NONE,
  soul_wall_torch: MapIds.NONE,
  spawner: MapIds.STONE,
  sponge: MapIds.COLOR_YELLOW,
  spore_blossom: MapIds.NONE,
  spruce_button: MapIds.NONE,
  spruce_door: MapIds.NONE,
  spruce_fence: MapIds.NONE,
  spruce_fence_gate: MapIds.NONE,
  spruce_hanging_sign: MapIds.NONE,
  spruce_leaves: [
    {
      id: MapIds.PLANT,
      properties: {
        waterlogged: "false"
      }
    },
    {
      id: MapIds.WATER,
      properties: {
        waterlogged: "true"
      }
    }
  ],
  spruce_log: [
    {
      id: MapIds.PODZOL,
      properties: {
        axis: "y"
      }
    },
    {
      id: MapIds.COLOR_BROWN,
      properties: {
        axis: "z"
      }
    },
    {
      id: MapIds.COLOR_BROWN,
      properties: {
        axis: "x"
      }
    }
  ],
  spruce_planks: MapIds.PODZOL,
  spruce_pressure_plate: MapIds.PODZOL,
  spruce_sapling: MapIds.NONE,
  spruce_shelf: MapIds.NONE,
  spruce_sign: MapIds.NONE,
  spruce_slab: MapIds.PODZOL,
  spruce_stairs: MapIds.PODZOL,
  spruce_trapdoor: MapIds.PODZOL,
  spruce_wall_hanging_sign: MapIds.NONE,
  spruce_wall_sign: MapIds.NONE,
  spruce_wood: MapIds.COLOR_BROWN,
  sticky_piston: MapIds.STONE,
  stone: MapIds.STONE,
  stone_brick_slab: MapIds.STONE,
  stone_brick_stairs: MapIds.STONE,
  stone_brick_wall: MapIds.NONE,
  stone_bricks: MapIds.STONE,
  stone_button: MapIds.NONE,
  stone_pressure_plate: MapIds.STONE,
  stone_slab: MapIds.STONE,
  stone_stairs: MapIds.STONE,
  stonecutter: MapIds.STONE,
  stripped_acacia_log: MapIds.COLOR_ORANGE,
  stripped_acacia_wood: MapIds.COLOR_ORANGE,
  stripped_bamboo_block: MapIds.COLOR_YELLOW,
  stripped_birch_log: MapIds.SAND,
  stripped_birch_wood: MapIds.SAND,
  stripped_cherry_log: MapIds.TERRACOTTA_PINK,
  stripped_cherry_wood: MapIds.TERRACOTTA_PINK,
  stripped_crimson_hyphae: MapIds.CRIMSON_STEM,
  stripped_crimson_stem: MapIds.CRIMSON_STEM,
  stripped_dark_oak_log: MapIds.COLOR_BROWN,
  stripped_dark_oak_wood: MapIds.COLOR_BROWN,
  stripped_jungle_log: MapIds.DIRT,
  stripped_jungle_wood: MapIds.DIRT,
  stripped_mangrove_log: MapIds.COLOR_RED,
  stripped_mangrove_wood: MapIds.COLOR_RED,
  stripped_oak_log: MapIds.WOOD,
  stripped_oak_wood: MapIds.WOOD,
  stripped_pale_oak_log: MapIds.QUARTZ,
  stripped_pale_oak_wood: MapIds.QUARTZ,
  stripped_spruce_log: MapIds.PODZOL,
  stripped_spruce_wood: MapIds.PODZOL,
  stripped_warped_hyphae: MapIds.WARPED_STEM,
  stripped_warped_stem: MapIds.WARPED_STEM,
  structure_block: MapIds.COLOR_LIGHT_GRAY,
  structure_void: MapIds.NONE,
  sugar_cane: MapIds.NONE,
  sunflower: MapIds.NONE,
  suspicious_gravel: MapIds.STONE,
  suspicious_sand: MapIds.SAND,
  sweet_berry_bush: MapIds.NONE,
  tall_dry_grass: MapIds.NONE,
  tall_grass: MapIds.NONE,
  tall_seagrass: MapIds.WATER,
  target: MapIds.QUARTZ,
  terracotta: MapIds.COLOR_ORANGE,
  test_block: MapIds.COLOR_LIGHT_GRAY,
  test_instance_block: MapIds.NONE,
  tinted_glass: MapIds.COLOR_GRAY,
  tnt: MapIds.FIRE,
  torch: MapIds.NONE,
  torchflower: MapIds.NONE,
  torchflower_crop: MapIds.NONE,
  trapped_chest: MapIds.WOOD,
  trial_spawner: MapIds.STONE,
  tripwire: MapIds.NONE,
  tripwire_hook: MapIds.NONE,
  tube_coral: MapIds.COLOR_BLUE,
  tube_coral_block: MapIds.COLOR_BLUE,
  tube_coral_fan: MapIds.NONE,
  tube_coral_wall_fan: MapIds.NONE,
  tuff: MapIds.TERRACOTTA_GRAY,
  tuff_brick_slab: MapIds.TERRACOTTA_GRAY,
  tuff_brick_stairs: MapIds.TERRACOTTA_GRAY,
  tuff_brick_wall: MapIds.NONE,
  tuff_bricks: MapIds.TERRACOTTA_GRAY,
  tuff_slab: MapIds.TERRACOTTA_GRAY,
  tuff_stairs: MapIds.TERRACOTTA_GRAY,
  tuff_wall: MapIds.NONE,
  turtle_egg: MapIds.NONE,
  twisting_vines: MapIds.NONE,
  twisting_vines_plant: MapIds.NONE,
  vault: MapIds.STONE,
  verdant_froglight: MapIds.NONE,
  vine: MapIds.NONE,
  void_air: MapIds.NONE,
  wall_torch: MapIds.NONE,
  warped_button: MapIds.NONE,
  warped_door: MapIds.NONE,
  warped_fence: MapIds.NONE,
  warped_fence_gate: MapIds.NONE,
  warped_fungus: MapIds.NONE,
  warped_hanging_sign: MapIds.NONE,
  warped_hyphae: MapIds.WARPED_HYPHAE,
  warped_nylium: MapIds.WARPED_NYLIUM,
  warped_planks: MapIds.WARPED_STEM,
  warped_pressure_plate: MapIds.WARPED_STEM,
  warped_roots: MapIds.NONE,
  warped_shelf: MapIds.NONE,
  warped_sign: MapIds.NONE,
  warped_slab: MapIds.WARPED_STEM,
  warped_stairs: MapIds.WARPED_STEM,
  warped_stem: [
    {
      id: MapIds.WARPED_STEM,
      properties: {
        axis: "y"
      }
    },
    {
      id: MapIds.WARPED_HYPHAE,
      properties: {
        axis: "z"
      }
    },
    {
      id: MapIds.WARPED_HYPHAE,
      properties: {
        axis: "x"
      }
    }
  ],
  warped_trapdoor: MapIds.WARPED_STEM,
  warped_wall_hanging_sign: MapIds.NONE,
  warped_wall_sign: MapIds.NONE,
  warped_wart_block: MapIds.WARPED_WART_BLOCK,
  water: MapIds.WATER,
  water_cauldron: MapIds.STONE,
  waxed_chiseled_copper: MapIds.COLOR_ORANGE,
  waxed_copper_bars: MapIds.NONE,
  waxed_copper_block: MapIds.COLOR_ORANGE,
  waxed_copper_bulb: MapIds.COLOR_ORANGE,
  waxed_copper_chain: MapIds.NONE,
  waxed_copper_chest: MapIds.COLOR_ORANGE,
  waxed_copper_door: MapIds.NONE,
  waxed_copper_golem_statue: MapIds.NONE,
  waxed_copper_grate: MapIds.COLOR_ORANGE,
  waxed_copper_lantern: MapIds.NONE,
  waxed_copper_trapdoor: MapIds.COLOR_ORANGE,
  waxed_cut_copper: MapIds.COLOR_ORANGE,
  waxed_cut_copper_slab: MapIds.COLOR_ORANGE,
  waxed_cut_copper_stairs: MapIds.COLOR_ORANGE,
  waxed_exposed_chiseled_copper: MapIds.TERRACOTTA_LIGHT_GRAY,
  waxed_exposed_copper: MapIds.TERRACOTTA_LIGHT_GRAY,
  waxed_exposed_copper_bars: MapIds.NONE,
  waxed_exposed_copper_bulb: MapIds.TERRACOTTA_LIGHT_GRAY,
  waxed_exposed_copper_chain: MapIds.NONE,
  waxed_exposed_copper_chest: MapIds.TERRACOTTA_LIGHT_GRAY,
  waxed_exposed_copper_door: MapIds.NONE,
  waxed_exposed_copper_golem_statue: MapIds.NONE,
  waxed_exposed_copper_grate: MapIds.TERRACOTTA_LIGHT_GRAY,
  waxed_exposed_copper_lantern: MapIds.NONE,
  waxed_exposed_copper_trapdoor: MapIds.TERRACOTTA_LIGHT_GRAY,
  waxed_exposed_cut_copper: MapIds.TERRACOTTA_LIGHT_GRAY,
  waxed_exposed_cut_copper_slab: MapIds.TERRACOTTA_LIGHT_GRAY,
  waxed_exposed_cut_copper_stairs: MapIds.TERRACOTTA_LIGHT_GRAY,
  waxed_exposed_lightning_rod: MapIds.NONE,
  waxed_lightning_rod: MapIds.NONE,
  waxed_oxidized_chiseled_copper: MapIds.WARPED_NYLIUM,
  waxed_oxidized_copper: MapIds.WARPED_NYLIUM,
  waxed_oxidized_copper_bars: MapIds.NONE,
  waxed_oxidized_copper_bulb: MapIds.WARPED_NYLIUM,
  waxed_oxidized_copper_chain: MapIds.NONE,
  waxed_oxidized_copper_chest: MapIds.WARPED_NYLIUM,
  waxed_oxidized_copper_door: MapIds.NONE,
  waxed_oxidized_copper_golem_statue: MapIds.NONE,
  waxed_oxidized_copper_grate: MapIds.WARPED_NYLIUM,
  waxed_oxidized_copper_lantern: MapIds.NONE,
  waxed_oxidized_copper_trapdoor: MapIds.WARPED_NYLIUM,
  waxed_oxidized_cut_copper: MapIds.WARPED_NYLIUM,
  waxed_oxidized_cut_copper_slab: MapIds.WARPED_NYLIUM,
  waxed_oxidized_cut_copper_stairs: MapIds.WARPED_NYLIUM,
  waxed_oxidized_lightning_rod: MapIds.NONE,
  waxed_weathered_chiseled_copper: MapIds.WARPED_STEM,
  waxed_weathered_copper: MapIds.WARPED_STEM,
  waxed_weathered_copper_bars: MapIds.NONE,
  waxed_weathered_copper_bulb: MapIds.WARPED_STEM,
  waxed_weathered_copper_chain: MapIds.NONE,
  waxed_weathered_copper_chest: MapIds.WARPED_STEM,
  waxed_weathered_copper_door: MapIds.NONE,
  waxed_weathered_copper_golem_statue: MapIds.NONE,
  waxed_weathered_copper_grate: MapIds.WARPED_STEM,
  waxed_weathered_copper_lantern: MapIds.NONE,
  waxed_weathered_copper_trapdoor: MapIds.WARPED_STEM,
  waxed_weathered_cut_copper: MapIds.WARPED_STEM,
  waxed_weathered_cut_copper_slab: MapIds.WARPED_STEM,
  waxed_weathered_cut_copper_stairs: MapIds.WARPED_STEM,
  waxed_weathered_lightning_rod: MapIds.NONE,
  weathered_chiseled_copper: MapIds.WARPED_STEM,
  weathered_copper: MapIds.WARPED_STEM,
  weathered_copper_bars: MapIds.NONE,
  weathered_copper_bulb: MapIds.WARPED_STEM,
  weathered_copper_chain: MapIds.NONE,
  weathered_copper_chest: MapIds.WARPED_STEM,
  weathered_copper_door: MapIds.NONE,
  weathered_copper_golem_statue: MapIds.NONE,
  weathered_copper_grate: MapIds.WARPED_STEM,
  weathered_copper_lantern: MapIds.NONE,
  weathered_copper_trapdoor: MapIds.WARPED_STEM,
  weathered_cut_copper: MapIds.WARPED_STEM,
  weathered_cut_copper_slab: MapIds.WARPED_STEM,
  weathered_cut_copper_stairs: MapIds.WARPED_STEM,
  weathered_lightning_rod: MapIds.NONE,
  weeping_vines: MapIds.NONE,
  weeping_vines_plant: MapIds.NONE,
  wet_sponge: MapIds.COLOR_YELLOW,
  wheat: MapIds.NONE,
  white_banner: MapIds.NONE,
  white_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.SNOW,
      properties: {
        part: "foot"
      }
    }
  ],
  white_candle: MapIds.NONE,
  white_candle_cake: MapIds.NONE,
  white_carpet: MapIds.SNOW,
  white_concrete: MapIds.SNOW,
  white_concrete_powder: MapIds.SNOW,
  white_glazed_terracotta: MapIds.SNOW,
  white_shulker_box: MapIds.SNOW,
  white_stained_glass: MapIds.SNOW,
  white_stained_glass_pane: MapIds.NONE,
  white_terracotta: MapIds.TERRACOTTA_WHITE,
  white_tulip: MapIds.NONE,
  white_wall_banner: MapIds.NONE,
  white_wool: MapIds.SNOW,
  wildflowers: MapIds.NONE,
  wither_rose: MapIds.NONE,
  wither_skeleton_skull: MapIds.NONE,
  wither_skeleton_wall_skull: MapIds.NONE,
  yellow_banner: MapIds.NONE,
  yellow_bed: [
    {
      id: MapIds.WOOL,
      properties: {
        part: "head"
      }
    },
    {
      id: MapIds.COLOR_YELLOW,
      properties: {
        part: "foot"
      }
    }
  ],
  yellow_candle: MapIds.NONE,
  yellow_candle_cake: MapIds.NONE,
  yellow_carpet: MapIds.COLOR_YELLOW,
  yellow_concrete: MapIds.COLOR_YELLOW,
  yellow_concrete_powder: MapIds.COLOR_YELLOW,
  yellow_glazed_terracotta: MapIds.COLOR_YELLOW,
  yellow_shulker_box: MapIds.COLOR_YELLOW,
  yellow_stained_glass: MapIds.COLOR_YELLOW,
  yellow_stained_glass_pane: MapIds.NONE,
  yellow_terracotta: MapIds.TERRACOTTA_YELLOW,
  yellow_wall_banner: MapIds.NONE,
  yellow_wool: MapIds.COLOR_YELLOW,
  zombie_head: MapIds.NONE,
  zombie_wall_head: MapIds.NONE
};
