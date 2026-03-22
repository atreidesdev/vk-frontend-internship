import { createEvent, createStore } from "effector";

export type CardViewMode = "horizontal" | "poster";

export const setCardViewMode = createEvent<CardViewMode>();

export const $cardViewMode = createStore<CardViewMode>("horizontal").on(
  setCardViewMode,
  (_, mode) => mode
);
