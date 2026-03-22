import {
  createMockAdapter,
  isMockEnabled,
  setMockFallback,
  useMockFallback,
} from "@/mock/mockAdapter";
import axios, { type InternalAxiosRequestConfig } from "axios";

const isDev = import.meta.env.DEV;
const API_BASE = isDev ? "/api" : "https://api.poiskkino.dev";
const API_KEY = import.meta.env.VITE_POISKKINO_API_KEY || "";

const realApi = axios.create({
  baseURL: API_BASE,
  headers: !isDev && API_KEY ? { "X-API-KEY": API_KEY } : {},
});
const mockAdapter = isDev
  ? (createMockAdapter((config) =>
      realApi.request({ ...config, adapter: undefined })
    ) as typeof axios.defaults.adapter)
  : undefined;

export const api = axios.create({
  baseURL: API_BASE,
  headers: !isDev && API_KEY ? { "X-API-KEY": API_KEY } : {},
  params: {},
  ...(mockAdapter ? { adapter: mockAdapter } : {}),
});

if (isDev && isMockEnabled()) {
  console.info(
    "[api] Mock mode - данные из src/mock/mockData.ts (npm run dev:mock или 403 fallback)"
  );
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (mockAdapter && isMockEnabled()) {
    config.adapter = mockAdapter;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = String(error.response?.data?.message ?? "");
    const isRateLimit = status === 403 || /лимит|forbidden/i.test(message);

    if (isRateLimit && !useMockFallback()) {
      setMockFallback();
      console.warn("[api] Лимит API исчерпан - переключение на мок-данные");
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

export { useMockFallback } from "@/mock/mockAdapter";
