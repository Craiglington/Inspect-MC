import { Injectable } from "@angular/core";
import { DecompressionService } from "../decompression/decompression-service";

enum NBT_TAG {
  END = 0x00,
  BYTE = 0x01,
  SHORT = 0x02,
  INT = 0x03,
  LONG = 0x04,
  FLOAT = 0x05,
  DOUBLE = 0x06,
  BYTE_ARRAY = 0x07,
  STRING = 0x08,
  LIST = 0x09,
  COMPOUND = 0x0a,
  INT_ARRAY = 0x0b,
  LONG_ARRAY = 0x0c
}

/**
 * An infinitely nestable value.
 */
export type SNBTValue =
  | string
  | number
  | number[]
  | bigint
  | bigint[]
  | SNBT
  | SNBTValue[];

/**
 * A key-value object.
 */
export type SNBT = {
  [key: string]: SNBTValue;
};

/**
 * A value with a size in bytes.
 */
type Payload<T> = {
  size: number;
  value: T;
};

@Injectable({
  providedIn: "root"
})
export class NBTService {
  // 1 byte for root tag id and 2 bytes for root tag name length (the length will be 0)
  private static readonly NBT_FILE_OFFSET = 3;

  constructor(private readonly decompressionService: DecompressionService) {}

  /**
   * Takes an NBT file (https://minecraft.wiki/w/NBT_format) and returns an `ArrayBuffer` of the data within.
   * @param file An NBT file.
   * @returns A Promise that resolves with an `ArrayBuffer` of the file's data.
   */
  getNBTData(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          if (!fileReader.result || typeof fileReader.result === "string") {
            throw new Error(
              "File reader error: Result is not an array buffer."
            );
          }

          const decompressedData = this.decompressionService.isValidGzipData(
            fileReader.result
          )
            ? await this.decompressionService.decompressData(
                fileReader.result,
                "gzip"
              )
            : fileReader.result;

          if (!this.isValidNBTData(decompressedData)) {
            throw new Error(
              "Invalid NBT file format: Data does not begin and end with a root tag."
            );
          }

          resolve(decompressedData);
        } catch (error) {
          console.error(error);
          reject(error);
        }
      };
      fileReader.onerror = (event) => {
        console.error(event);
        reject(event.target?.error);
      };
      fileReader.readAsArrayBuffer(file);
    });
  }

  /**
   * Based on the NBT format found at https://minecraft.wiki/w/NBT_format#Binary_format.
   *
   * Checks to make sure data is enclosed with an unnamed root tag.
   * @param data The data of a decompressed NBT file.
   * @returns Whether the provided array buffer is *probably* the data of an NBT file.
   */
  isValidNBTData(decompressedData: ArrayBuffer): boolean {
    try {
      const dataView = new DataView(decompressedData);
      return (
        dataView.getUint8(0) === 0x0a &&
        dataView.getUint16(1) === 0 &&
        dataView.getUint8(dataView.byteLength - 1) === 0
      );
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Converts the data of a file in NBT format to SNBT/JSON.
   * @param nbtData The data of an NBT file as an `ArrayBuffer`.
   * @returns The SNBT/JSON object.
   */
  getSNBT(nbtData: ArrayBuffer): SNBT {
    try {
      if (!this.isValidNBTData(nbtData)) {
        throw new Error(
          "Invalid NBT data: data does not begin and end with a root tag."
        );
      }

      return this.parseNbtTags(
        new DataView(nbtData),
        NBTService.NBT_FILE_OFFSET
      ).value;
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  /**
   * Iteratively parses the tags inside a compound tag and constructs a JS object.
   *
   * In other words, parses the properties of an NBT object.
   * @returns The SNBT object and its size in bytes in the NBT data.
   */
  private parseNbtTags(nbtData: DataView, offset: number): Payload<SNBT> {
    const originalOffset = offset;
    const snbt: SNBT = {};
    while (offset < nbtData.byteLength) {
      const tagId = nbtData.getUint8(offset);
      offset += 1;

      if (tagId === NBT_TAG.END) break;

      const tagName = this.parseNbtTagName(nbtData, offset);
      offset += tagName.size;

      const tagPayload = this.parseNbtTagPayload(nbtData, offset, tagId);
      offset += tagPayload.size;
      snbt[tagName.value] = tagPayload.value;
    }

    return { size: offset - originalOffset, value: snbt };
  }

  /**
   * Parses the current NBT tag's name.
   * @returns The NBT tag's name and its size in bytes.
   */
  private parseNbtTagName(nbtData: DataView, offset: number): Payload<string> {
    const nameLength = nbtData.getUint16(offset);
    offset += 2;

    const characters: number[] = [];
    for (let i = 0; i < nameLength; ++i) {
      characters.push(nbtData.getUint8(offset + i));
    }
    const name = String.fromCodePoint(...characters);
    return {
      size: 2 + name.length,
      value: name
    };
  }

  /**
   * Parses the current NBT tag's payload given the tag's id.
   * @returns The NBT tag's payload and its size in bytes.
   */
  private parseNbtTagPayload(
    nbtData: DataView,
    offset: number,
    id: NBT_TAG
  ): Payload<SNBTValue> {
    if (id === NBT_TAG.BYTE) {
      return { size: 1, value: nbtData.getInt8(offset) };
    }

    if (id === NBT_TAG.SHORT) {
      return { size: 2, value: nbtData.getInt16(offset) };
    }

    if (id === NBT_TAG.INT) {
      return { size: 4, value: nbtData.getInt32(offset) };
    }

    if (id === NBT_TAG.LONG) {
      return { size: 8, value: nbtData.getBigInt64(offset) };
    }

    if (id === NBT_TAG.FLOAT) {
      return { size: 4, value: nbtData.getFloat32(offset) };
    }

    if (id === NBT_TAG.DOUBLE) {
      return { size: 8, value: nbtData.getFloat64(offset) };
    }

    if (id === NBT_TAG.BYTE_ARRAY) {
      return this.parseNbtByteArray(nbtData, offset);
    }

    if (id === NBT_TAG.STRING) {
      return this.parseNbtString(nbtData, offset);
    }

    if (id === NBT_TAG.LIST) {
      return this.parseNbtTagList(nbtData, offset);
    }

    if (id === NBT_TAG.COMPOUND) {
      return this.parseNbtTags(nbtData, offset);
    }

    if (id === NBT_TAG.INT_ARRAY) {
      return this.parseNbtIntArray(nbtData, offset);
    }

    if (id === NBT_TAG.LONG_ARRAY) {
      return this.parseNbtLongArray(nbtData, offset);
    }

    throw new Error(`Invalid NBT tag id: ${id}.`);
  }

  private parseNbtByteArray(
    nbtData: DataView,
    offset: number
  ): Payload<number[]> {
    const size = nbtData.getInt32(offset);
    offset += 4;

    const list: number[] = [];
    for (let i = 0; i < size; ++i) {
      list.push(nbtData.getInt8(offset + i));
    }
    return { size: 4 + list.length, value: list };
  }

  private parseNbtString(nbtData: DataView, offset: number): Payload<string> {
    const size = nbtData.getUint16(offset);
    offset += 2;

    const string: number[] = [];
    for (let i = 0; i < size; ++i) {
      string.push(nbtData.getInt8(offset + i));
    }
    return { size: 2 + string.length, value: String.fromCodePoint(...string) };
  }

  private parseNbtTagList(
    nbtData: DataView,
    offset: number
  ): Payload<SNBTValue[]> {
    const originalOffset = offset;

    const tagsId = nbtData.getUint8(offset);
    offset += 1;

    const listLength = nbtData.getUint32(offset);
    offset += 4;

    if (listLength === 0 || tagsId === NBT_TAG.END) {
      return { size: offset - originalOffset, value: [] };
    }

    const tagList: SNBTValue[] = [];
    for (let i = 0; i < listLength; ++i) {
      const tagPayload = this.parseNbtTagPayload(nbtData, offset, tagsId);
      offset += tagPayload.size;
      tagList.push(tagPayload.value);
    }

    return { size: offset - originalOffset, value: tagList };
  }

  private parseNbtIntArray(
    nbtData: DataView,
    offset: number
  ): Payload<number[]> {
    const size = nbtData.getInt32(offset);
    offset += 4;

    const list: number[] = [];
    for (let i = 0; i < size; ++i) {
      list.push(nbtData.getInt32(offset + i * 4));
    }
    return { size: 4 + list.length * 4, value: list };
  }

  private parseNbtLongArray(
    nbtData: DataView,
    offset: number
  ): Payload<bigint[]> {
    const size = nbtData.getInt32(offset);
    offset += 4;

    const list: bigint[] = [];
    for (let i = 0; i < size; ++i) {
      list.push(nbtData.getBigInt64(offset + i * 8));
    }
    return { size: 4 + list.length * 8, value: list };
  }
}
