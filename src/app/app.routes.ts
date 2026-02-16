import { Routes } from "@angular/router";
import { AdvancementsComponent } from "./components/routes/advancements/advancements";
import { MapComponent } from "./components/routes/map/map";
import { PlayerDataComponent } from "./components/routes/player-data/player-data";
import { StatsComponent } from "./components/routes/stats/stats";
import { WorldInfoComponent } from "./components/routes/world-info/world-info";

export const routes: Routes = [
  { path: "world-info", component: WorldInfoComponent },
  { path: "map", component: MapComponent },
  { path: "player-data", component: PlayerDataComponent },
  { path: "stats", component: StatsComponent },
  { path: "advancements", component: AdvancementsComponent },
  { path: "**", redirectTo: "world-info" }
];
