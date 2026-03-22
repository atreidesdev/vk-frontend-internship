import type { Movie } from "@/types/movie";
import { createEvent, createStore } from "effector";

const MAX_COMPARE = 2;

export const addToCompare = createEvent<Movie>();
export const removeFromCompare = createEvent<number>();
export const clearCompare = createEvent();

export const $compareList = createStore<Movie[]>([])
  .on(addToCompare, (list, movie) => {
    if (list.some((m) => m.id === movie.id)) return list;
    const next = [...list, movie];
    if (next.length > MAX_COMPARE) return [next[1], next[2]];
    return next;
  })
  .on(removeFromCompare, (list, id) => list.filter((m) => m.id !== id))
  .on(clearCompare, () => []);
