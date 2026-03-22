import { MovieCard } from "@/components/MovieCard";
import { $cardViewMode } from "@/store/cardView";
import { $favorites } from "@/store/favorites";
import { openRemoveFavoriteModal } from "@/store/modal";
import { Panel, Placeholder } from "@vkontakte/vkui";
import { useUnit } from "effector-react";
import styles from "./FavoritesPage.module.css";

export function FavoritesPage() {
  const favorites = useUnit($favorites);
  const cardViewMode = useUnit($cardViewMode);
  const openRemoveModal = useUnit(openRemoveFavoriteModal);

  return (
    <Panel id="favorites">
      <div className={styles.layout}>
        <div className={styles.column}>
          <div className={`${styles.scroll} ${cardViewMode === "poster" ? styles.scrollGrid : ""}`}>
            {favorites.length === 0 ? (
              <Placeholder>
                В избранном пока ничего нет. Добавляйте фильмы с главной или со страницы фильма.
              </Placeholder>
            ) : cardViewMode === "poster" ? (
              favorites.map((movie, i) => (
                <div key={movie.id} className={styles.listItem}>
                  <MovieCard
                    movie={movie}
                    index={i}
                    variant={cardViewMode}
                    onRemoveFromFavorites={(m) => openRemoveModal(m)}
                  />
                </div>
              ))
            ) : (
              <div className={styles.list}>
                {favorites.map((movie, i) => (
                  <div key={movie.id} className={styles.listItem}>
                    <MovieCard
                      movie={movie}
                      index={i}
                      variant={cardViewMode}
                      onRemoveFromFavorites={(m) => openRemoveModal(m)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}
