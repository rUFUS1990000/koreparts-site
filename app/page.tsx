import Link from "next/link";
import type { Metadata } from "next";
import { CategoryGrid } from "@/components/CategoryGrid";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductCard } from "@/components/ProductCard";
import { VinLookup } from "@/components/VinLookup";
import { TELEGRAM_URL } from "@/lib/constants";
import { BRANDS, popularProducts, PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "KoreParts — запчасти Kia, Hyundai, Genesis, SsangYong",
  description:
    "Интернет-магазин автозапчастей для корейских автомобилей. Каталог, OEM, заявка на подбор, доставка по России.",
};

export default function HomePage() {
  const hits = popularProducts.slice(0, 4);

  return (
    <>
      <HeroBanner />

      {/* Категории */}
      <section className="container-kp py-10 md:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Каталоги</h2>
            <p className="section-sub">Выберите раздел — {PRODUCTS.length}+ позиций</p>
          </div>
          <Link href="/catalog" className="btn btn-ghost btn-sm">
            Весь каталог →
          </Link>
        </div>
        <CategoryGrid variant="large" />
      </section>

      {/* VIN-подбор */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)] py-10 md:py-12">
        <div className="container-kp">
          <VinLookup variant="section" />
        </div>
      </section>

      {/* Марки */}
      <section className="container-kp py-10 md:py-12">
        <h2 className="section-title">Марки</h2>
        <p className="section-sub">Переход в каталог бренда</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(BRANDS).map(([id, title]) => (
            <Link
              key={id}
              href={`/catalog?brand=${id}`}
              className="card card-hover group p-4 text-center sm:p-5"
            >
              <div className="text-lg font-extrabold text-[var(--text-h)] group-hover:text-[var(--blue-bright)] sm:text-xl">
                {title}
              </div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">
                Запчасти →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Хиты */}
      <section className="container-kp py-10 md:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Популярное</h2>
            <p className="section-sub">Часто заказывают из наличия</p>
          </div>
          <Link
            href="/catalog?hits=1&sort=popular"
            className="btn btn-ghost btn-sm"
          >
            Все хиты
          </Link>
        </div>
        <div className="grid-products">
          {hits.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-kp pb-14 md:pb-16">
        <div className="card relative overflow-hidden p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--blue-dim)] via-transparent to-[var(--red-dim)]" />
          <div className="relative max-w-lg">
            <h2 className="text-xl font-bold text-[var(--text-h)] md:text-2xl">
              Не нашли деталь?
            </h2>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
              Оставьте заявку или напишите в Telegram — подберём по VIN/OEM.
            </p>
          </div>
          <div className="relative mt-5 flex flex-wrap gap-2 md:mt-0">
            <Link href="/request" className="btn btn-accent">
              Оставить заявку
            </Link>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Telegram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
