import { inject, Injectable } from "@angular/core";
import { MapIds } from "../../constants/map-colors";
import { MapPalette } from "../../constants/map-palettes/map-palette";
import { BlockPaletteEntry, Chunk, ChunkSection } from "../../models/chunk";
import { ChunkMapData } from "../../models/chunk-map-data";
import { Coords } from "../../models/coords";
import {
  CommonCompressionFormat,
  DecompressionService
} from "../decompression/decompression-service";
import { NBTService } from "../nbt/nbt-service";

@Injectable({
  providedIn: "root"
})
export class AnvilService {
  public static readonly BLOCKS_IN_CHUNK = 16;
  public static readonly CHUNKS_IN_REGION = 32;

  private readonly decompressionService = inject(DecompressionService);
  private readonly NBTService = inject(NBTService);

  /**
   * Gets the data of a chunk given the data of an anvil file and
   * the coordinates of a chunk in the region.
   */
  async getChunkData(
    anvilData: ArrayBuffer,
    chunkX: number,
    chunkZ: number
  ): Promise<Chunk | undefined> {
    try {
      if (chunkX < 0 || chunkX > 31 || chunkZ < 0 || chunkZ > 31) {
        throw new Error(
          `Invalid argument: x: ${chunkX}, z: ${chunkZ}. The ranges for x and z are [0,31].`
        );
      }

      const dataView = new DataView(anvilData);

      const locationOffset = 4 * ((chunkX % 32) + (chunkZ % 32) * 32);
      const payloadOffset = (dataView.getUint32(locationOffset) >> 8) * 4096;
      const payloadSectorCount = dataView.getUint8(locationOffset + 3);

      // const timestampOffset = locationOffset + 4096;
      // const payloadTimestamp = dataView.getUint32(timestampOffset);

      /**
       * "If a chunk isn't present in the region file (e.g. because it
       * hasn't been generated or migrated yet), both fields are zero."
       */
      if (payloadOffset === 0 || payloadSectorCount === 0) {
        return undefined;
      }

      /**
       * "Chunk data begins with a (big-endian) four-byte signed length field that
       * indicates the exact length of the remaining chunk data in bytes."
       * Minus 1 for the compression type byte. The remaining bytes are the
       * compressed data.
       */
      const dataLength = dataView.getInt32(payloadOffset) - 1;

      /**
       * (1) gzip (RFC1952) (unused in practice)
       * (2) zlib (RFC1950)
       * (3) Uncompressed (older versions)
       * (4) LZ4
       * (127) Custom
       */
      const compressionType = dataView.getUint8(payloadOffset + 4);
      if (compressionType < 1 || compressionType > 4) {
        throw new Error(
          `Invalid compression type: ${compressionType}. Custom compression is not supported.`
        );
      }

      const compressedData = dataView.buffer.slice(
        payloadOffset + 5,
        payloadOffset + 5 + dataLength
      );
      let compressionFormat: CommonCompressionFormat | undefined = undefined;
      if (compressionType === 1) {
        if (!this.decompressionService.isValidGzipData(compressedData)) {
          throw new Error("Invalid gzip data.");
        }
        compressionFormat = "gzip";
      } else if (compressionType === 2) {
        if (!this.decompressionService.isValidZlibData(compressedData)) {
          throw new Error("Invalid zlib data.");
        }
        compressionFormat = "deflate";
      } else if (compressionType === 4) {
        if (!this.decompressionService.isValidLz4Data(compressedData)) {
          throw new Error("Invalid LZ4 data.");
        }
        compressionFormat = "lz4";
      }

      const decompressedData = compressionFormat
        ? await this.decompressionService.decompressData(
            compressedData,
            compressionFormat
          )
        : compressedData;

      return this.NBTService.getSNBT(decompressedData) as Chunk;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  /**
   * Returns the coordinates of a chunk in the world given
   * the corrdiantes of a block in the world.
   */
  worldBlockCoordsToChunkCoords(blockX: number, blockZ: number): Coords {
    return new Coords(Math.floor(blockX / 16), Math.floor(blockZ / 16));
  }

  /**
   * Returns the coordinates of a chunk in its region given the
   * coordinates of the chunk in the world.
   */
  worldChunkCoordsToRegionChunkCoords(chunkX: number, chunkZ: number): Coords {
    let regionChunkX = chunkX % 32;
    if (regionChunkX < 0) {
      regionChunkX += 32;
    }
    let regionChunkZ = chunkZ % 32;
    if (regionChunkZ < 0) {
      regionChunkZ += 32;
    }
    return new Coords(regionChunkX, regionChunkZ);
  }

  /**
   * Returns the coordinates of a region given the
   * coordinates of a chunk in the world.
   */
  worldChunkCoordsToRegionCoords(chunkX: number, chunkZ: number): Coords {
    return new Coords(Math.floor(chunkX / 32), Math.floor(chunkZ / 32));
  }

  /**
   * Given a chunk's data, returns a list of map color ids and y levels for each block in the chunk.
   * The list contains 256 entries (16x16).
   */
  getChunkMapData(
    chunk: Chunk,
    mapPalette: MapPalette,
    maxYLevel: number
  ): ChunkMapData {
    const chunkSections = chunk.sections.slice(
      chunk.sections[0].block_states !== undefined ? 0 : 1
    );

    if (!chunk.Heightmaps.WORLD_SURFACE) {
      throw new Error("Chunk height map is not defined.");
    }

    const colorIds: number[] = [];
    const yLevels: number[] = [];
    let minYLevel = chunkSections[0].Y * 16;
    let blockIndex = 0;
    for (const heightMapEntry of chunk.Heightmaps.WORLD_SURFACE) {
      for (let i = 0; i < 7 && blockIndex < 256; ++i, ++blockIndex) {
        let yLevel = Math.min(
          Number((heightMapEntry >> BigInt(i * 9)) & 0x1ffn) - minYLevel - 1,
          maxYLevel
        );
        let colorId: MapIds = MapIds.NONE;
        let isWater = false;
        for (; colorId === MapIds.NONE && yLevel >= minYLevel; --yLevel) {
          const paletteEntry = this.getChunkPaletteEntry(
            chunkSections,
            blockIndex,
            yLevel,
            minYLevel
          );
          colorId = this.getMapColorId(paletteEntry, mapPalette);
          if (colorId === MapIds.WATER) {
            colorId = MapIds.NONE;
            isWater = true;
          }
        }
        yLevels.push(yLevel);
        colorIds.push(isWater ? MapIds.WATER : colorId);
      }
    }
    return {
      colorIds: colorIds,
      yLevels: yLevels
    };
  }

  /**
   * Given a paletteEntry, returns the map color id associated with this palette/block
   */
  private getMapColorId(
    paletteEntry: BlockPaletteEntry,
    mapPalette: MapPalette
  ): MapIds {
    const blockColor = mapPalette[paletteEntry.Name.slice(10)];
    if (!blockColor) return MapIds.NONE;
    if (typeof blockColor === "number") return blockColor;
    for (const color of blockColor) {
      let match = true;
      for (const property in color.properties) {
        if (
          color.properties[property] !== paletteEntry.Properties?.[property]
        ) {
          match = false;
          break;
        }
      }
      if (match) return color.id;
    }
    return 0;
  }

  /**
   * Returns the name of a Minecraft block in a chunk given the chunk's section, the block's index (x,z) in the chunk, and its y level.
   * Each chunk section consists of a palette of Minecraft blocks and a list of BigInts that contain palette indices.
   * The number of palette indices per BigInt depends on the size of the palette (how many bits are needed to store a palette index).
   * Like height maps, blocks are stored in this increasing order XZY.
   */
  private getChunkPaletteEntry(
    chunkSections: ChunkSection[],
    chunkBlockIndex: number,
    blockYLevel: number,
    minYLevel: number
  ): BlockPaletteEntry {
    /**
     * Sections in a chunk are split based on y level.
     * 16 block height per section.
     */
    const section = chunkSections[Math.floor((blockYLevel - minYLevel) / 16)];

    /**
     * If a section only contains 1 type of block.
     */
    if (section.block_states.palette.length === 1) {
      return section.block_states.palette[0];
    }

    /**
     * Each data entry consists of a palette index.
     * What is the minimum number of bits required to store a palette index (depends on size of palette).
     * Minimum of 4 bits required.
     */
    const entrySizeBits = Math.max(
      Math.ceil(Math.log2(section.block_states.palette.length)),
      4
    );
    const entriesPerBigInt = Math.floor(64 / entrySizeBits);

    /**
     * What is the index of the entry we are looking for?
     * (How many entries are before the one we are looking for?)
     * Use the relative y level of our block in the section.
     * Each y level consists of 256 entries.
     */
    const remainder = blockYLevel % 16;
    const entryIndex =
      ((remainder >= 0 ? remainder : remainder + 16) % 16) * 256 +
      chunkBlockIndex;

    /**
     * Which BigInt contains our entry?
     * Bit shift and apply mask to get palette index.
     */
    const bigInt =
      section.block_states.data[Math.floor(entryIndex / entriesPerBigInt)];
    const shift = BigInt((entryIndex % entriesPerBigInt) * entrySizeBits);
    const mask = BigInt(Math.pow(2, entrySizeBits) - 1);
    const paletteIndex = Number((bigInt >> shift) & mask);
    return section.block_states.palette[paletteIndex];
  }
}
