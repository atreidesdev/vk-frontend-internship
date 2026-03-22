import { AddToFavoritesModal } from "@/components/AddToFavoritesModal";
import { RemoveFromFavoritesModal } from "@/components/RemoveFromFavoritesModal";
import { $activeModal, $modalMovie, closeModal } from "@/store/modal";
import { useUnit } from "effector-react";

export function Modals() {
  const activeModal = useUnit($activeModal);
  const modalMovie = useUnit($modalMovie);
  const handleClose = useUnit(closeModal);

  if (!modalMovie) return null;

  return (
    <>
      <AddToFavoritesModal
        movie={modalMovie}
        open={activeModal === "add-favorite"}
        onClose={handleClose}
        onConfirm={handleClose}
      />
      <RemoveFromFavoritesModal
        movie={modalMovie}
        open={activeModal === "remove-favorite"}
        onClose={handleClose}
        onConfirm={handleClose}
      />
    </>
  );
}
