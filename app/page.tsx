import Link from "next/link";
import type { Metadata } from "next";
import { CategoryGrid } from "@/components/CategoryGrid";
import { CategoryIcon } from "@/components/CategoryIcons";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductCard } from "@/components/ProductCard";
import { PromosSection } from "@/components/PromosSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { VinLookup } from "@/components/VinLookup";
import { BRANDS, CATEGORIES, popularProducts, PRODUCTS } from "@/lib/products";
import type { CategoryId } from "@/lib/types";

export const metadata: Metadata = {
  title: "KoreParts — запчасти Kia, Hyundai, Genesis",
  description:
    "Интернет-магазин автозапчастей для корейских автомобилей. Каталог с OEM, корзина, доставка по России. Тот же ассортимент, что в Telegram-боте.",
};

const benefits = [
  {
    title: "Только Korea",
    text: "Kia, Hyundai и Genesis — подбор по модели и VIN без ошибок.",
    id: "engine" as CategoryId,
  },
  {
    title: "OEM в карточке",
    text: "Артикулы как у дилера. Сверяйте с оригиналом за секунду.",
    id: "filters" as CategoryId,
  },
  {
    title: "Единый каталог",
    text: "Те же товары, что в @KorePartsBot — сайт или Telegram.",
    id: "electric" as CategoryId,
  },
  {
    title: "Доставка по РФ",
    text: "СДЭК, Boxberry, ПВЗ. Оплата при получении или перевод.",
    id: "body" as CategoryId,
  },
];

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      {/* Categories — main Autodoc-style block */}
      <section className="container-kp py-14 md:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Категории запчастей</h2>
            <p className="section-sub">
              Выберите раздел — тормоза, подвеска, двигатель и другие
            </p>
          </div>
          <Link href="/catalog" className="btn btn-ghost btn-sm">
            Весь каталог →
          </Link>
        </div>
        <CategoryGrid variant="large" />
      </section>

      <section className="container-kp pb-4">
        <VinLookup variant="section" />
      </section>

      <PromosSection />

      <section className="container-kp py-14">
        <h2 className="section-title">Почему KoreParts</h2>
        <p className="section-sub">
          Чистый каталог и точный подбор — без лишнего шума
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="card card-hover p-5">
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-[var(--bg-muted)] ring-1 ring-[var(--border)]">
                <CategoryIcon id={b.id} size={32} />
              </div>
              <h3 className="mb-1.5 font-bold text-[var(--text-h)]">{b.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                {b.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed category rows with icons — Autodoc feel */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)]/60 py-14">
        <div className="container-kp">
          <h2 className="section-title">Все разделы каталога</h2>
          <p className="section-sub">
            Крупные иконки и быстрый переход к нужным деталям
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[var(--bg-muted)] ring-1 ring-[var(--border)] transition group-hover:scale-105 group-hover:ring-[var(--border-glow)]">
                    <CategoryIcon id={id} size={44} />
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

      <section className="container-kp py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Хиты продаж</h2>
            <p className="section-sub">То, что берут чаще всего</p>
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

      <ReviewsSection />

      <section className="container-kp pb-8">
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(BRANDS).map(([id, title]) => (
            <Link
              key={id}
              href={`/catalog?brand=${id}`}
              className="card card-hover group relative overflow-hidden p-6"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />
              <div className="relative">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--blue-bright)]">
                  Brand
                </div>
                <div className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--text-h)]">
                  {title}
                </div>
                <div className="mt-2 text-sm text-[var(--text-muted)]">
                  Смотреть запчасти →
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
              Напишите в Telegram или оставьте заказ на сайте — подтвердим
              наличие и сроки доставки.
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
