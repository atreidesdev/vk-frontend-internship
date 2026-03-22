import type { Movie, MoviesResponse } from "@/types/movie";
import { api } from "./client";

export interface MoviesQueryParams {
  page?: number;
  limit?: number;
  year?: string | number;
  "rating.kp"?: string;
  "genres.name"?: string | string[];
}

export async function fetchMovies(params: MoviesQueryParams): Promise<MoviesResponse> {
  const { data } = await api.get<MoviesResponse>("/v1.4/movie", { params });
  return data;
}

export async function fetchMovieById(id: string | undefined): Promise<Movie | null> {
  if (id == null || id === "" || id === "null" || id === "undefined") return null;
  try {
    const { data } = await api.get<Movie>(`/v1.4/movie/${id}`);
    return data;
  } catch {
    return null;
  }
}
