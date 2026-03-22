export interface Genre {
  name: string;
}

export interface Country {
  name: string;
}

export interface Rating {
  kp?: number;
  imdb?: number;
  tmdb?: number;
  filmCritics?: number;
  russianFilmCritics?: number;
  await?: number;
}

export interface Votes {
  kp?: number;
  imdb?: number;
  tmdb?: number;
  filmCritics?: number;
  russianFilmCritics?: number;
  await?: number;
}

export interface Poster {
  url?: string;
  previewUrl?: string;
}

export interface Movie {
  id: number;
  name?: string;
  alternativeName?: string | null;
  year?: number;
  rating?: Rating;
  poster?: Poster;
  genres?: Genre[];
  movieLength?: number;
  description?: string | null;
  shortDescription?: string | null;
  premiere?: { world?: string } | string | null;
  type?: string | null;
  countries?: Country[];
  ageRating?: number | null;
  slogan?: string | null;
  status?: string | null;
  ratingMpaa?: string | null;
  votes?: Votes | null;
  isSeries?: boolean | null;
  releaseYears?: { start?: number; end?: number }[] | null;
  budget?: { value?: number; currency?: string } | null;
  top10?: number | null;
  top250?: number | null;
}

export interface MoviesResponse {
  docs: Movie[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}
