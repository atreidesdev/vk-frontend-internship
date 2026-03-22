import type { Movie, Poster } from "@/types/movie";

export function getPosterUrl(poster: Poster | undefined): string | null {
  const url = poster?.url ?? poster?.previewUrl;
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return url;
}

export function getRating(movie: Movie): number | null {
  const r = movie.rating;
  if (!r) return null;
  return r.kp ?? r.imdb ?? null;
}

export function getTitle(movie: Movie): string {
  return movie.name || movie.alternativeName || `Фильм #${movie.id}`;
}

export function getYear(movie: Movie): number | null {
  return movie.year ?? null;
}

export function getGenres(movie: Movie): string[] {
  return movie.genres?.map((g) => g.name) ?? [];
}

export function getCountries(movie: Movie): string[] {
  return movie.countries?.map((c) => c.name) ?? [];
}

const TYPE_LABELS: Record<string, string> = {
  movie: "Фильм",
  "tv-series": "Сериал",
  cartoon: "Мультфильм",
  anime: "Аниме",
  "animated-series": "Анимационный сериал",
  "tv-show": "ТВ-шоу",
};

export function getTypeLabel(type: string | null | undefined): string | null {
  if (!type) return null;
  return TYPE_LABELS[type] ?? type;
}

const STATUS_LABELS: Record<string, string> = {
  filming: "Съёмки",
  "pre-production": "Подготовка",
  completed: "Завершён",
  announced: "Анонсирован",
  "post-production": "Постпродакшн",
};

export function getStatusLabel(status: string | null | undefined): string | null {
  if (!status) return null;
  return STATUS_LABELS[status] ?? status;
}

export function getDuration(movie: Movie): number | null {
  return movie.movieLength ?? null;
}

export function getPremiereDate(movie: Movie): string | null {
  const p = movie.premiere;
  if (!p) return null;
  const raw = typeof p === "string" ? p : (p.world ?? null);
  if (!raw) return null;
  return formatPremiereDate(raw);
}

export function formatPremiereDate(raw: string): string {
  const date = parsePremiereDate(raw);
  if (!date) return raw;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function parsePremiereDate(raw: string): Date | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const [, y, m, d] = iso;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const dmy = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
