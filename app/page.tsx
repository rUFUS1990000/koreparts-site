import Link from "next/link";
import type { Metadata } from "next";
import { BrandModelSelector } from "@/components/BrandModelSelector";
import { CategoryGrid } from "@/components/CategoryGrid";
import { HeroBanner } from "@/components/HeroBanner";
import { PopularSections } from "@/components/PopularSections";
import { ProductCard } from "@/components/ProductCard";
import { PromosSection } from "@/components/PromosSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { VinLookup } from "@/components/VinLookup";
import { TELEGRAM_URL } from "@/lib/constants";
import { BRANDS, popularProducts, PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "KoreParts — запчасти Kia, Hyundai, Genesis, SsangYong",
  description:
    "Интернет-магазин автозапчастей для корейских автомобилей. Каталог, OEM, заявка на подбор, доставка по России.",
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      <PopularSections />

      <div className="pb-12 md:pb-14">
        <BrandModelSelector variant="panel" />
      </div>

      <section className="border-y border-[var(--border)] bg-white py-12 md:py-14">
        <div className="container-kp">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="section-title">Каталоги запчастей</h2>
              <p className="section-sub">
                Тормоза, подвеска, двигатель, фильтры, электрика и кузов
              </p>
            </div>
            <Link href="/catalog" className="btn btn-ghost btn-sm">
              Весь каталог →
            </Link>
          </div>
          <CategoryGrid variant="large" />
        </div>
      </section>

      <section className="container-kp py-12 md:py-14">
        <VinLookup variant="section" />
      </section>

      <PromosSection />

      <section className="container-kp py-12 md:py-14">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Хиты продаж</h2>
            <p className="section-sub">
              Популярные позиции из наличия — {PRODUCTS.length}+ в каталоге
            </p>
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
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <ReviewsSection />

      <section className="border-y border-[var(--border)] bg-white py-12 md:py-14">
        <div className="container-kp">
          <h2 className="section-title">Марки</h2>
          <p className="section-sub">Переход в каталог бренда</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(BRANDS).map(([id, title]) => (
              <Link
                key={id}
                href={`/catalog?brand=${id}`}
                className="card card-hover group relative overflow-hidden p-5"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/15" />
                <div className="relative">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--blue-bright)]">
                    Каталог
                  </div>
                  <div className="mt-1.5 text-2xl font-extrabold tracking-tight text-[var(--text-h)]">
                    {title}
                  </div>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">
                    Модели и запчасти →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-kp py-12 md:pb-20">
        <div className="card relative overflow-hidden p-8 md:flex md:items-center md:justify-between md:gap-8 md:p-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-rose-50" />
          <div className="relative max-w-xl">
            <h2 className="text-2xl font-bold text-[var(--text-h)] md:text-3xl">
              Нужен подбор или деталь под заказ?
            </h2>
            <p className="mt-2 text-[var(--text)]">
              Оставьте заявку или напишите в Telegram — подтвердим наличие и
              сроки доставки.
            </p>
          </div>
          <div className="relative mt-6 flex flex-wrap gap-3 md:mt-0">
            <Link href="/request" className="btn btn-accent">
              Оставить заявку
            </Link>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              @KorePartsBot
            </a>
            <Link href="/account" className="btn btn-ghost">
              Кабинет
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
