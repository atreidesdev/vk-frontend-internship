import {
  readFileSync,
  writeFileSync
} from 'fs'
import {
  dirname,
  join,
  resolve
} from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  const envPath = resolve(root, ".env");
  try {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([^#=]+)=(.*)$/);
      if (m) {
        const key = m[1].trim();
        process.env[key] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    }
  } catch (e) {
    console.warn("Не удалось загрузить .env из", envPath, "-", e.message);
  }
}

loadEnv();

const API_KEY = process.env.VITE_POISKKINO_API_KEY;
if (!API_KEY) {
  console.error("VITE_POISKKINO_API_KEY не задан в .env");
  process.exit(1);
}

const BASE = "https://api.poiskkino.dev";
const LIMIT = 50;
const PAGES = 5;

async function fetchPage(page) {
  const url = `${BASE}/v1.4/movie?limit=${LIMIT}&page=${page}`;
  const res = await fetch(url, {
    headers: { "X-API-KEY": API_KEY },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${url}`);
  }
  return res.json();
}

async function main() {
  const allDocs = [];
  for (let page = 1; page <= PAGES; page++) {
    console.log(`Запрос страницы ${page}/${PAGES}...`);
    const data = await fetchPage(page);
    allDocs.push(...(data.docs || []));
  }
  console.log(`Получено ${allDocs.length} фильмов`);

  const MOVIE_KEYS = new Set([
    "id",
    "name",
    "alternativeName",
    "year",
    "rating",
    "poster",
    "genres",
    "movieLength",
    "description",
    "shortDescription",
    "premiere",
    "type",
    "countries",
    "ageRating",
    "slogan",
    "status",
    "ratingMpaa",
    "votes",
    "isSeries",
    "releaseYears",
    "budget",
    "top10",
    "top250",
  ]);

  function pickMovie(doc) {
    const m = {};
    for (const k of Object.keys(doc)) {
      if (MOVIE_KEYS.has(k)) m[k] = doc[k];
    }
    return m;
  }

  const filtered = allDocs.map(pickMovie);

  const out = `import type { Movie } from "@/types/movie";

export const MOCK_MOVIES: Movie[] = ${JSON.stringify(filtered, null, 2).replace(/"([^"]+)":/g, "$1:")};

export const MOCK_GENRES = [
  "аниме", "биография", "боевик", "драма", "комедия", "криминал",
  "мелодрама", "мультфильм", "фантастика", "ужасы", "триллер",
];
`;

  const targetPath = join(root, "src", "mock", "mockData.ts");
  writeFileSync(targetPath, out, "utf-8");
  console.log(`Записано в ${targetPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
