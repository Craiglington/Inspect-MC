export enum NBT_TAG {
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
 * A value with a size in bytes.
 */
export interface NBTPayload<T> {
  size: number;
  value: T;
}
