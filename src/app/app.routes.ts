import { Routes } from "@angular/router";
import { MapComponent } from "./components/map/map";
import { StatsComponent } from "./components/stats/stats";
import { WorldInfoComponent } from "./components/world-info/world-info";
import { PlayerDataComponent } from "./components/player-data/player-data";

export const routes: Routes = [
  { path: "world-info", component: WorldInfoComponent },
  { path: "map", component: MapComponent },
  { path: "player-data", component: PlayerDataComponent },
  { path: "stats", component: StatsComponent },
  { path: "**", redirectTo: "world-info" }
];
