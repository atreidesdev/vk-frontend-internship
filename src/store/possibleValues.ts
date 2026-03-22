import { fetchPossibleValues } from "@/api/possibleValues";
import { createEffect, createStore } from "effector";

const GENRES_CACHE_KEY = "movie-matcher-genres";
const GENRES_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function loadGenresFromCache(): string[] {
  try {
    const raw = localStorage.getItem(GENRES_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.data)) {
      if (typeof parsed.ts === "number" && Date.now() - parsed.ts > GENRES_CACHE_TTL_MS) {
        return [];
      }
      return parsed.data;
    }
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function saveGenresToCache(genres: string[]) {
  if (genres.length === 0) return;
  try {
    localStorage.setItem(GENRES_CACHE_KEY, JSON.stringify({ data: genres, ts: Date.now() }));
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn("[possibleValues] Ошибка сохранения кэша жанров:", e);
    }
  }
}

export const loadGenres = createEffect(async () => {
  const cached = loadGenresFromCache();
  if (cached.length > 0) return cached;

  const data = await fetchPossibleValues("genres.name");
  const genres = data
    .map((item) => item.name)
    .filter((name): name is string => typeof name === "string" && name.length > 0)
    .sort((a, b) => a.localeCompare(b));

  saveGenresToCache(genres);
  return genres;
});

export const $genres = createStore<string[]>(loadGenresFromCache()).on(
  loadGenres.doneData,
  (_, genres) => genres
);

export const $genresLoading = createStore(false).on(loadGenres.pending, (_, pending) => pending);

export const $genresError = createStore<string | null>(null)
  .on(loadGenres.failData, (_, err) =>
    err.message
  )
  .on(loadGenres, () => null);
