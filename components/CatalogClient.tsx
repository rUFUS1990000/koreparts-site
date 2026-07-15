"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBox } from "@/components/SearchBox";
import {
  ALL_MODELS,
  BRANDS,
  CATEGORIES,
  filterProducts,
  formatPrice,
  PRODUCTS,
  priceRange,
  type CatalogFilters,
} from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function CatalogClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const range = priceRange();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [brand, setBrand] = useState(sp.get("brand") ?? "");
  const [model, setModel] = useState(sp.get("model") ?? "");
  const [category, setCategory] = useState(sp.get("category") ?? "");
  const [minPrice, setMinPrice] = useState(sp.get("min") ?? "");
  const [maxPrice, setMaxPrice] = useState(sp.get("max") ?? "");
  const [inStock, setInStock] = useState(sp.get("stock") === "1");
  const [onlyHits, setOnlyHits] = useState(sp.get("hits") === "1");
  const [sort, setSort] = useState<CatalogFilters["sort"]>(
    (sp.get("sort") as CatalogFilters["sort"]) || "popular",
  );

  const modelSelectValue =
    brand && model
      ? `${brand}:${model}`
      : model
        ? (() => {
            const hit = ALL_MODELS.find((m) => m.model === model);
            return hit ? `${hit.brand}:${hit.model}` : "";
          })()
        : "";

  const products = useMemo(() => {
    let list = filterProducts({
      q,
      brand: brand || undefined,
      model: model || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort,
    });
    if (inStock) list = list.filter((p) => p.stock > 0);
    if (onlyHits) list = list.filter((p) => p.popular);
    return list;
  }, [q, brand, model, category, minPrice, maxPrice, sort, inStock, onlyHits]);

  function pushState(patch: Record<string, string | undefined>) {
    const next = {
      q,
      brand,
      model,
      category,
      min: minPrice,
      max: maxPrice,
      sort: sort || "popular",
      stock: inStock ? "1" : "",
      hits: onlyHits ? "1" : "",
      ...patch,
    };

    if ("brand" in patch) setBrand(patch.brand ?? "");
    if ("model" in patch) setModel(patch.model ?? "");
    if ("category" in patch) setCategory(patch.category ?? "");
    if ("q" in patch && patch.q !== undefined) setQ(patch.q);
    if ("min" in patch && patch.min !== undefined) setMinPrice(patch.min);
    if ("max" in patch && patch.max !== undefined) setMaxPrice(patch.max);
    if ("sort" in patch && patch.sort) setSort(patch.sort as CatalogFilters["sort"]);
    if ("stock" in patch) setInStock(patch.stock === "1");
    if ("hits" in patch) setOnlyHits(patch.hits === "1");

    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.brand) params.set("brand", next.brand);
    if (next.model) params.set("model", next.model);
    if (next.category) params.set("category", next.category);
    if (next.min) params.set("min", next.min);
    if (next.max) params.set("max", next.max);
    if (next.sort && next.sort !== "popular") params.set("sort", next.sort);
    if (next.stock === "1") params.set("stock", "1");
    if (next.hits === "1") params.set("hits", "1");
    const qs = params.toString();
    router.replace(qs ? `/catalog?${qs}` : "/catalog", { scroll: false });
  }

  function apply() {
    pushState({
      q,
      brand,
      model,
      category,
      min: minPrice,
      max: maxPrice,
      sort: sort || "popular",
      stock: inStock ? "1" : "",
      hits: onlyHits ? "1" : "",
    });
  }

  function reset() {
    setQ("");
    setBrand("");
    setModel("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
    setOnlyHits(false);
    setSort("popular");
    router.replace("/catalog", { scroll: false });
  }

  const modelOptions = brand
    ? ALL_MODELS.filter((m) => m.brand === brand)
    : ALL_MODELS;

  return (
    <div className="space-y-6">
      <div className="card p-4 md:p-5">
        <SearchBox />
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="card h-fit space-y-4 p-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--text-h)]">
              Фильтры
            </div>
            <span className="text-xs text-[var(--text-muted)]">
              {PRODUCTS.length} в базе
            </span>
          </div>

          <label className="block space-y-1.5 text-sm">
            <span className="text-[var(--text-muted)]">Поиск (название / OEM)</span>
            <input
              className="input"
              placeholder="26300-35503, колодки…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
            />
          </label>

          <div className="space-y-1.5 text-sm">
            <span className="text-[var(--text-muted)]">Категория</span>
            <div className="flex flex-wrap gap-1.5">
              <Chip active={!category} onClick={() => pushState({ category: "" })} label="Все" />
              {Object.entries(CATEGORIES).map(([id, c]) => (
                <Chip
                  key={id}
                  active={category === id}
                  onClick={() => pushState({ category: id })}
                  label={`${c.emoji} ${c.title.split(" ")[0]}`}
                />
              ))}
            </div>
          </div>

          <label className="block space-y-1.5 text-sm">
            <span className="text-[var(--text-muted)]">Бренд</span>
            <select
              className="select"
              value={brand}
              onChange={(e) => pushState({ brand: e.target.value, model: "" })}
            >
              <option value="">Все бренды</option>
              {Object.entries(BRANDS).map(([id, title]) => (
                <option key={id} value={id}>
                  {title}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5 text-sm">
            <span className="text-[var(--text-muted)]">Модель авто</span>
            <select
              className="select"
              value={modelSelectValue}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) {
                  pushState({ brand: brand || "", model: "" });
                  return;
                }
                const [b, m] = v.split(":");
                pushState({ brand: b, model: m });
              }}
            >
              <option value="">Все модели</option>
              {modelOptions.map((m) => (
                <option key={`${m.brand}:${m.model}`} value={`${m.brand}:${m.model}`}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="block space-y-1.5 text-sm">
              <span className="text-[var(--text-muted)]">Цена от</span>
              <input
                className="input"
                type="number"
                min={0}
                placeholder={String(range.min)}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="text-[var(--text-muted)]">до</span>
              <input
                className="input"
                type="number"
                min={0}
                placeholder={String(range.max)}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </label>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Диапазон каталога: {formatPrice(range.min)} — {formatPrice(range.max)}
          </p>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-h)]">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => pushState({ stock: e.target.checked ? "1" : "" })}
              className="accent-[var(--blue)]"
            />
            Только в наличии
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-h)]">
            <input
              type="checkbox"
              checked={onlyHits}
              onChange={(e) => pushState({ hits: e.target.checked ? "1" : "" })}
              className="accent-[var(--red)]"
            />
            Только хиты
          </label>

          <label className="block space-y-1.5 text-sm">
            <span className="text-[var(--text-muted)]">Сортировка</span>
            <select
              className="select"
              value={sort}
              onChange={(e) => pushState({ sort: e.target.value })}
            >
              <option value="popular">Популярные</option>
              <option value="price-asc">Цена ↑</option>
              <option value="price-desc">Цена ↓</option>
              <option value="name">По названию</option>
            </select>
          </label>

          <div className="flex gap-2 pt-1">
            <button type="button" className="btn btn-primary flex-1" onClick={apply}>
              Применить
            </button>
            <button type="button" className="btn btn-ghost" onClick={reset}>
              Сброс
            </button>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-h)] md:text-3xl">
                Каталог запчастей
              </h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Найдено:{" "}
                <b className="text-[var(--text-h)]">{products.length}</b> · умные
                фильтры и live-поиск
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-[var(--text-muted)]">
                Ничего не найдено. Измените фильтры или сбросьте поиск.
              </p>
              <button type="button" className="btn btn-primary mt-4" onClick={reset}>
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid-products">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className="reveal"
                  style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
        active
          ? "bg-[var(--blue-dim)] text-[var(--blue-bright)] ring-1 ring-[rgba(59,130,246,0.35)]"
          : "bg-[var(--bg)] text-[var(--text-muted)] ring-1 ring-[var(--border)] hover:text-[var(--text-h)]"
      }`}
    >
      {label}
    </button>
  );
}
