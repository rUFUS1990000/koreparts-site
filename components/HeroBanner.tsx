import Link from "next/link";
import { QUICK_SEARCHES } from "@/lib/nav";
import { BRANDS, PRODUCTS } from "@/lib/products";
import { SearchBox } from "./SearchBox";

export function HeroBanner() {
  return (
    <section className="hero-banner relative overflow-hidden border-b border-[var(--border)]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[var(--bg)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-5%,rgba(37,99,235,0.26),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_95%_70%,rgba(225,29,72,0.1),transparent_50%)]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--bg)] to-transparent" />
      </div>

      <div className="container-kp relative z-10 py-10 md:py-14 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          {/* Left: copy + search */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--blue-bright)]">
              Интернет-магазин автозапчастей
            </div>
            <h1 className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.75rem]">
              Запчасти для{" "}
              <span className="bg-gradient-to-r from-[#93c5fd] via-[#60a5fa] to-[#fb7185] bg-clip-text text-transparent">
                Kia · Hyundai · Genesis
              </span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400 md:text-base">
              {PRODUCTS.length}+ позиций с OEM-артикулами. Выберите марку,
              модель или раздел каталога — как на Autodoc, только для корейских
              авто.
            </p>

            <div className="mt-6 max-w-xl">
              <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)]/95 p-2 shadow-[0_16px_48px_rgba(0,0,0,0.4)] sm:p-2.5">
                <SearchBox placeholder="Артикул OEM, название или модель…" />
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span className="mr-0.5">Часто ищут:</span>
                {QUICK_SEARCHES.map((t) => (
                  <Link
                    key={t}
                    href={`/catalog?q=${encodeURIComponent(t)}`}
                    className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-slate-300 transition hover:border-[var(--blue-bright)]/40 hover:text-[var(--blue-bright)]"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link href="/catalog" className="btn btn-primary">
                Открыть каталог
              </Link>
              <Link
                href="/vin"
                className="btn btn-ghost border-white/12 bg-white/5 text-white hover:bg-white/10"
              >
                Подбор по VIN
              </Link>
            </div>
          </div>

          {/* Right: brand cards quick pick */}
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {(Object.entries(BRANDS) as [string, string][]).map(
              ([id, title], i) => (
                <Link
                  key={id}
                  href={`/catalog?brand=${id}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-md transition hover:border-[var(--blue-bright)]/40 hover:bg-black/50"
                >
                  <div
                    className={`absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl transition group-hover:opacity-100 ${
                      i === 0
                        ? "bg-rose-500/25"
                        : i === 1
                          ? "bg-blue-500/25"
                          : "bg-violet-500/25"
                    }`}
                  />
                  <div className="relative flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--blue-bright)]">
                        Марка
                      </div>
                      <div className="mt-0.5 text-xl font-extrabold text-white">
                        {title}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        Запчасти и подкаталоги моделей →
                      </div>
                    </div>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-lg text-white transition group-hover:bg-[var(--blue-dim)] group-hover:text-[var(--blue-bright)]">
                      →
                    </span>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-10 grid gap-2 border-t border-white/8 pt-6 sm:grid-cols-3">
          {[
            { k: "OEM-артикулы", v: "Как у официального дилера" },
            { k: "Доставка по РФ", v: "СДЭК, Boxberry, ПВЗ" },
            { k: "Каталоги", v: "По марке, модели и разделу" },
          ].map((item) => (
            <div
              key={item.k}
              className="rounded-xl border border-white/6 bg-white/[0.03] px-4 py-3 text-center sm:text-left"
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--blue-bright)]">
                {item.k}
              </div>
              <div className="mt-0.5 text-sm text-white/85">{item.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
