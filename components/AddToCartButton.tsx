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
  const { add } = useCart();
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={() => {
        add(productId, 1);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
    >
      {disabled ? "Нет в наличии" : done ? "✓ Добавлено" : label}
    </button>
  );
}
