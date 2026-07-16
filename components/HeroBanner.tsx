import Image from "next/image";
import Link from "next/link";
import {
  brandTitle,
  CATEGORIES,
  formatPrice,
  getProduct,
  modelTitle,
  popularProducts,
  PRODUCTS,
} from "@/lib/products";

/** Крупный баннер с превью реальной детали из каталога */
export function HeroBanner() {
  const featured =
    getProduct("581011ra00") ||
    popularProducts[0] ||
    PRODUCTS[0];

  if (!featured) return null;

  const cat = CATEGORIES[featured.category];

  return (
    <section className="hero-banner relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_40%,rgba(37,99,235,0.08),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_10%_90%,rgba(225,29,72,0.05),transparent_50%)]" />

      <div className="container-kp relative z-10 py-8 md:py-12 lg:py-14">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
          {/* Copy */}
          <div className="flex flex-col justify-center">
            <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--blue-bright)]">
              Хит · в наличии {featured.stock} шт.
            </div>
            <h1 className="text-3xl font-black leading-[1.12] tracking-[-0.03em] text-[var(--text-h)] sm:text-4xl lg:text-[2.55rem]">
              Запчасти для корейских авто
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
              {PRODUCTS.length}+ позиций с OEM. Оригинал и аналоги для Kia,
              Hyundai, Genesis и SsangYong. Доставка по России.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link href="/catalog" className="btn btn-primary">
                Открыть каталог
              </Link>
              <Link href="/request" className="btn btn-accent">
                Оставить заявку
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-muted)]">
              <span>
                <strong className="text-[var(--text-h)]">OEM</strong> артикулы
              </span>
              <span>
                <strong className="text-[var(--text-h)]">2–7</strong> дней
                доставка
              </span>
              <span>
                <strong className="text-[var(--text-h)]">Подбор</strong> по VIN
              </span>
            </div>
          </div>

          {/* Big product preview card */}
          <Link
            href={`/product/${featured.id}`}
            className="group relative flex min-h-[280px] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-muted)] shadow-[0_20px_50px_rgba(15,23,42,0.1)] transition hover:border-blue-300 hover:shadow-[0_24px_56px_rgba(37,99,235,0.14)] md:min-h-[340px]"
          >
            <div className="absolute inset-0">
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                priority
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-slate-900/10" />
            </div>

            <div className="relative mt-auto flex w-full flex-col gap-3 p-5 md:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-red">Хит продаж</span>
                {cat ? (
                  <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                    {cat.title}
                  </span>
                ) : null}
              </div>
              <div>
                <h2 className="text-xl font-bold leading-snug text-white md:text-2xl">
                  {featured.name}
                </h2>
                <p className="mt-1 text-sm text-white/75">
                  {brandTitle(featured.brand)}{" "}
                  {modelTitle(featured.brand, featured.model)} · OEM{" "}
                  <span className="font-mono text-blue-200">{featured.oem}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="text-3xl font-black tracking-tight text-white">
                  {formatPrice(featured.price)}
                </div>
                <span className="btn btn-primary btn-sm shadow-lg">
                  Смотреть деталь →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
