import { Routes } from "@angular/router";
import { MapComponent } from "./components/map/map";
import { StatsComponent } from "./components/stats/stats";
import { Advancements } from "./components/advancements/advancements";

export const routes: Routes = [
  { path: "map", component: MapComponent },
  { path: "stats", component: StatsComponent },
  { path: "advancements", component: Advancements },
  { path: "**", redirectTo: "map" }
];
