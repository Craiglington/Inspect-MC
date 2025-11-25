import { Routes } from "@angular/router";
import { Map } from "./components/map/map";
import { Stats } from "./components/stats/stats";

export const routes: Routes = [
  { path: "map", component: Map },
  { path: "stats", component: Stats },
  { path: "**", redirectTo: "map" }
];
