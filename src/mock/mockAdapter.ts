import type { Movie, MoviesResponse } from "@/types/movie";
/**
 * Axios-адаптер: при VITE_MOCK=true или после 403 (лимит API) подменяет ответы мок-данными.
 */
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { MOCK_GENRES, MOCK_MOVIES } from "./mockData";

const MOCK_FALLBACK_KEY = "mm_api_use_mock_fallback";

export function useMockFallback(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(MOCK_FALLBACK_KEY) === "1";
}

export function setMockFallback() {
  sessionStorage?.setItem(MOCK_FALLBACK_KEY, "1");
}

export function isMockEnabled(): boolean {
  if (typeof import.meta.env === "undefined") return false;
  if (import.meta.env.VITE_MOCK === "true") return true;
  if (import.meta.env.MODE === "mock") return true;
  return useMockFallback();
}

function mockResponse<T>(data: T, status = 200): Promise<AxiosResponse<T>> {
  return Promise.resolve({
    data,
    status,
    statusText: "OK",
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  });
}

function getPath(config: InternalAxiosRequestConfig): string {
  const base = (config.baseURL || "").replace(/\/$/, "");
  const url = (config.url || "").replace(/^\//, "");
  return base ? `${base}/${url}` : `/${url}`;
}

function getQuery(config: InternalAxiosRequestConfig): Record<string, string> {
  const params = config.params;
  if (!params || typeof params !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === "") continue;
    out[k] = Array.isArray(v) ? v.join(",") : String(v);
  }
  return out;
}

export function createMockAdapter(
  defaultAdapter: (config: InternalAxiosRequestConfig) => Promise<AxiosResponse>
): (config: InternalAxiosRequestConfig) => Promise<AxiosResponse> {
  return (config: InternalAxiosRequestConfig) => {
    if (!isMockEnabled()) return defaultAdapter(config);

    const path = getPath(config);
    const query = getQuery(config);
    const method = (config.method || "get").toLowerCase();
    if (method !== "get") return defaultAdapter(config);

    if (path.includes("/v1/movie/possible-values-by-field")) {
      const field = query.field;
      if (field === "genres.name") {
        return mockResponse(MOCK_GENRES.map((name) => ({ name, slug: name })));
      }
      return mockResponse([]);
    }

    if (path.match(/\/v1\.4\/movie$/) && !path.match(/\/v1\.4\/movie\/\d+/)) {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 50;
      const genresParam = query["genres.name"] || "";
      const yearParam = query.year || "";

      let filtered = [...MOCK_MOVIES];

      if (genresParam) {
        const genres = genresParam
          .split(",")
          .map((g) => g.replace(/^\+/, "").trim())
          .filter(Boolean);
        filtered = filtered.filter((m) =>
          genres.some((g) => m.genres?.some((mg) => mg.name.toLowerCase() === g.toLowerCase()))
        );
      }

      if (yearParam) {
        const [min, max] = yearParam.includes("-")
          ? yearParam.split("-").map(Number)
          : [Number(yearParam), Number(yearParam)];
        filtered = filtered.filter((m) => m.year != null && m.year >= min && m.year <= max);
      }

      const start = (page - 1) * limit;
      const docs = filtered.slice(start, start + limit);
      const total = filtered.length;

      return mockResponse<MoviesResponse>({
        docs,
        total,
        limit,
        page,
        pages: Math.ceil(total / limit),
      });
    }

    const idMatch = path.match(/\/v1\.4\/movie\/(\d+)$/);
    if (idMatch) {
      const id = Number(idMatch[1]);
      const movie = MOCK_MOVIES.find((m) => m.id === id);
      const fallback: Movie = movie ?? { ...MOCK_MOVIES[0], id };
      return mockResponse<Movie>(fallback);
    }

    return defaultAdapter(config);
  };
}
