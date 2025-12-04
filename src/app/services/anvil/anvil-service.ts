import { inject, Injectable } from "@angular/core";
import { Chunk, ChunkSection, BlockPaletteEntry } from "../../models/chunk";
import {
  CommonCompressionFormat,
  DecompressionService
} from "../decompression/decompression-service";
import { NBTService } from "../nbt/nbt-service";
import { BlockColors } from "../../constants/block-colors";

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
  worldBlockCoordsToChunkCoords(
    blockX: number,
    blockZ: number
  ): { chunkX: number; chunkZ: number } {
    return {
      chunkX: Math.floor(blockX / 16),
      chunkZ: Math.floor(blockZ / 16)
    };
  }

  /**
   * Returns the coordinates of a chunk in its region given the
   * coordinates of the chunk in the world.
   */
  worldChunkCoordsToRegionChunkCoords(
    chunkX: number,
    chunkZ: number
  ): { chunkX: number; chunkZ: number } {
    let regionChunkX = chunkX % 32;
    if (regionChunkX < 0) {
      regionChunkX += 32;
    }
    let regionChunkZ = chunkZ % 32;
    if (regionChunkZ < 0) {
      regionChunkZ += 32;
    }
    return {
      chunkX: regionChunkX,
      chunkZ: regionChunkZ
    };
  }

  /**
   * Returns the coordinates of a region given the
   * coordinates of a chunk in the world.
   */
  worldChunkCoordsToRegionCoords(
    chunkX: number,
    chunkZ: number
  ): { regionX: number; regionZ: number } {
    return {
      regionX: Math.floor(chunkX / 32),
      regionZ: Math.floor(chunkZ / 32)
    };
  }

  /**
   * Given a chunk's data, returns a list of map color ids and y levels for each block in the chunk.
   * The list contains 256 entries (16x16).
   */
  getChunkMapIds(chunk: Chunk): { mapColorId: number; yLevel: number }[] {
    /**
     * In certain scenarios, a 25th section can be included.
     * Only use the 24 sections starting with Y: -4.
     */
    let chunkSections: ChunkSection[] = [];
    for (let i = 0; i < chunk.sections.length; ++i) {
      if (chunk.sections[i].Y === -4) {
        chunkSections = chunk.sections.slice(i, i + 24);
        break;
      }
    }

    let chunkBlockIndex = -1;
    const blocks: { mapColorId: number; yLevel: number }[] = [];

    const worldHeightMap = chunk.Heightmaps.WORLD_SURFACE ?? [];
    for (const heightMap of worldHeightMap) {
      /**
       * Each heightMap consists of 7 9-bit numbers/entries.
       * Each heightMap is a BigInt (8 bytes). 7*9=63 bits. 1 bit extra.
       */
      for (let i = 0; i < 7; ++i) {
        // 16 * 16. We have processed all highest blocks in the chunk.
        if (++chunkBlockIndex === 256) return blocks;

        /**
         * Each heightMap entry (9-bit number) shows the number of blocks in that column in the chunk.
         * Minus 65 (1 + 64 (lowest y level is -64)) to get the block's starting y level.
         */
        let blockYLevel = Math.max(
          Number((heightMap >> BigInt(i * 9)) & 0x1ffn) - 65,
          -64
        );

        let mapColorId: number = 0;
        for (; mapColorId === 0 && blockYLevel >= -64; --blockYLevel) {
          const paletteEntry = this.getChunkPaletteEntry(
            chunkSections,
            chunkBlockIndex,
            blockYLevel
          );
          mapColorId = this.getMapColorId(paletteEntry);
        }
        blocks.push({
          mapColorId: mapColorId,
          yLevel: blockYLevel
        });
      }
    }
    return blocks;
  }

  /**
   * Given a paletteEntry, returns the map color id associated with this palette/block
   */
  private getMapColorId(paletteEntry: BlockPaletteEntry): number {
    const blockColor = BlockColors[paletteEntry.Name.slice(10)];
    if (!blockColor) return 0;
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
    blockYLevel: number
  ): BlockPaletteEntry {
    /**
     * Sections in a chunk are split based on y level.
     * 16 block height per section.
     * First section is y level -64 to -49, second is -48 to -33, ..., 304 to 319.
     */
    const section = chunkSections[Math.floor(blockYLevel / 16) + 4];

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
    const entryIndex =
      ((blockYLevel >= 0 ? blockYLevel : blockYLevel + 64) % 16) * 256 +
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
