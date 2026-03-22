import { FavoritesPage } from "@/pages/FavoritesPage";
import { MovieDetailPage } from "@/pages/MovieDetailPage";
import { MovieListPage } from "@/pages/MovieListPage";
import { Route, Routes } from "react-router-dom";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MovieListPage />} />
      <Route path="/movie/:id" element={<MovieDetailPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
    </Routes>
  );
}
