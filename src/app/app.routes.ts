import { Routes } from "@angular/router";
import { AdvancementsComponent } from "./components/routes/advancements/advancements";
import { MapComponent } from "./components/routes/map/map";
import { PlayerDataComponent } from "./components/routes/player-data/player-data";
import { StatsComponent } from "./components/routes/stats/stats";
import { WorldInfoComponent } from "./components/routes/world-info/world-info";
import { ChangeLogComponent } from "./components/routes/changelog/changelog";

export enum ROUTE_PATHS {
  WORLD_INFO = "/world-info",
  MAP = "/map",
  PLAYER_DATA = "/player-data",
  STATS = "/stats",
  ADVANCEMENTS = "/advancements",
  CHANGELOG = "/changelog"
}

export const routes: Routes = [
  { path: ROUTE_PATHS.WORLD_INFO.slice(1), component: WorldInfoComponent },
  { path: ROUTE_PATHS.MAP.slice(1), component: MapComponent },
  { path: ROUTE_PATHS.PLAYER_DATA.slice(1), component: PlayerDataComponent },
  { path: ROUTE_PATHS.STATS.slice(1), component: StatsComponent },
  { path: ROUTE_PATHS.ADVANCEMENTS.slice(1), component: AdvancementsComponent },
  { path: ROUTE_PATHS.CHANGELOG.slice(1), component: ChangeLogComponent },
  { path: "**", redirectTo: ROUTE_PATHS.WORLD_INFO.slice(1) }
];
