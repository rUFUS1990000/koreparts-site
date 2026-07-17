"use client";

import { useEffect, useState } from "react";
import { loadFavorites, toggleFavorite } from "@/lib/storage";

export function FavoriteButton({
  productId,
  className = "btn btn-ghost",
}: {
  productId: string;
  className?: string;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(loadFavorites().includes(productId));
  }, [productId]);

  return (
    <button
      type="button"
      className={className}
      aria-pressed={on}
      title={on ? "Убрать из избранного" : "В избранное"}
      onClick={() => {
        const next = toggleFavorite(productId);
        setOn(next.includes(productId));
      }}
    >
      {on ? "♥ В избранном" : "♡ В избранное"}
    </button>
  );
}
