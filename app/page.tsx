import Link from "next/link";
import type { Metadata } from "next";
import { BrandModelSelector } from "@/components/BrandModelSelector";
import { CategoryGrid } from "@/components/CategoryGrid";
import { CategoryIcon } from "@/components/CategoryIcons";
import { HeroBanner } from "@/components/HeroBanner";
import { PopularSections } from "@/components/PopularSections";
import { ProductCard } from "@/components/ProductCard";
import { PromosSection } from "@/components/PromosSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { VinLookup } from "@/components/VinLookup";
import { BRANDS, CATEGORIES, popularProducts, PRODUCTS } from "@/lib/products";
import type { CategoryId } from "@/lib/types";

export const metadata: Metadata = {
  title: "KoreParts — запчасти Kia, Hyundai, Genesis",
  description:
    "Интернет-магазин автозапчастей для корейских автомобилей. Каталоги по маркам и моделям, OEM, доставка по России.",
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      {/* 1. Popular sections — Autodoc-style entry points */}
      <PopularSections />

      {/* 2. Brand → model subcatalogs */}
      <div className="pb-12 md:pb-14">
        <BrandModelSelector variant="panel" />
      </div>

      {/* 3. Full category catalogs with icons */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)]/50 py-12 md:py-14">
        <div className="container-kp">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="section-title">Каталоги запчастей</h2>
              <p className="section-sub">
                Все разделы с иконками — тормоза, подвеска, двигатель, масла
              </p>
            </div>
            <Link href="/catalog" className="btn btn-ghost btn-sm">
              Открыть каталог →
            </Link>
          </div>
          <CategoryGrid variant="large" />
        </div>
      </section>

      {/* 4. VIN */}
      <section className="container-kp py-12 md:py-14">
        <VinLookup variant="section" />
      </section>

      <PromosSection />

      {/* 5. Hits */}
      <section className="container-kp py-12 md:py-14">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Хиты продаж</h2>
            <p className="section-sub">Популярные оригинальные запчасти</p>
          </div>
          <Link
            href="/catalog?hits=1&sort=popular"
            className="btn btn-ghost btn-sm"
          >
            Все хиты
          </Link>
        </div>
        <div className="grid-products">
          {popularProducts.map((p, i) => (
            <div
              key={p.id}
              className="reveal"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* 6. Category list detail */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)]/40 py-12 md:py-14">
        <div className="container-kp">
          <h2 className="section-title">Подменю разделов</h2>
          <p className="section-sub">
            Удобная навигация по каждому каталогу
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(
              Object.entries(CATEGORIES) as [
                CategoryId,
                (typeof CATEGORIES)[CategoryId],
              ][]
            ).map(([id, c]) => {
              const count = PRODUCTS.filter((p) => p.category === id).length;
              return (
                <Link
                  key={id}
                  href={`/catalog?category=${id}`}
                  className="card card-hover group flex items-center gap-4 p-4"
                >
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[var(--bg-muted)] ring-1 ring-[var(--border)] transition group-hover:scale-105 group-hover:ring-[var(--border-glow)]">
                    <CategoryIcon id={id} size={40} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-[var(--text-h)] group-hover:text-[var(--blue-bright)]">
                      {c.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                      {c.blurb}
                    </span>
                    <span className="mt-1 block text-[11px] font-semibold text-[var(--blue-bright)]">
                      {count} позиций →
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <ReviewsSection />

      {/* 7. Brands overview */}
      <section className="container-kp py-12 md:py-14">
        <h2 className="section-title">Марки</h2>
        <p className="section-sub">Переход в каталог бренда и моделей</p>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {Object.entries(BRANDS).map(([id, title]) => (
            <Link
              key={id}
              href={`/catalog?brand=${id}`}
              className="card card-hover group relative overflow-hidden p-6"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />
              <div className="relative">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--blue-bright)]">
                  Brand catalog
                </div>
                <div className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--text-h)]">
                  {title}
                </div>
                <div className="mt-2 text-sm text-[var(--text-muted)]">
                  Модели и запчасти →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-kp pb-20">
        <div className="card relative overflow-hidden p-8 md:flex md:items-center md:justify-between md:gap-8 md:p-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-rose-600/15" />
          <div className="relative max-w-xl">
            <h2 className="text-2xl font-bold text-[var(--text-h)] md:text-3xl">
              Нужен подбор по VIN?
            </h2>
            <p className="mt-2 text-[var(--text)]">
              Напишите в Telegram или оставьте заказ — подтвердим наличие и
              сроки.
            </p>
          </div>
          <div className="relative mt-6 flex flex-wrap gap-3 md:mt-0">
            <a
              href="https://t.me/KorePartsBot"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              @KorePartsBot
            </a>
            <Link href="/contacts" className="btn btn-ghost">
              Контакты
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
