"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND_META } from "@/lib/nav";
import { BRANDS, MODELS, PRODUCTS } from "@/lib/products";
import type { BrandId } from "@/lib/types";

type Props = {
  /** compact strip under header or full block on homepage */
  variant?: "bar" | "panel";
  className?: string;
  defaultBrand?: BrandId;
};

export function BrandModelSelector({
  variant = "panel",
  className = "",
  defaultBrand = "kia",
}: Props) {
  const [active, setActive] = useState<BrandId>(defaultBrand);
  const brands = Object.keys(BRANDS) as BrandId[];
  const models = MODELS[active];
  const brandCount = PRODUCTS.filter((p) => p.brand === active).length;

  if (variant === "bar") {
    return (
      <div
        className={`border-b border-[var(--border)] bg-[var(--bg-elevated)]/90 ${className}`}
      >
        <div className="container-kp flex flex-wrap items-center gap-2 py-2.5">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Марка:
          </span>
          {brands.map((id) => (
            <Link
              key={id}
              href={`/catalog?brand=${id}`}
              className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3.5 py-1.5 text-sm font-semibold text-[var(--text-h)] transition hover:border-[var(--blue-bright)]/45 hover:text-[var(--blue-bright)]"
            >
              {BRANDS[id]}
            </Link>
          ))}
          <span className="mx-1 hidden h-4 w-px bg-[var(--border)] sm:block" />
          <span className="hidden text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] md:inline">
            Модели:
          </span>
          <div className="flex max-w-full gap-1.5 overflow-x-auto scrollbar-thin">
            {MODELS.kia.slice(0, 3).map((m) => (
              <Link
                key={`kia-${m.id}`}
                href={`/catalog?brand=kia&model=${m.id}`}
                className="shrink-0 rounded-full px-2.5 py-1 text-xs text-[var(--text-muted)] ring-1 ring-[var(--border)] hover:text-[var(--blue-bright)]"
              >
                Kia {m.title}
              </Link>
            ))}
            {MODELS.hyundai.slice(0, 3).map((m) => (
              <Link
                key={`hy-${m.id}`}
                href={`/catalog?brand=hyundai&model=${m.id}`}
                className="shrink-0 rounded-full px-2.5 py-1 text-xs text-[var(--text-muted)] ring-1 ring-[var(--border)] hover:text-[var(--blue-bright)]"
              >
                {m.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`container-kp ${className}`}>
      <div className="card overflow-hidden">
        <div className="border-b border-[var(--border)] bg-[var(--bg-elevated)]/60 px-4 py-3 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-h)] md:text-xl">
                Быстрый выбор автомобиля
              </h2>
              <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                Марка → модель → каталог запчастей
              </p>
            </div>
            <Link
              href="/vin"
              className="text-sm font-semibold text-[var(--blue-bright)] hover:underline"
            >
              Или подбор по VIN →
            </Link>
          </div>
        </div>

        {/* Brand tabs */}
        <div className="flex border-b border-[var(--border)]">
          {brands.map((id) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={`relative flex-1 px-3 py-3.5 text-center text-sm font-bold transition sm:text-base ${
                  isActive
                    ? "bg-[var(--bg-card)] text-[var(--text-h)]"
                    : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-h)]"
                }`}
              >
                {BRANDS[id]}
                {isActive && (
                  <span
                    className="absolute inset-x-4 bottom-0 h-0.5 rounded-full"
                    style={{ background: BRAND_META[id].color }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-sm text-[var(--text-muted)]">
                Подкаталоги{" "}
                <span className="font-semibold text-[var(--text-h)]">
                  {BRAND_META[active].title}
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {brandCount} позиций в каталоге
              </div>
            </div>
            <Link
              href={`/catalog?brand=${active}`}
              className="btn btn-primary btn-sm"
            >
              Все {BRANDS[active]}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {models.map((m) => {
              const count = PRODUCTS.filter(
                (p) => p.brand === active && p.model === m.id,
              ).length;
              return (
                <Link
                  key={m.id}
                  href={`/catalog?brand=${active}&model=${m.id}`}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 text-center transition hover:-translate-y-0.5 hover:border-[var(--border-glow)] hover:shadow-lg"
                >
                  <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] group-hover:text-[var(--blue-bright)]">
                    {BRANDS[active]}
                  </div>
                  <div className="mt-1 text-lg font-extrabold tracking-tight text-[var(--text-h)]">
                    {m.title}
                  </div>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">
                    {count > 0 ? `${count} деталей` : "Смотреть"}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
