import type { Movie } from "@/types/movie";
import { createEvent, createStore } from "effector";

export const openAddFavoriteModal = createEvent<Movie>();
export const openRemoveFavoriteModal = createEvent<Movie>();
export const closeModal = createEvent();

export const $activeModal = createStore<string | null>(null)
  .on(openAddFavoriteModal, () => "add-favorite")
  .on(openRemoveFavoriteModal, () => "remove-favorite")
  .on(closeModal, () => null);

export const $modalMovie = createStore<Movie | null>(null)
  .on(openAddFavoriteModal, (_, movie) => movie)
  .on(openRemoveFavoriteModal, (_, movie) => movie)
  .on(closeModal, () => null);
