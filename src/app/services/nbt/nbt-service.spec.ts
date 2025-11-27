import { TestBed } from "@angular/core/testing";

import { NBTService } from "./nbt-service";
import { DecompressionService } from "../decompression/decompression-service";
import { NBT_TAG } from "../../models/nbt";

describe("NBTService", () => {
  let service: NBTService;
  let mockDecompressionService: jasmine.SpyObj<DecompressionService>;
  let mockDecompressedData: ArrayBuffer;
  let mockDecompressedDataView: DataView;

  beforeEach(() => {
    mockDecompressedData = new ArrayBuffer(4);
    mockDecompressedDataView = new DataView(mockDecompressedData);
    mockDecompressedDataView.setUint32(0, 1024);

    mockDecompressionService = jasmine.createSpyObj("DecompressionService", [
      "isValidGzipData",
      "decompressData"
    ]);
    mockDecompressionService.decompressData.and.returnValue(
      Promise.resolve(mockDecompressedData)
    );

    TestBed.configureTestingModule({});
    service = TestBed.inject(NBTService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("isValidNBTData", () => {
    it("should return true if data is valid", () => {
      const buffer = new ArrayBuffer(5);
      const dataView = new DataView(buffer);
      dataView.setUint8(0, NBT_TAG.COMPOUND);
      dataView.setUint16(1, 0);
      dataView.setUint8(4, NBT_TAG.END);
      expect(service.isValidNBTData(dataView.buffer)).toBeTrue();
    });

    it("should return false if NBT data does not begin with a nameless compound tag", () => {
      const buffer = new ArrayBuffer(5);
      const dataView = new DataView(buffer);
      dataView.setUint8(0, NBT_TAG.INT);
      dataView.setUint16(1, 0);
      dataView.setUint8(4, NBT_TAG.END);
      expect(service.isValidNBTData(dataView.buffer)).toBeFalse();

      dataView.setUint8(0, NBT_TAG.COMPOUND);
      dataView.setUint16(1, 1);
      expect(service.isValidNBTData(dataView.buffer)).toBeFalse();
    });

    it("should return false if NBT data does not end with an end tag", () => {
      const buffer = new ArrayBuffer(5);
      const dataView = new DataView(buffer);
      dataView.setUint8(0, NBT_TAG.COMPOUND);
      dataView.setUint16(1, 0);
      dataView.setUint8(4, NBT_TAG.INT);
      expect(service.isValidNBTData(dataView.buffer)).toBeFalse();
    });
  });

  describe("getNBTData", () => {
    it("should resolve with decompressed data when compressed", async () => {
      mockDecompressionService.isValidGzipData.and.returnValue(true);
      spyOn(service, "isValidNBTData").and.returnValue(true);
    });
  });
});
