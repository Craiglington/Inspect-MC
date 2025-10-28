import { TestBed } from "@angular/core/testing";

import { DecompressionService } from "./decompression-service";

describe("DecompressionService", () => {
  let service: DecompressionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecompressionService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("decompressData", () => {
    it("should decompress gzip data", async () => {
      // Create initial data view
      const initialDataView = new DataView(new ArrayBuffer(10));
      for (let i = 0; i < initialDataView.byteLength; ++i) {
        initialDataView.setUint8(i, i);
      }

      // Compress initial data
      const compressionStream = new CompressionStream("gzip");
      const compressedStreamReader = new Blob([initialDataView.buffer])
        .stream()
        .pipeThrough(compressionStream)
        .getReader();

      let numCompressedBytes = 0;
      const chunks: Uint8Array<ArrayBuffer>[] = [];
      while (true) {
        const chunk = await compressedStreamReader.read();
        if (chunk.done) {
          break;
        }
        numCompressedBytes += chunk.value.byteLength;
        chunks.push(chunk.value);
      }
      const compressedBytes = new Uint8Array(numCompressedBytes);
      chunks.reduce((offset, chunk) => {
        compressedBytes.set(chunk, offset);
        return offset + chunk.byteLength;
      }, 0);

      // Now decompress compressed data
      const decompressedBytes = await service.decompressData(
        compressedBytes.buffer,
        "gzip"
      );
      const finalDataView = new DataView(decompressedBytes);

      expect(finalDataView.byteLength).toBe(initialDataView.byteLength);
      for (let i = 0; i < finalDataView.byteLength; ++i) {
        expect(finalDataView.getUint8(i)).toBe(initialDataView.getUint8(i));
      }
    });
  });

  describe("isValidGzipData", () => {
    it("should detect valid gzip data", () => {
      const length = 20;
      const buffer = new ArrayBuffer(length);
      const dataView = new DataView(buffer);
      dataView.setUint8(0, 0x1f);
      dataView.setUint8(1, 0x8b);
      dataView.setUint32(length - 4, 2);
      expect(service.isValidGzipData(dataView.buffer)).toBeTrue();
    });

    it("should return false if buffer length is equal to 18", () => {
      const length = 18;
      const buffer = new ArrayBuffer(length);
      const dataView = new DataView(buffer);
      dataView.setUint8(0, 0x1f);
      dataView.setUint8(1, 0x8b);
      dataView.setUint32(length - 4, 2);
      expect(service.isValidGzipData(dataView.buffer)).toBeFalse();
    });

    it("should return false if buffer length is less than 18", () => {
      const length = 17;
      const buffer = new ArrayBuffer(length);
      const dataView = new DataView(buffer);
      dataView.setUint8(0, 0x1f);
      dataView.setUint8(1, 0x8b);
      dataView.setUint32(length - 4, 2);
      expect(service.isValidGzipData(dataView.buffer)).toBeFalse();
    });

    it("should return false if original data length is zero", () => {
      const length = 20;
      const buffer = new ArrayBuffer(length);
      const dataView = new DataView(buffer);
      dataView.setUint8(0, 0x1f);
      dataView.setUint8(1, 0x8b);
      dataView.setUint32(length - 4, 0);
      expect(service.isValidGzipData(dataView.buffer)).toBeFalse();
    });

    it("should return false if first 2 bytes do not match gzip signature", () => {
      const length = 20;
      const buffer = new ArrayBuffer(length);
      const dataView = new DataView(buffer);
      dataView.setUint8(0, 0x1a);
      dataView.setUint8(1, 0x8b);
      dataView.setUint32(length - 4, 2);
      expect(service.isValidGzipData(dataView.buffer)).toBeFalse();

      dataView.setUint8(0, 0x1f);
      dataView.setUint8(1, 0x9b);
      expect(service.isValidGzipData(dataView.buffer)).toBeFalse();

      dataView.setUint8(1, 0x8b);
      expect(service.isValidGzipData(dataView.buffer)).toBeTrue();
    });
  });
});
