import type { CardViewMode } from "@/store/cardView";
import styles from "./MovieCardSkeleton.module.css";

interface MovieCardSkeletonProps {
  variant?: CardViewMode;
}

export function MovieCardSkeleton({ variant = "horizontal" }: MovieCardSkeletonProps) {
  if (variant === "poster") {
    return (
      <div className={`${styles.card} ${styles.skeleton} ${styles.cardPoster}`}>
        <div className={styles.posterVariant}>
          <div className={styles.posterVariantPoster} />
          <div className={styles.posterVariantTitle} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${styles.skeleton}`}>
      <div className={styles.inner}>
        <div className={styles.poster} />
        <div className={styles.content} />
      </div>
    </div>
  );
}
