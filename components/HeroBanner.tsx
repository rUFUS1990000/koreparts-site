import Link from "next/link";
import { BRANDS, PRODUCTS } from "@/lib/products";
import { SearchBox } from "./SearchBox";

export function HeroBanner() {
  return (
    <section className="hero-banner relative overflow-hidden border-b border-[var(--border)]">
      {/* Soft dark background — Autodoc-like clean, no heavy photo clutter */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[var(--bg)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.28),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_60%,rgba(225,29,72,0.12),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent" />
      </div>

      <div className="container-kp relative z-10 py-14 md:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--blue-bright)] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--red-bright)] shadow-[0_0_8px_#fb7185]" />
            Запчасти для корейских авто
          </div>

          <h1 className="text-4xl font-black leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.25rem]">
            Найдите деталь{" "}
            <span className="bg-gradient-to-r from-[#93c5fd] via-[#60a5fa] to-[#fb7185] bg-clip-text text-transparent">
              за секунды
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">
            {PRODUCTS.length}+ позиций с OEM-артикулами для Kia, Hyundai и
            Genesis. Каталог как в Autodoc — просто и понятно.
          </p>

          {/* Big search — Autodoc style centerpiece */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)]/90 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-3">
              <SearchBox placeholder="Артикул OEM, название или модель…" />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span>Популярно:</span>
              {["колодки", "фильтр масляный", "амортизатор", "свечи"].map(
                (t) => (
                  <Link
                    key={t}
                    href={`/catalog?q=${encodeURIComponent(t)}`}
                    className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-slate-300 transition hover:border-[var(--blue-bright)]/40 hover:text-[var(--blue-bright)]"
                  >
                    {t}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/catalog" className="btn btn-primary min-w-[9.5rem]">
              Весь каталог
            </Link>
            <Link
              href="/vin"
              className="btn btn-ghost border-white/12 bg-white/5 text-white hover:bg-white/10"
            >
              Подбор по VIN
            </Link>
          </div>

          {/* Brand row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {Object.entries(BRANDS).map(([id, title]) => (
              <Link
                key={id}
                href={`/catalog?brand=${id}`}
                className="rounded-full border border-white/10 bg-black/30 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur-md transition hover:border-[var(--blue-bright)] hover:text-[var(--blue-bright)]"
              >
                {title}
              </Link>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-3 border-t border-white/8 pt-8 sm:grid-cols-3">
          {[
            { k: "OEM-артикулы", v: "Как у официального дилера" },
            { k: "Доставка по РФ", v: "СДЭК, Boxberry, ПВЗ" },
            { k: "Telegram-бот", v: "@KorePartsBot — тот же каталог" },
          ].map((item) => (
            <div
              key={item.k}
              className="rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3.5 text-center backdrop-blur-sm"
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--blue-bright)]">
                {item.k}
              </div>
              <div className="mt-1 text-sm text-white/85">{item.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
