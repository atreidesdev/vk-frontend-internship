import { removeFavorite } from "@/store/favorites";
import shared from "@/styles/shared.module.css";
import type { Movie } from "@/types/movie";
import { getTitle } from "@/utils/movie";
import { useUnit } from "effector-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "../AddToFavoritesModal/AddToFavoritesModal.module.css";

interface RemoveFromFavoritesModalProps {
  movie: Movie;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RemoveFromFavoritesModal({
  movie,
  open,
  onClose,
  onConfirm,
}: RemoveFromFavoritesModalProps) {
  const removeFavoriteFn = useUnit(removeFavorite);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = overlayRef.current;
    el?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleConfirm = () => {
    removeFavoriteFn(movie.id);
    onConfirm();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  const modal = (
    <div
      ref={overlayRef}
      className={styles.overlay}
      tabIndex={-1}
      onClick={handleOverlayClick}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mm-remove-modal-title"
    >
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h2 id="mm-remove-modal-title" className={styles.title}>
          Удалить из избранного?
        </h2>
        <p className={styles.text}>{getTitle(movie)}</p>
        <p className={styles.text} style={{ marginBottom: 16 }}>
          Фильм будет удалён из списка избранного.
        </p>
        <div className={styles.actions}>
          <button type="button" className={shared.btnSecondary} onClick={onClose}>
            Отмена
          </button>
          <button type="button" className={shared.btnPrimary} onClick={handleConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
