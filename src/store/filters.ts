import { createEvent, createStore } from "effector";

export const setFilters = createEvent<Partial<FilterState>>();

export interface FilterState {
  genres: string[];
  genresStrict: boolean;
  ratingMin: number;
  ratingMax: number;
  yearMin: number;
  yearMax: number;
}

const defaultFilters: FilterState = {
  genres: [],
  genresStrict: false,
  ratingMin: 0,
  ratingMax: 10,
  yearMin: 1990,
  yearMax: new Date().getFullYear(),
};

export const $filters = createStore<FilterState>(defaultFilters).on(setFilters, (state, patch) => ({
  ...state,
  ...patch,
}));

export function parseFiltersFromSearchParams(params: URLSearchParams): FilterState {
  const genresParam = params.get("genres");
  const genres = genresParam ? genresParam.split(",").filter(Boolean) : [];
  const genresStrict = params.get("genresStrict") === "1" || params.get("genresStrict") === "true";
  const ratingMin = Math.max(0, Math.min(10, Number(params.get("ratingMin")) || 0));
  const ratingMax = Math.max(0, Math.min(10, Number(params.get("ratingMax")) || 10));
  const yearMin = Math.max(1990, Math.min(2100, Number(params.get("yearMin")) || 1990));
  const yearMax = Math.max(
    1990,
    Math.min(2100, Number(params.get("yearMax")) || new Date().getFullYear())
  );
  return {
    genres,
    genresStrict,
    ratingMin: Math.min(ratingMin, ratingMax),
    ratingMax: Math.max(ratingMin, ratingMax),
    yearMin: Math.min(yearMin, yearMax),
    yearMax: Math.max(yearMin, yearMax),
  };
}

export function filtersToSearchParams(f: FilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (f.genres.length) p.set("genres", f.genres.join(","));
  if (f.genresStrict) p.set("genresStrict", "1");
  if (f.ratingMin > 0) p.set("ratingMin", String(f.ratingMin));
  if (f.ratingMax < 10) p.set("ratingMax", String(f.ratingMax));
  if (f.yearMin > 1990) p.set("yearMin", String(f.yearMin));
  if (f.yearMax < new Date().getFullYear()) p.set("yearMax", String(f.yearMax));
  return p;
}

export function filtersToApiParams(
  f: FilterState,
  page = 1
): Record<string, string | number | string[]> {
  const params: Record<string, string | number | string[]> = {
    limit: 50,
    page,
  };
  if (f.yearMin === f.yearMax) {
    params.year = f.yearMin;
  } else {
    params.year = `${f.yearMin}-${f.yearMax}`;
  }
  if (f.ratingMin > 0 || f.ratingMax < 10) {
    params["rating.kp"] = `${f.ratingMin}-${f.ratingMax}`;
  }
  if (f.genres.length)
    params["genres.name"] = f.genresStrict ? f.genres.map((g) => `+${g}`) : f.genres;
  return params;
}
