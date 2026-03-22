import type { Movie } from "@/types/movie";
import { createEvent, createStore } from "effector";

const STORAGE_KEY = "movies-favorites";

function loadFavorites(): Movie[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Movie[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavorites(movies: Movie[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  } catch {}
}

export const addFavorite = createEvent<Movie>();
export const removeFavorite = createEvent<number>();
export const setFavorites = createEvent<Movie[]>();

export const $favorites = createStore<Movie[]>(loadFavorites())
  .on(addFavorite, (list, movie) => {
    if (list.some((m) => m.id === movie.id)) return list;
    const next = [...list, movie];
    saveFavorites(next);
    return next;
  })
  .on(removeFavorite, (list, id) => {
    const next = list.filter((m) => m.id !== id);
    saveFavorites(next);
    return next;
  })
  .on(setFavorites, (_, list) => {
    saveFavorites(list);
    return list;
  });

export function isFavorite(id: number): boolean {
  return loadFavorites().some((m) => m.id === id);
}
