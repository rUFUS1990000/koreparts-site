"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({
  productId,
  disabled,
  className = "btn btn-primary",
  label = "Добавить в корзину",
}: {
  productId: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}) {
  const { add, getQty } = useCart();
  const [flashQty, setFlashQty] = useState<number | null>(null);
  const qty = getQty(productId);
  const shownQty = flashQty ?? qty;

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={() => {
        const next = (flashQty ?? qty) + 1;
        add(productId, 1);
        setFlashQty(next);
        window.setTimeout(() => setFlashQty(null), 1400);
      }}
    >
      {disabled
        ? "Нет в наличии"
        : flashQty != null
          ? `✓ В корзине ${flashQty} шт.`
          : shownQty > 0
            ? `В корзине ${shownQty} · +1`
            : label}
    </button>
  );
}
