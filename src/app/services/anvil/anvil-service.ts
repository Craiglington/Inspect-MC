import { inject, Injectable } from "@angular/core";
import { NBTService } from "../nbt/nbt-service";
import {
  CommonCompressionFormat,
  DecompressionService
} from "../decompression/decompression-service";
import { SNBT } from "../../models/snbt";

@Injectable({
  providedIn: "root"
})
export class AnvilService {
  public static readonly BLOCKS_IN_CHUNK = 16;
  public static readonly CHUNKS_IN_REGION = 32;

  private readonly decompressionService = inject(DecompressionService);
  private readonly NBTService = inject(NBTService);

  async getChunkData(
    anvilData: ArrayBuffer,
    x: number,
    z: number
  ): Promise<SNBT> {
    try {
      if (x < 0 || x > 31 || z < 0 || z > 31) {
        throw new Error(
          `Invalid argument: x: ${x}, z: ${z}. The ranges for x and z are [0,31].`
        );
      }

      const dataView = new DataView(anvilData);

      const locationOffset = 4 * ((x % 32) + (z % 32) * 32);
      const payloadOffset = (dataView.getUint32(locationOffset) >> 8) * 4096;
      const payloadSectorCount = dataView.getUint8(locationOffset + 3);

      // const timestampOffset = locationOffset + 4096;
      // const payloadTimestamp = dataView.getUint32(timestampOffset);

      /**
       * "If a chunk isn't present in the region file (e.g. because it
       * hasn't been generated or migrated yet), both fields are zero."
       */
      if (payloadOffset === 0 || payloadSectorCount === 0) {
        return {};
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

      return this.NBTService.getSNBT(decompressedData);
    } catch (error) {
      console.error(error);
      return {};
    }
  }
}
