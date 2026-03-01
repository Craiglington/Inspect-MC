import { Injectable } from "@angular/core";

export enum LocalStorageKey {
  MAP_SETTINGS = "mapSettings",
  STATS_SETTINGS = "statsSettings",
  ADVANCEMENTS_SETTINGS = "advancementsSettings"
}

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  set<T>(key: LocalStorageKey, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }

  get<T>(key: LocalStorageKey): T | null {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? JSON.parse(value) : value;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  delete(key: LocalStorageKey): void {
    localStorage.removeItem(key);
  }
}
