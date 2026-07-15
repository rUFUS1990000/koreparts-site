"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BRAND_META, POPULAR_SECTIONS } from "@/lib/nav";
import { BRANDS, CATEGORIES, MODELS, PRODUCTS } from "@/lib/products";
import type { BrandId, CategoryId } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcons";

type Props = {
  /** стиль кнопки-триггера */
  className?: string;
  /** закрыть родительское мобильное меню */
  onNavigate?: () => void;
  /** variant for desktop mega vs mobile accordion */
  variant?: "desktop" | "mobile";
};

export function CatalogsMenu({
  className = "",
  onNavigate,
  variant = "desktop",
}: Props) {
  const [open, setOpen] = useState(false);
  const [brandTab, setBrandTab] = useState<BrandId>("kia");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const cats = Object.entries(CATEGORIES) as [
    CategoryId,
    (typeof CATEGORIES)[CategoryId],
  ][];

  if (variant === "mobile") {
    return (
      <div className="space-y-2">
        <div className="px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          Каталоги
        </div>
        <Link
          href="/catalog"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-xl bg-[var(--blue-dim)] px-3 py-3 font-semibold text-[var(--blue-bright)]"
        >
          Весь каталог
          <span aria-hidden>→</span>
        </Link>
        <div className="grid grid-cols-1 gap-1">
          {cats.map(([id, c]) => (
            <Link
              key={id}
              href={`/catalog?category=${id}`}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-h)] hover:bg-[var(--bg-muted)]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--bg-card)] ring-1 ring-[var(--border)]">
                <CategoryIcon id={id} size={22} />
              </span>
              {c.title}
            </Link>
          ))}
        </div>
        <div className="px-1 pt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          Марки
        </div>
        {(Object.keys(BRANDS) as BrandId[]).map((id) => (
          <div key={id} className="space-y-1">
            <Link
              href={`/catalog?brand=${id}`}
              onClick={onNavigate}
              className="block rounded-xl px-3 py-2 font-semibold text-[var(--text-h)] hover:bg-[var(--bg-muted)]"
            >
              {BRANDS[id]}
            </Link>
            <div className="flex flex-wrap gap-1.5 px-3 pb-2">
              {MODELS[id].map((m) => (
                <Link
                  key={m.id}
                  href={`/catalog?brand=${id}&model=${m.id}`}
                  onClick={onNavigate}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-xs text-[var(--text-muted)] hover:border-[var(--blue-bright)]/40 hover:text-[var(--blue-bright)]"
                >
                  {m.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
          open
            ? "bg-[var(--blue-dim)] text-[var(--blue-bright)] ring-1 ring-[rgba(59,130,246,0.25)]"
            : "text-[var(--text)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-h)]"
        }`}
      >
        <GridIcon />
        Каталоги
        <Chevron open={open} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+0.65rem)] z-50 w-[min(92vw,720px)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_28px_80px_rgba(0,0,0,0.55)]">
          <div className="grid md:grid-cols-[1.15fr_0.85fr]">
            {/* Categories with icons */}
            <div className="border-b border-[var(--border)] p-4 md:border-b-0 md:border-r">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--blue-bright)]">
                  Категории запчастей
                </div>
                <Link
                  href="/catalog"
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--blue-bright)]"
                >
                  Все →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
                {cats.map(([id, c]) => {
                  const count = PRODUCTS.filter((p) => p.category === id).length;
                  return (
                    <Link
                      key={id}
                      href={`/catalog?category=${id}`}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition hover:bg-[var(--bg-muted)]"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--bg)] ring-1 ring-[var(--border)] transition group-hover:ring-[var(--border-glow)]">
                        <CategoryIcon id={id} size={28} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-[var(--text-h)] group-hover:text-[var(--blue-bright)]">
                          {c.title}
                        </span>
                        <span className="block text-[11px] text-[var(--text-muted)]">
                          {count} товаров
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Brands + models submenu */}
            <div className="bg-[var(--bg-elevated)]/80 p-4">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Марка и модель
              </div>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {(Object.keys(BRANDS) as BrandId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setBrandTab(id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      brandTab === id
                        ? "bg-[var(--blue-dim)] text-[var(--blue-bright)] ring-1 ring-[rgba(59,130,246,0.35)]"
                        : "bg-[var(--bg)] text-[var(--text-muted)] ring-1 ring-[var(--border)] hover:text-[var(--text-h)]"
                    }`}
                  >
                    {BRANDS[id]}
                  </button>
                ))}
              </div>
              <Link
                href={`/catalog?brand=${brandTab}`}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className="mb-3 block rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2.5 transition hover:border-[var(--border-glow)]"
              >
                <div className="text-sm font-bold text-[var(--text-h)]">
                  Все {BRAND_META[brandTab].title}
                </div>
                <div className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                  {BRAND_META[brandTab].tagline}
                </div>
              </Link>
              <div className="grid grid-cols-2 gap-1.5">
                {MODELS[brandTab].map((m) => (
                  <Link
                    key={m.id}
                    href={`/catalog?brand=${brandTab}&model=${m.id}`}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2.5 py-2 text-center text-sm font-semibold text-[var(--text-h)] transition hover:border-[var(--blue-bright)]/40 hover:text-[var(--blue-bright)]"
                  >
                    {m.title}
                  </Link>
                ))}
              </div>

              <div className="mt-4 border-t border-[var(--border)] pt-3">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Популярное
                </div>
                <div className="flex flex-col gap-1">
                  {POPULAR_SECTIONS.slice(0, 4).map((s) => (
                    <Link
                      key={s.id}
                      href={s.href}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className="rounded-lg px-2 py-1.5 text-sm text-[var(--text)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--blue-bright)]"
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] bg-[var(--bg)]/60 px-4 py-3">
            <span className="text-xs text-[var(--text-muted)]">
              {PRODUCTS.length} позиций · OEM · Kia · Hyundai · Genesis
            </span>
            <Link
              href="/vin"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="text-xs font-bold text-[var(--blue-bright)] hover:underline"
            >
              Подбор по VIN →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={`transition ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <rect x="1" y="1" width="6" height="6" rx="1.2" />
      <rect x="9" y="1" width="6" height="6" rx="1.2" />
      <rect x="1" y="9" width="6" height="6" rx="1.2" />
      <rect x="9" y="9" width="6" height="6" rx="1.2" />
    </svg>
  );
}
