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
export interface SNBT {
  [key: string]: SNBTValue;
}
