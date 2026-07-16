"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { telegramProductUrl } from "@/lib/constants";
import {
  brandTitle,
  CATEGORIES,
  formatPrice,
  modelTitle,
} from "@/lib/products";
import type { Product } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcons";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const cat = CATEGORIES[product.category];

  function onAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    add(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[var(--bg-muted)]"
      >
        <Image
          src={product.image}
          alt={`${product.name} ${product.oem}`}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent" />
        {product.popular && (
          <span className="badge badge-red absolute left-3 top-3">Хит</span>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="badge absolute right-3 top-3">Мало</span>
        )}
        {product.stock <= 0 && (
          <span className="badge absolute right-3 top-3 opacity-90">Нет</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {cat ? (
            <span className="inline-flex items-center gap-1">
              <CategoryIcon id={product.category} size={14} />
              {cat.title}
            </span>
          ) : null}
        </div>
        <Link
          href={`/product/${product.id}`}
          className="line-clamp-2 min-h-[2.6em] text-[0.98rem] font-semibold leading-snug text-[var(--text-h)] transition hover:text-[var(--blue-bright)]"
        >
          {product.name}
        </Link>
        <div className="text-xs text-[var(--text-muted)]">
          {brandTitle(product.brand)} {modelTitle(product.brand, product.model)}
        </div>
        <div className="rounded-lg bg-[var(--bg)] px-2 py-1 font-mono text-[11px] text-[var(--blue-bright)] ring-1 ring-[var(--border)]">
          OEM {product.oem}
        </div>
        <div className="mt-auto space-y-2 pt-2">
          <div className="flex items-center justify-between gap-2">
            <div className="text-lg font-bold tracking-tight text-[var(--text-h)]">
              {formatPrice(product.price)}
            </div>
            <button
              type="button"
              onClick={onAdd}
              className={`btn btn-sm ${added ? "btn-accent" : "btn-primary"}`}
              disabled={product.stock <= 0}
            >
              {product.stock <= 0 ? "Нет" : added ? "✓" : "В корзину"}
            </button>
          </div>
          <a
            href={telegramProductUrl(product.oem, product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm w-full text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            ✈️ Спросить в Telegram
          </a>
        </div>
      </div>
    </article>
  );
}
