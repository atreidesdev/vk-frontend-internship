import type { Movie } from "@/types/movie";
import { createEvent, createStore } from "effector";

export const setMovies = createEvent<{ list: Movie[]; total: number; reset: boolean }>();
export const setMoviesLoading = createEvent<boolean>();
export const setMoviesError = createEvent<string | null>();

export const $moviesList = createStore<Movie[]>([]).on(setMovies, (prev, { list, reset }) =>
  reset ? list : [...prev, ...list]
);

export const $moviesTotal = createStore(0).on(setMovies, (_, { total }) => total);

export const $moviesLoading = createStore(false).on(setMoviesLoading, (_, v) => v);

export const $moviesError = createStore<string | null>(null).on(setMoviesError, (_, v) => v);
