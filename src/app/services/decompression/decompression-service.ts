import { Injectable } from "@angular/core";

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
    compressionFormat: CompressionFormat
  ): Promise<ArrayBuffer> {
    const decompressionStream = new DecompressionStream(compressionFormat);
    const decompressedStreamReader = new Blob([compressedData])
      .stream()
      .pipeThrough(decompressionStream)
      .getReader();

    let numBytes = 0;
    const chunks: Uint8Array<ArrayBuffer>[] = [];
    while (true) {
      const chunk = await decompressedStreamReader.read();
      if (chunk.done) {
        break;
      }
      numBytes += chunk.value.byteLength;
      chunks.push(chunk.value);
    }

    const allBytes = new Uint8Array(numBytes);
    chunks.reduce((offset, chunk) => {
      allBytes.set(chunk, offset);
      return offset + chunk.byteLength;
    }, 0);
    return allBytes.buffer;
  }

  /**
   * Based on the gzip format found at https://www.ietf.org/rfc/rfc1952.txt.
   *
   * Checks to make sure the data has an appropriate length (10 byte header + 8 byte trailer),
   * the original uncompressed data has a nonzero length (using little-endian),
   * and that the first 2 bytes match the numbers `0x1f` and `0x8b`.
   * @param compressedData The data of a gzip file as an `ArrayBuffer`.
   * @returns Whether the provided array buffer is *probably* data that was compressed with gzip.
   */
  isValidGzipData(compressedData: ArrayBuffer): boolean {
    try {
      const dataView = new DataView(compressedData);
      return (
        dataView.byteLength >= 18 &&
        dataView.getUint32(dataView.byteLength - 4, true) > 0 &&
        dataView.getUint8(0) === 0x1f &&
        dataView.getUint8(1) === 0x8b
      );
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
