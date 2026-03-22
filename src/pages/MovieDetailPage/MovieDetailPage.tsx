import { fetchMovieById } from "@/api/movies";
import { addToCompare } from "@/store/compare";
import { $favorites } from "@/store/favorites";
import { openAddFavoriteModal, openRemoveFavoriteModal } from "@/store/modal";
import shared from "@/styles/shared.module.css";
import type { Movie } from "@/types/movie";
import {
  getCountries,
  getDuration,
  getGenres,
  getPosterUrl,
  getPremiereDate,
  getRating,
  getStatusLabel,
  getTitle,
  getTypeLabel,
  getYear,
} from "@/utils/movie";
import { Panel, Placeholder, Spinner } from "@vkontakte/vkui";
import { useUnit } from "effector-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./MovieDetailPage.module.css";

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const favorites = useUnit($favorites);
  const isInFavorites = movie ? favorites.some((m) => m.id === movie.id) : false;
  const openAddModal = useUnit(openAddFavoriteModal);
  const openRemoveModal = useUnit(openRemoveFavoriteModal);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchMovieById(id).then((data) => {
      setMovie(data ?? null);
      setLoading(false);
    });
  }, [id]);

  const handleAddToCompare = () => {
    if (movie) addToCompare(movie);
  };

  if (loading) {
    return (
      <Panel id="detail">
        <div className={styles.page}>
          <div className={styles.layout}>
            <div className={styles.sidebar}>
              <div className={styles.skeletonPoster} />
              <div className={styles.infoCard}>
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLine} />
              </div>
            </div>
            <div className={styles.main}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
            <Spinner size="large" />
          </div>
        </div>
      </Panel>
    );
  }

  if (!movie) {
    return (
      <Panel id="detail">
        <div className={styles.page}>
          <Placeholder>Фильм не найден</Placeholder>
        </div>
      </Panel>
    );
  }

  const posterUrl = getPosterUrl(movie.poster);
  const rating = getRating(movie);
  const title = getTitle(movie);
  const alternativeName = movie.alternativeName || null;
  const year = getYear(movie);
  const genres = getGenres(movie);
  const countries = getCountries(movie);
  const duration = getDuration(movie);
  const premiere = getPremiereDate(movie);
  const description = movie.description || movie.shortDescription || null;
  const slogan = movie.slogan || null;
  const typeLabel = getTypeLabel(movie.type);
  const statusLabel = getStatusLabel(movie.status);
  const votesKp = movie.votes?.kp;
  const ageRating = movie.ageRating;
  const ratingMpaa = movie.ratingMpaa;
  const budget = movie.budget?.value;
  const budgetCurrency = movie.budget?.currency;
  const top250 = movie.top250;
  const top10 = movie.top10;

  const infoRows: { label: string; value: React.ReactNode }[] = [];
  if (year != null) infoRows.push({ label: "Год", value: String(year) });
  if (rating != null)
    infoRows.push({
      label: "Рейтинг",
      value: (
        <span>
          <span className={styles.ratingBadge}>{rating.toFixed(1)}</span>
          {votesKp != null && (
            <span
              style={{
                fontSize: 12,
                color: "var(--mm-text-muted)",
                marginLeft: 8,
              }}
            >
              ({votesKp >= 1000 ? `${(votesKp / 1000).toFixed(1)}K` : votesKp} голосов)
            </span>
          )}
        </span>
      ),
    });
  if (countries.length) infoRows.push({ label: "Страна", value: countries.join(", ") });
  if (duration != null) infoRows.push({ label: "Длительность", value: `${duration} мин` });
  if (premiere) infoRows.push({ label: "Премьера", value: premiere });
  if (ageRating != null) infoRows.push({ label: "Возраст", value: `${ageRating}+` });
  if (typeLabel) infoRows.push({ label: "Тип", value: typeLabel });
  if (statusLabel) infoRows.push({ label: "Статус", value: statusLabel });
  if (ratingMpaa) infoRows.push({ label: "MPAA", value: ratingMpaa.toUpperCase() });
  if (budget != null && budget > 0)
    infoRows.push({
      label: "Бюджет",
      value: `${budget.toLocaleString()} ${budgetCurrency || "$"}`,
    });
  if (top250 != null) infoRows.push({ label: "Топ 250", value: `#${top250}` });
  if (top10 != null) infoRows.push({ label: "Топ 10", value: `#${top10}` });

  return (
    <Panel id="detail">
      <div className={styles.page}>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.posterWrap}>
              {posterUrl ? (
                <img src={posterUrl} alt="" width={256} height={384} />
              ) : (
                <div className={styles.posterPlaceholder}>Нет постера</div>
              )}
            </div>
            <h1 className={`${styles.title} ${styles.titleMobile}`}>{title}</h1>
            {alternativeName && (
              <p className={`${styles.subtitle} ${styles.subtitleMobile}`}>{alternativeName}</p>
            )}
            <div className={styles.actions}>
              <button
                type="button"
                className={shared.btnPrimary}
                onClick={() =>
                  movie && (isInFavorites ? openRemoveModal(movie) : openAddModal(movie))
                }
              >
                {isInFavorites ? "Удалить из избранного" : "В избранное"}
              </button>
              <button type="button" className={shared.btnSecondary} onClick={handleAddToCompare}>
                Сравнить
              </button>
            </div>
            {infoRows.length > 0 && (
              <div className={styles.infoCard}>
                <ul className={styles.infoList}>
                  {infoRows.map((row) => (
                    <li key={row.label} className={styles.infoRow}>
                      <span className={styles.infoLabel}>{row.label}</span>
                      <span className={styles.infoValue}>{row.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
          <div className={styles.main}>
            <h1 className={`${styles.title} ${styles.titleDesktop}`}>{title}</h1>
            {alternativeName && (
              <p className={`${styles.subtitle} ${styles.subtitleDesktop}`}>{alternativeName}</p>
            )}
            {genres.length > 0 && (
              <div className={styles.genreList}>
                {genres.map((g) => (
                  <span key={g} className={styles.genreBadge}>
                    {g}
                  </span>
                ))}
              </div>
            )}
            {slogan && <p className={styles.slogan}>{slogan}</p>}
            {description && (
              <section>
                <h2 className={styles.descriptionTitle}>Описание</h2>
                <p className={styles.descriptionText}>{description}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}
