import { createFeature, createReducer, on } from "@ngrx/store";
import { init, toggle } from "./theme.actions";

const themeReducer = createReducer(
  localStorage.getItem("theme") || "dark",
  on(init, (state) => state),
  on(toggle, (state) => (state === "light" ? "dark" : "light"))
);

export const themeFeature = createFeature({
  name: "theme",
  reducer: themeReducer
});
