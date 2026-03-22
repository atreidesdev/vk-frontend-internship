import { $compareList, clearCompare, removeFromCompare } from "@/store/compare";
import shared from "@/styles/shared.module.css";
import type { Movie } from "@/types/movie";
import { getDuration, getGenres, getPosterUrl, getRating, getTitle, getYear } from "@/utils/movie";
import { useUnit } from "effector-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CompareCardsSidebar.module.css";

function CompareCard({ movie, onRemove }: { movie: Movie; onRemove: () => void }) {
  const navigate = useNavigate();
  const posterUrl = getPosterUrl(movie.poster);
  const title = getTitle(movie);

  return (
    <div className={styles.slot}>
      <div
        role="button"
        tabIndex={0}
        className={styles.posterWrap}
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/movie/${movie.id}`)}
        onKeyDown={(e) => e.key === "Enter" && navigate(`/movie/${movie.id}`)}
      >
        {posterUrl ? (
          <img src={posterUrl} alt="" />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--vkui--color_text_secondary)",
              fontSize: 11,
            }}
          >
            Нет постера
          </div>
        )}
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          textAlign: "center",
          maxWidth: 120,
          minHeight: "2.5em",
          display: "block",
          wordBreak: "break-word",
          whiteSpace: "normal",
          lineHeight: 1.25,
        }}
      >
        {title}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        style={{
          fontSize: 11,
          color: "var(--vkui--color_text_secondary)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "2px 6px",
        }}
      >
        Убрать
      </button>
    </div>
  );
}

function PlaceholderSlot({ index }: { index: 1 | 2 }) {
  return (
    <div className={styles.slot}>
      <div className={styles.placeholder}>
        <span
          style={{
            fontSize: 12,
            color: "var(--mm-text-muted)",
            textAlign: "center",
          }}
        >
          Слот {index}
        </span>
        <span
          style={{
            fontSize: 11,
            color: "var(--mm-text-muted)",
            textAlign: "center",
          }}
        >
          Выберите фильм для сравнения
        </span>
      </div>
    </div>
  );
}

const MAX_SLOTS = 2;

const compareGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "4px 12px",
  fontSize: 12,
  marginTop: 8,
  alignItems: "start",
};

const compareCellStyle: React.CSSProperties = {
  minWidth: 0,
  textAlign: "left",
};

const compareCellRightStyle: React.CSSProperties = {
  minWidth: 0,
  textAlign: "right",
};

function CompareParams({ a, b }: { a: Movie; b: Movie }) {
  const rows: { id: string; left: string; right: string; wrap?: boolean }[] = [
    { id: "year", left: String(getYear(a) ?? "-"), right: String(getYear(b) ?? "-") },
    { id: "rating", left: String(getRating(a) ?? "-"), right: String(getRating(b) ?? "-") },
    {
      id: "genres",
      left: getGenres(a).join(", ") || "-",
      right: getGenres(b).join(", ") || "-",
      wrap: true,
    },
    {
      id: "duration",
      left: getDuration(a) != null ? `${getDuration(a)} мин` : "-",
      right: getDuration(b) != null ? `${getDuration(b)} мин` : "-",
    },
  ];
  return (
    <div style={compareGridStyle}>
      {rows.map(({ id, left, right, wrap }) => {
        const leftStyle = {
          ...compareCellStyle,
          ...(wrap && { wordBreak: "break-word" as const }),
        };
        const rightStyle = {
          ...compareCellRightStyle,
          ...(wrap && { wordBreak: "break-word" as const }),
        };
        return (
          <React.Fragment key={id}>
            <span style={leftStyle}>{left}</span>
            <span style={rightStyle}>{right}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function CompareCardsSidebar() {
  const list = useUnit($compareList);

  return (
    <aside className={styles.sidebar}>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--mm-text-muted)",
          textAlign: "center",
        }}
      >
        Сравнение ({list.length}/{MAX_SLOTS})
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {[0, 1].map((i) =>
          list[i] ? (
            <CompareCard key={i} movie={list[i]} onRemove={() => removeFromCompare(list[i]!.id)} />
          ) : (
            <PlaceholderSlot key={i} index={(i + 1) as 1 | 2} />
          )
        )}
      </div>
      {list.length === 2 && <CompareParams a={list[0]} b={list[1]} />}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
          marginTop: "auto",
        }}
      >
        <button
          type="button"
          className={shared.btnSecondary}
          style={{ width: "100%", fontSize: 12 }}
          onClick={() => clearCompare()}
          disabled={list.length === 0}
        >
          Очистить
        </button>
      </div>
    </aside>
  );
}
