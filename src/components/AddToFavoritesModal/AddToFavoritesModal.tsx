import { addFavorite } from "@/store/favorites";
import shared from "@/styles/shared.module.css";
import type { Movie } from "@/types/movie";
import { getTitle } from "@/utils/movie";
import { useUnit } from "effector-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./AddToFavoritesModal.module.css";

interface AddToFavoritesModalProps {
  movie: Movie;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AddToFavoritesModal({ movie, open, onClose, onConfirm }: AddToFavoritesModalProps) {
  const addFavoriteFn = useUnit(addFavorite);
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
    addFavoriteFn(movie);
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
      aria-labelledby="mm-modal-title"
    >
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h2 id="mm-modal-title" className={styles.title}>
          Добавить в избранное?
        </h2>
        <p className={styles.text}>{getTitle(movie)}</p>
        <p className={styles.text} style={{ marginBottom: 16 }}>
          Фильм будет сохранён в избранном и останется там после перезагрузки страницы.
        </p>
        <div className={styles.actions}>
          <button type="button" className={shared.btnPrimary} onClick={handleConfirm}>
            Добавить
          </button>
          <button type="button" className={shared.btnSecondary} onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
