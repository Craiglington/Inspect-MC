import { Routes } from "@angular/router";
import { MapComponent } from "./components/map/map";
import { StatsComponent } from "./components/stats/stats";

export const routes: Routes = [
  { path: "map", component: MapComponent },
  { path: "stats", component: StatsComponent },
  { path: "**", redirectTo: "map" }
];
