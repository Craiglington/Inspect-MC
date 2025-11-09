export type JsonValue =
  | JsonObject
  | JsonArray
  | number
  | string
  | boolean
  | null;

export interface JsonObject {
  [key: string]: JsonValue;
}

export type JsonArray = Array<JsonValue>;
