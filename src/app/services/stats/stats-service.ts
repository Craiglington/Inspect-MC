import { Injectable } from "@angular/core";
import { JsonObject } from "../../models/json";

@Injectable({
  providedIn: "root"
})
export class StatsService {
  isValidStatistics(stats: JsonObject): boolean {
    return (
      typeof stats["stats"] === "object" &&
      typeof stats["DataVersion"] === "number"
    );
  }
}
