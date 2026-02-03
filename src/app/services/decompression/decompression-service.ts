import { Injectable } from "@angular/core";
import { decompress } from "lz4js";

export type CommonCompressionFormat =
  | Exclude<CompressionFormat, "deflate-raw">
  | "lz4";

@Injectable({
  providedIn: "root"
})
export class DecompressionService {
  /**
   * Decompresses data using a decompression stream.
   * @param compressedData The compressed data as an `ArrayBuffer`.
   * @param compressionFormat The compression format that was used.
   * @returns The decompressed data as an `ArrayBuffer`.
   */
  async decompressData(
    compressedData: ArrayBuffer,
    compressionFormat: CommonCompressionFormat
  ): Promise<ArrayBuffer> {
    // Handle lz4 decompression with lz4js
    if (compressionFormat === "lz4") {
      const decompressedData = decompress(new Uint8Array(compressedData));
      return decompressedData.buffer instanceof ArrayBuffer
        ? decompressedData.buffer
        : decompressedData.slice().buffer;
    }

    // Process remaining decompression with DecompressionStream
    const decompressionStream = new Blob([compressedData])
      .stream()
      .pipeThrough(new DecompressionStream(compressionFormat));

    return await new Response(decompressionStream).arrayBuffer();
  }

  /**
   * Based on the gzip data format found in section 2.2 at https://www.rfc-editor.org/rfc/rfc1952.
   *
   * @param compressedData Compressed data as an `ArrayBuffer`.
   * @returns Whether the provided array buffer is *probably* data that was compressed with gzip.
   */
  isValidGzipData(compressedData: ArrayBuffer): boolean {
    try {
      const dataView = new DataView(compressedData);
      return dataView.getUint8(0) === 0x1f && dataView.getUint8(1) === 0x8b;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Based on the zlib data format found in section 2.2 at https://www.rfc-editor.org/rfc/rfc1950.
   *
   * @param compressedData Compressed data as an `ArrayBuffer`.
   * @returns Whether the provided array buffer is *probably* data that was compressed with zlib.
   */
  isValidZlibData(compressedData: ArrayBuffer): boolean {
    try {
      const dataView = new DataView(compressedData);
      const cmf = dataView.getUint8(0);

      return (
        // CM: bits 0-3. Compression method is deflate.
        (cmf & 0x0f) === 8 &&
        // CINFO: bits 4-7. Compression info is less than or equal to a 32k window size.
        (cmf & 0xf0) >> 4 <= 7 &&
        // (CMF*256 + FLG), is a multiple of 31.
        (cmf * 256 + dataView.getUint8(1)) % 31 === 0
      );
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Based on the lz4 data format found at https://android.googlesource.com/platform/external/lz4/+/HEAD/doc/lz4_Frame_format.md.
   *
   * @param compressedData Compressed data as an `ArrayBuffer`.
   * @returns Whether the provided array buffer is *probably* data that was compressed with lz4.
   */
  isValidLz4Data(compressedData: ArrayBuffer): boolean {
    try {
      const dataView = new DataView(compressedData);
      return dataView.getUint32(0, true) === 0x184d2204;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
