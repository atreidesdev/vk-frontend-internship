import { fetchMovies } from "@/api/movies";
import { CompareCardsSidebar } from "@/components/CompareCardsSidebar";
import { Filters } from "@/components/Filters";
import { MovieCard } from "@/components/MovieCard";
import { MovieCardSkeleton } from "@/components/MovieCardSkeleton";
import { $cardViewMode } from "@/store/cardView";
import { addToCompare } from "@/store/compare";
import {
  $filters,
  filtersToApiParams,
  parseFiltersFromSearchParams,
  setFilters,
} from "@/store/filters";
import { openAddFavoriteModal, openRemoveFavoriteModal } from "@/store/modal";
import {
  $moviesError,
  $moviesList,
  $moviesLoading,
  $moviesTotal,
  setMovies,
  setMoviesError,
  setMoviesLoading,
} from "@/store/movies";
import { Button, Panel, Placeholder } from "@vkontakte/vkui";
import { useUnit } from "effector-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./MovieListPage.module.css";

const listScroll: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: 12,
};

export function MovieListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingMore, setLoadingMore] = useState(false);
  const openAddModal = useUnit(openAddFavoriteModal);
  const openRemoveModal = useUnit(openRemoveFavoriteModal);
  const cardViewMode = useUnit($cardViewMode);
  const filters = useUnit($filters);
  const list = useUnit($moviesList);
  const loading = useUnit($moviesLoading);
  const error = useUnit($moviesError);
  const total = useUnit($moviesTotal);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasFetchedOnceRef = useRef(false);

  useEffect(() => {
    if (!loading) {
      hasFetchedOnceRef.current = true;
      setLoadingMore(false);
    }
  }, [loading]);

  const effectiveFilters =
    searchParams.has("genres") ||
    searchParams.has("genresStrict") ||
    searchParams.has("ratingMin") ||
    searchParams.has("ratingMax") ||
    searchParams.has("yearMin") ||
    searchParams.has("yearMax")
      ? parseFiltersFromSearchParams(searchParams)
      : filters;

  useEffect(() => {
    setFilters(parseFiltersFromSearchParams(searchParams));
  }, [searchParams]);

  const loadPage = useCallback(
    async (page: number, reset: boolean) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setMoviesLoading(true);
      setMoviesError(null);
      try {
        const params = filtersToApiParams(effectiveFilters, page);
        const res = await fetchMovies(params as Parameters<typeof fetchMovies>[0]);
        setMovies({
          list: res.docs,
          total: res.total,
          reset,
        });
      } catch (e) {
        setMoviesError(e instanceof Error ? e.message : "Ошибка загрузки");
        if (reset) setMovies({ list: [], total: 0, reset: true });
      } finally {
        setMoviesLoading(false);
        loadingRef.current = false;
      }
    },
    [effectiveFilters]
  );

  useEffect(() => {
    pageRef.current = 1;
    loadPage(1, true);
  }, [loadPage]);

  const handleApplyFilters = (params: URLSearchParams) => {
    setSearchParams(params);
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting || loading || list.length >= total) return;
        const nextPage = pageRef.current + 1;
        pageRef.current = nextPage;
        setLoadingMore(true);
        loadPage(nextPage, false);
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, list.length, total, loadPage]);

  const renderList = () => {
    if (error) {
      return (
        <Placeholder action={<Button onClick={() => loadPage(1, true)}>Повторить</Button>}>
          {error}
        </Placeholder>
      );
    }
    if (list.length === 0 && (loading || !hasFetchedOnceRef.current)) {
      const SKELETON_IDS = ["s1", "s2", "s3", "s4", "s5", "s6"];
      return (
        <div className={styles.skeletonList}>
          {SKELETON_IDS.map((id) => (
            <div key={id} className={styles.listItem}>
              <MovieCardSkeleton variant={cardViewMode} />
            </div>
          ))}
        </div>
      );
    }
    if (list.length === 0 && !loading) {
      return <Placeholder>Примените фильтры и нажмите «Применить»</Placeholder>;
    }
    return (
      <>
        {list.map((movie, i) => (
          <div key={movie.id} className={styles.listItem}>
            <MovieCard
              movie={movie}
              index={i}
              variant={cardViewMode}
              onAddToFavorites={(m) => openAddModal(m)}
              onRemoveFromFavorites={(m) => openRemoveModal(m)}
              onAddToCompare={(m) => addToCompare(m)}
            />
          </div>
        ))}
      </>
    );
  };

  return (
    <Panel id="main">
      <div className={styles.layout}>
        <aside className={styles.compare}>
          <CompareCardsSidebar />
        </aside>

        <div className={styles.column}>
          <div
            className={`${styles.scroll} ${cardViewMode === "poster" ? styles.scrollGrid : ""}`}
            style={listScroll}
          >
            {renderList()}
            {(loading || loadingMore) && list.length > 0 && (
              <div className={styles.skeletonList}>
                {["s1", "s2", "s3", "s4", "s5", "s6"].map((id) => (
                  <div key={id} className={styles.listItem}>
                    <MovieCardSkeleton variant={cardViewMode} />
                  </div>
                ))}
              </div>
            )}
            <div ref={sentinelRef} style={{ height: 1 }} />
          </div>
        </div>

        <aside className={styles.filters}>
          <Filters onApply={handleApplyFilters} />
        </aside>
      </div>
    </Panel>
  );
}
