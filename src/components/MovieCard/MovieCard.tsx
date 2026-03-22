import type { CardViewMode } from "@/store/cardView";
import { $favorites } from "@/store/favorites";
import shared from "@/styles/shared.module.css";
import type { Movie } from "@/types/movie";
import { getPosterUrl, getRating, getTitle, getYear } from "@/utils/movie";
import { Spacing, Text, Title } from "@vkontakte/vkui";
import { useUnit } from "effector-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MovieCard.module.css";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  variant?: CardViewMode;
  onAddToFavorites?: (movie: Movie) => void;
  onAddToCompare?: (movie: Movie) => void;
  onRemoveFromFavorites?: (movie: Movie) => void;
}

function ActionButtons({
  movie,
  isInFavorites,
  onAddToFavorites,
  onAddToCompare,
  onRemoveFromFavorites,
}: Pick<
  MovieCardProps,
  "movie" | "onAddToFavorites" | "onAddToCompare" | "onRemoveFromFavorites"
> & {
  isInFavorites: boolean;
}) {
  const showAdd = !isInFavorites && !!onAddToFavorites;
  const showRemove = isInFavorites && !!onRemoveFromFavorites;

  return (
    <div className={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
      {showAdd && (
        <button
          type="button"
          className={styles.actionBtn}
          onClick={(e) => {
            e.stopPropagation();
            onAddToFavorites(movie);
          }}
          aria-label="В избранное"
          title="В избранное"
        >
          ♥
        </button>
      )}
      {showRemove && (
        <button
          type="button"
          className={styles.actionBtn}
          onClick={(e) => {
            e.stopPropagation();
            onRemoveFromFavorites(movie);
          }}
          aria-label="Удалить из избранного"
          title="Удалить из избранного"
        >
          ✕
        </button>
      )}
      {onAddToCompare && (
        <button
          type="button"
          className={styles.actionBtn}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCompare(movie);
          }}
          aria-label="Сравнить"
          title="Сравнить"
        >
          ⇔
        </button>
      )}
    </div>
  );
}

const MAX_TILT = 6;
const PERSPECTIVE = 800;

export function MovieCard({
  movie,
  variant = "horizontal",
  onAddToFavorites,
  onAddToCompare,
  onRemoveFromFavorites,
}: MovieCardProps) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const favorites = useUnit($favorites);
  const isInFavorites = favorites.some((m) => m.id === movie.id);
  const posterUrl = getPosterUrl(movie.poster);
  const rating = getRating(movie);
  const title = getTitle(movie);
  const year = getYear(movie);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -y * MAX_TILT,
      rotateY: x * MAX_TILT,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const tiltStyle = {
    rotateX: tilt.rotateX,
    rotateY: tilt.rotateY,
    transformPerspective: PERSPECTIVE,
  };

  if (variant === "poster") {
    return (
      <motion.div
        ref={cardRef}
        className={`${styles.card} ${styles.cardPoster}`}
        style={tiltStyle}
        onClick={() => navigate(`/movie/${movie.id}`)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        transition={{ type: "spring", stiffness: 220, damping: 24, mass: 0.6 }}
      >
        <div className={styles.posterVariantContent}>
          <div className={styles.posterVariantPosterWrap}>
            <div
              role="button"
              tabIndex={0}
              className={`${shared.posterRatio} ${styles.posterVariantPoster}`}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/movie/${movie.id}`)}
            >
              {posterUrl ? (
                <img src={posterUrl} alt="" />
              ) : (
                <div className={styles.posterPlaceholder}>Нет постера</div>
              )}
              {rating != null && <span className={styles.ratingBadge}>{rating.toFixed(1)}</span>}
              <ActionButtons
                movie={movie}
                isInFavorites={isInFavorites}
                onAddToFavorites={onAddToFavorites}
                onAddToCompare={onAddToCompare}
                onRemoveFromFavorites={onRemoveFromFavorites}
              />
            </div>
          </div>
          <div
            className={styles.posterVariantTitle}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movie/${movie.id}`);
            }}
          >
            <span className={styles.posterVariantTitleText} title={title}>
              {title}
            </span>
            {year != null && <span className={styles.posterVariantYear}>{year}</span>}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.horizontalContent}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/movie/${movie.id}`)}
          onKeyDown={(e) => e.key === "Enter" && navigate(`/movie/${movie.id}`)}
          className={shared.posterRatio}
          style={{
            width: 80,
            flexShrink: 0,
            backgroundColor: "var(--mm-card-bg)",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {posterUrl ? (
            <img src={posterUrl} alt="" width={80} height={120} />
          ) : (
            <div className={styles.posterPlaceholderSmall}>Нет постера</div>
          )}
        </div>
        <div className={styles.horizontalText} onClick={() => navigate(`/movie/${movie.id}`)}>
          <Title level="2" style={{ marginBottom: 4, cursor: "pointer" }}>
            {title}
          </Title>
          {year != null && <Text style={{ color: "var(--mm-text-muted)" }}>{year}</Text>}
          <Spacing size={8} />
          {rating != null && <Text weight="2">Рейтинг: {rating.toFixed(1)}</Text>}
        </div>
        <ActionButtons
          movie={movie}
          isInFavorites={isInFavorites}
          onAddToFavorites={onAddToFavorites}
          onAddToCompare={onAddToCompare}
          onRemoveFromFavorites={onRemoveFromFavorites}
        />
      </div>
    </div>
  );
}
