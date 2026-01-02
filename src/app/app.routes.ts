import { Routes } from "@angular/router";
import { MapComponent } from "./components/map/map";
import { StatsComponent } from "./components/stats/stats";
import { WorldComponent } from "./components/world/world";

export const routes: Routes = [
  { path: "world-info", component: WorldComponent },
  { path: "map", component: MapComponent },
  { path: "stats", component: StatsComponent },
  { path: "**", redirectTo: "world-info" }
];
