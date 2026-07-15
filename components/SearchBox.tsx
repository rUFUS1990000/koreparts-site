"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  brandTitle,
  formatPrice,
  modelTitle,
  searchProducts,
} from "@/lib/products";

type Props = {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
};

export function SearchBox({
  className = "",
  placeholder = "Поиск: OEM, название, модель…",
  autoFocus,
}: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (q.trim().length < 2) return [];
    return searchProducts(q).slice(0, 8);
  }, [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function goSearch() {
    const query = q.trim();
    if (!query) return;
    setOpen(false);
    router.push(`/catalog?q=${encodeURIComponent(query)}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") goSearch();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = suggestions[active];
      if (item) {
        setOpen(false);
        router.push(`/product/${item.id}`);
      } else goSearch();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            className="input pr-10"
            value={q}
            autoFocus={autoFocus}
            placeholder={placeholder}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            aria-label="Быстрый поиск товаров"
            aria-autocomplete="list"
            aria-expanded={open && suggestions.length > 0}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            ⌕
          </span>
        </div>
        <button type="button" className="btn btn-primary" onClick={goSearch}>
          Найти
        </button>
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl">
          <ul className="max-h-80 overflow-auto py-1">
            {suggestions.map((p, i) => (
              <li key={p.id}>
                <Link
                  href={`/product/${p.id}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-start justify-between gap-3 px-3 py-2.5 text-sm transition ${
                    i === active
                      ? "bg-[var(--blue-dim)]"
                      : "hover:bg-[var(--bg-muted)]"
                  }`}
                  onMouseEnter={() => setActive(i)}
                >
                  <span>
                    <span className="block font-semibold text-[var(--text-h)]">
                      {p.name}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {brandTitle(p.brand)} {modelTitle(p.brand, p.model)} ·{" "}
                      <span className="font-mono text-[var(--blue-bright)]">
                        {p.oem}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 font-bold text-[var(--text-h)]">
                    {formatPrice(p.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="w-full border-t border-[var(--border)] px-3 py-2.5 text-left text-sm font-semibold text-[var(--blue-bright)] hover:bg-[var(--bg-muted)]"
            onClick={goSearch}
          >
            Все результаты по «{q.trim()}» →
          </button>
        </div>
      )}
    </div>
  );
}
