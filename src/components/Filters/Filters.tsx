import { $cardViewMode, setCardViewMode } from "@/store/cardView";
import { $filters, filtersToSearchParams, setFilters } from "@/store/filters";
import { $genres, loadGenres } from "@/store/possibleValues";
import shared from "@/styles/shared.module.css";
import { useUnit } from "effector-react";
import { useEffect, useRef, useState } from "react";
import styles from "./Filters.module.css";

interface FiltersProps {
  onApply: (searchParams: URLSearchParams) => void;
}

function GenrePicker({
  genres,
  selected,
  onToggle,
}: {
  genres: string[];
  selected: string[];
  onToggle: (genre: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filterLower = filter.trim().toLowerCase();
  const filtered = filterLower
    ? genres.filter((g) => g.toLowerCase().includes(filterLower))
    : [...genres];

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onOutside);
    return () => document.removeEventListener("click", onOutside);
  }, [open]);

  return (
    <div
      ref={ref}
      className={open ? `${styles.genrePicker} ${styles.genrePickerOpen}` : styles.genrePicker}
    >
      <label className={styles.label}>Жанры</label>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <div className={styles.chips}>
          {selected.length === 0 && <span className={styles.placeholder}>Выберите жанры</span>}
          {selected.map((g) => (
            <span key={g} className={styles.chip}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{g}</span>
              <button
                type="button"
                className={styles.chipRemove}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(g);
                }}
                aria-label="Убрать"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                  <path
                    d="M2.5 2.5l7 7M9.5 2.5l-7 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <svg
          className={styles.arrow}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className={styles.dropdown}>
          <input
            type="search"
            autoComplete="off"
            placeholder="Поиск жанра..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.search}
          />
          <div className={styles.list} role="listbox">
            {filtered.length === 0 ? (
              <p className={styles.noResults}>Ничего не найдено</p>
            ) : (
              filtered.map((g) => {
                const isSelected = selected.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => onToggle(g)}
                    className={
                      isSelected ? `${styles.option} ${styles.optionSelected}` : styles.option
                    }
                  >
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {g}
                    </span>
                    {isSelected && (
                      <span className={styles.optionCheck} aria-hidden>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Filters({ onApply }: FiltersProps) {
  const appliedFilters = useUnit($filters);
  const genres = useUnit($genres);
  const cardViewMode = useUnit($cardViewMode);
  const [draft, setDraft] = useState(appliedFilters);

  useEffect(() => {
    if (genres.length === 0) loadGenres();
  }, [genres.length]);

  useEffect(() => {
    setDraft(appliedFilters);
  }, [appliedFilters]);

  const toggleGenre = (genre: string) => {
    setDraft((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleApply = () => {
    setFilters(draft);
    onApply(filtersToSearchParams(draft));
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.panel}>
      <h2 className={styles.panelTitle}>Фильтры</h2>
      <div className={styles.group}>
        <label className={styles.label}>Вид карточек</label>
        <div className={styles.toggleGroup}>
          <button
            type="button"
            onClick={() => setCardViewMode("horizontal")}
            aria-pressed={cardViewMode === "horizontal"}
            className={cardViewMode === "horizontal" ? styles.toggleBtnActive : styles.toggleBtn}
          >
            Список
          </button>
          <button
            type="button"
            onClick={() => setCardViewMode("poster")}
            aria-pressed={cardViewMode === "poster"}
            className={cardViewMode === "poster" ? styles.toggleBtnActive : styles.toggleBtn}
          >
            Карточки
          </button>
        </div>
      </div>
      <div className={styles.group}>
        <GenrePicker genres={genres} selected={draft.genres} onToggle={toggleGenre} />
        <div className={styles.group} style={{ marginTop: 8 }}>
          <label className={styles.label}>Совпадение жанров</label>
          <div className={styles.toggleGroup}>
            <button
              type="button"
              onClick={() => setDraft((p) => ({ ...p, genresStrict: false }))}
              aria-pressed={!draft.genresStrict}
              className={!draft.genresStrict ? styles.toggleBtnActive : styles.toggleBtn}
            >
              Нестрого
            </button>
            <button
              type="button"
              onClick={() => setDraft((p) => ({ ...p, genresStrict: true }))}
              aria-pressed={draft.genresStrict}
              className={draft.genresStrict ? styles.toggleBtnActive : styles.toggleBtn}
            >
              Строго
            </button>
          </div>
        </div>
      </div>
      <div className={styles.group}>
        <label className={styles.label}>Рейтинг</label>
        <div className={styles.range}>
          <input
            type="number"
            min={0}
            max={10}
            step={0.5}
            value={String(draft.ratingMin)}
            onChange={(e) => setDraft((p) => ({ ...p, ratingMin: Number(e.target.value) || 0 }))}
            className={styles.rangeInput}
          />
          <span className={styles.rangeSep}>-</span>
          <input
            type="number"
            min={0}
            max={10}
            step={0.5}
            value={String(draft.ratingMax)}
            onChange={(e) => setDraft((p) => ({ ...p, ratingMax: Number(e.target.value) || 10 }))}
            className={styles.rangeInput}
          />
        </div>
      </div>
      <div className={styles.group}>
        <label className={styles.label}>Год</label>
        <div className={styles.range}>
          <input
            type="number"
            min={1990}
            max={currentYear}
            value={String(draft.yearMin)}
            onChange={(e) => setDraft((p) => ({ ...p, yearMin: Number(e.target.value) || 1990 }))}
            className={styles.rangeInput}
          />
          <span className={styles.rangeSep}>-</span>
          <input
            type="number"
            min={1990}
            max={currentYear}
            value={String(draft.yearMax)}
            onChange={(e) =>
              setDraft((p) => ({ ...p, yearMax: Number(e.target.value) || currentYear }))
            }
            className={styles.rangeInput}
          />
        </div>
      </div>
      <div className={styles.applyWrap}>
        <button
          type="button"
          className={shared.btnPrimary}
          style={{ width: "100%" }}
          onClick={handleApply}
        >
          Применить
        </button>
      </div>
    </div>
  );
}
