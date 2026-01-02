import { Routes } from "@angular/router";
import { MapComponent } from "./components/map/map";
import { StatsComponent } from "./components/stats/stats";
import { WorldInfoComponent } from "./components/world-info/world-info";

export const routes: Routes = [
  { path: "world-info", component: WorldInfoComponent },
  { path: "map", component: MapComponent },
  { path: "stats", component: StatsComponent },
  { path: "**", redirectTo: "world-info" }
];
