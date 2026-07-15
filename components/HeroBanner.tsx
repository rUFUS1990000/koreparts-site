import Image from "next/image";
import Link from "next/link";
import { BRANDS, CATEGORIES, PRODUCTS } from "@/lib/products";

const HERO_IMG =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80";

export function HeroBanner() {
  return (
    <section className="hero-banner relative overflow-hidden border-b border-[var(--border)]">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMG}
          alt="Премиальный автомобиль"
          fill
          priority
          className="object-cover object-[center_40%] scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(5,7,13,0.96)_0%,rgba(5,7,13,0.88)_42%,rgba(5,7,13,0.55)_68%,rgba(5,7,13,0.75)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(37,99,235,0.28),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_80%,rgba(225,29,72,0.18),transparent_45%)]" />
        {/* grid lines */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "linear-gradient(180deg, black 0%, transparent 90%)",
          }}
        />
        {/* bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent" />
      </div>

      <div className="container-kp relative z-10 py-16 md:py-20 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:gap-14">
          {/* Left copy */}
          <div className="max-w-2xl space-y-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--blue-bright)] backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--red-bright)] shadow-[0_0_10px_#fb7185]" />
                Official KoreParts Store
              </span>
              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-[var(--red-bright)] backdrop-blur-md">
                Premium Korea
              </span>
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.65rem]">
              Запчасти
              <span className="block bg-gradient-to-r from-[#93c5fd] via-[#60a5fa] to-[#fb7185] bg-clip-text text-transparent">
                уровня дилера
              </span>
              <span className="mt-1 block text-[0.72em] font-extrabold text-white/90">
                Kia · Hyundai · Genesis
              </span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-slate-300 md:text-lg">
              {PRODUCTS.length} позиций с OEM-артикулами: тормоза, подвеска,
              фильтры, масла и электрика. Заказ онлайн за 2 минуты — доставка по
              всей России.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="btn btn-primary min-w-[10rem] shadow-[0_0_40px_rgba(37,99,235,0.45)]"
              >
                Открыть каталог
              </Link>
              <Link
                href="/vin"
                className="btn btn-ghost border-white/15 bg-white/5 text-white backdrop-blur-md hover:bg-white/10"
              >
                Подбор по VIN
              </Link>
              <a
                href="https://t.me/KorePartsBot"
                target="_blank"
                rel="noreferrer"
                className="btn btn-accent"
              >
                Telegram-бот
              </a>
            </div>

            {/* Brand pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.entries(BRANDS).map(([id, title]) => (
                <Link
                  key={id}
                  href={`/catalog?brand=${id}`}
                  className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-md transition hover:border-[var(--blue-bright)] hover:text-[var(--blue-bright)]"
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>

          {/* Right visual panel */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-500/30 via-transparent to-rose-500/25 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/40 p-1 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.35rem] border border-white/5 bg-gradient-to-b from-white/[0.07] to-transparent p-5 md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--blue-bright)]">
                      Live catalog
                    </div>
                    <div className="mt-1 text-lg font-bold text-white">
                      В наличии сейчас
                    </div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-rose-600 px-3 py-2 text-center text-xs font-black text-white shadow-lg">
                    KP
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Stat value={String(PRODUCTS.length)} label="товаров" />
                  <Stat value={String(Object.keys(BRANDS).length)} label="бренда" />
                  <Stat
                    value={String(Object.keys(CATEGORIES).length)}
                    label="категорий"
                  />
                </div>

                <div className="mt-5 space-y-2.5">
                  {[
                    { t: "OEM-артикулы", d: "Как у официального дилера" },
                    { t: "Быстрый заказ", d: "Корзина + оформление онлайн" },
                    { t: "Подбор по VIN", d: "В боте @KorePartsBot" },
                  ].map((row) => (
                    <div
                      key={row.t}
                      className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-500/20 text-sm text-[var(--blue-bright)]">
                        ✓
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {row.t}
                        </div>
                        <div className="text-xs text-slate-400">{row.d}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/catalog?sort=popular"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
                >
                  Смотреть хиты продаж
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            {/* floating chips */}
            <div className="absolute -left-3 top-8 hidden rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md sm:block">
              ⚙️ ГРМ · фильтры
            </div>
            <div className="absolute -right-2 bottom-24 hidden rounded-full border border-rose-400/20 bg-black/50 px-3 py-1.5 text-xs font-semibold text-rose-200 backdrop-blur-md md:block">
              🛑 Колодки · диски
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
          {[
            { k: "Доставка", v: "По всей России · ТК и ПВЗ" },
            { k: "Оплата", v: "При получении или перевод" },
            { k: "Поддержка", v: "Менеджер в Telegram" },
          ].map((item) => (
            <div
              key={item.k}
              className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3 backdrop-blur-md"
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--blue-bright)]">
                {item.k}
              </div>
              <div className="mt-1 text-sm font-medium text-white/90">
                {item.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 px-2 py-3 text-center backdrop-blur-sm">
      <div className="text-xl font-black text-white md:text-2xl">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400">
        {label}
      </div>
    </div>
  );
}
