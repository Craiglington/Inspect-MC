import { JsonObject } from "./json";

export interface Advancements extends JsonObject {
  [key: string]: {
    criteria?: {
      [key: string]: string;
    };
    done?: boolean;
  };
}
