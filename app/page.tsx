import Link from "next/link";
import type { Metadata } from "next";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductCard } from "@/components/ProductCard";
import { PromosSection } from "@/components/PromosSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SearchBox } from "@/components/SearchBox";
import { VinLookup } from "@/components/VinLookup";
import {
  BRANDS,
  CATEGORIES,
  popularProducts,
  PRODUCTS,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "KoreParts — премиум запчасти Kia, Hyundai, Genesis",
  description:
    "Интернет-магазин автозапчастей для корейских автомобилей. Каталог с OEM, корзина, доставка по России. Тот же ассортимент, что в Telegram-боте.",
};

const benefits = [
  {
    title: "Фокус на Korea",
    text: "Только Kia, Hyundai и Genesis — подбор по модели и VIN без ошибок совместимости.",
    icon: "🇰🇷",
  },
  {
    title: "OEM в каждой карточке",
    text: "Артикулы как у дилера. Сверяйте с оригиналом за секунду.",
    icon: "🏷",
  },
  {
    title: "Единый каталог с ботом",
    text: "Те же товары, что в @KorePartsBot — онлайн или в Telegram.",
    icon: "🤖",
  },
  {
    title: "Доставка по всей РФ",
    text: "СДЭК, Boxberry, ПВЗ. Оплата при получении или перевод.",
    icon: "🚚",
  },
];

export default function HomePage() {
  const cats = Object.entries(CATEGORIES);

  return (
    <>
      <HeroBanner />

      <section className="container-kp -mt-2 pb-4 pt-8 md:pt-10">
        <div className="card p-4 md:p-5">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--blue-bright)]">
            Быстрый поиск
          </div>
          <SearchBox />
        </div>
      </section>

      <section className="container-kp py-12 md:py-16">
        <VinLookup variant="section" />
      </section>

      <PromosSection />

      <section className="container-kp py-16">
        <h2 className="section-title">Почему выбирают KoreParts</h2>
        <p className="section-sub">
          Премиальный опыт покупки в стиле корейских автобрендов — без лишнего
          шума, только нужные детали.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="card card-hover p-5">
              <div className="mb-3 text-2xl">{b.icon}</div>
              <h3 className="mb-1.5 font-bold text-[var(--text-h)]">{b.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                {b.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)]/80 py-16">
        <div className="container-kp">
          <h2 className="section-title">Категории</h2>
          <p className="section-sub">
            От расходников до крупных узлов — всё для корейского автопарка.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cats.map(([id, c]) => {
              const count = PRODUCTS.filter((p) => p.category === id).length;
              return (
                <Link
                  key={id}
                  href={`/catalog?category=${id}`}
                  className="card card-hover flex items-start gap-3 p-4"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--bg-muted)] text-xl ring-1 ring-[var(--border)]">
                    {c.emoji}
                  </span>
                  <span>
                    <span className="block font-semibold text-[var(--text-h)]">
                      {c.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                      {c.blurb} · {count} шт.
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-kp py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Хиты продаж</h2>
            <p className="section-sub">То, что берут чаще всего</p>
          </div>
          <Link href="/catalog?hits=1&sort=popular" className="btn btn-ghost btn-sm">
            Все хиты
          </Link>
        </div>
        <div className="grid-products">
          {popularProducts.map((p, i) => (
            <div key={p.id} className="reveal" style={{ animationDelay: `${i * 50}ms` }}>
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
