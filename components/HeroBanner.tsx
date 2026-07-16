import Link from "next/link";
import { QUICK_SEARCHES } from "@/lib/nav";
import { BRANDS, PRODUCTS } from "@/lib/products";
import { SearchBox } from "./SearchBox";

export function HeroBanner() {
  const brandEntries = Object.entries(BRANDS) as [string, string][];

  return (
    <section className="hero-banner relative overflow-hidden border-b border-[var(--border)] bg-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(37,99,235,0.1),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_100%_60%,rgba(225,29,72,0.06),transparent_50%)]" />
      </div>

      <div className="container-kp relative z-10 py-10 md:py-14 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--blue-bright)]">
              {PRODUCTS.length}+ запчастей · доставка по РФ
            </div>
            <h1 className="text-3xl font-black leading-[1.12] tracking-[-0.03em] text-[var(--text-h)] sm:text-4xl lg:text-[2.65rem]">
              Запчасти для{" "}
              <span className="bg-gradient-to-r from-[#2563eb] via-[#1d4ed8] to-[#e11d48] bg-clip-text text-transparent">
                Kia · Hyundai · Genesis · SsangYong
              </span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
              Каталог с OEM-артикулами, подбор по VIN и заявка на деталь под
              заказ. Оригинал и проверенные аналоги.
            </p>

            <div className="mt-6 max-w-xl">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-2 shadow-[0_12px_36px_rgba(15,23,42,0.08)] sm:p-2.5">
                <SearchBox placeholder="Артикул OEM, название или модель…" />
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <span className="mr-0.5">Часто ищут:</span>
                {QUICK_SEARCHES.map((t) => (
                  <Link
                    key={t}
                    href={`/catalog?q=${encodeURIComponent(t)}`}
                    className="rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-2.5 py-1 text-[var(--text)] transition hover:border-blue-300 hover:text-[var(--blue-bright)]"
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
              <Link href="/request" className="btn btn-accent">
                Оставить заявку
              </Link>
              <Link href="/vin" className="btn btn-ghost">
                Подбор по VIN
              </Link>
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
            {brandEntries.map(([id, title], i) => (
              <Link
                key={id}
                href={`/catalog?brand=${id}`}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div
                  className={`absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl opacity-70 ${
                    i % 4 === 0
                      ? "bg-rose-200/60"
                      : i % 4 === 1
                        ? "bg-blue-200/60"
                        : i % 4 === 2
                          ? "bg-violet-200/50"
                          : "bg-teal-200/50"
                  }`}
                />
                <div className="relative flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--blue-bright)]">
                      Марка
                    </div>
                    <div className="mt-0.5 text-xl font-extrabold text-[var(--text-h)]">
                      {title}
                    </div>
                    <div className="mt-1 text-xs text-[var(--text-muted)]">
                      Каталог и модели →
                    </div>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--bg-muted)] text-lg text-[var(--text-h)] transition group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-[var(--blue-bright)]">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-2 border-t border-[var(--border)] pt-6 sm:grid-cols-3">
          {[
            { k: "OEM-артикулы", v: "Как у официального дилера" },
            { k: "Доставка по РФ", v: "СДЭК, Boxberry, ПВЗ" },
            { k: "Заявка и кабинет", v: "Подбор, заказы, история" },
          ].map((item) => (
            <div
              key={item.k}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]/70 px-4 py-3 text-center sm:text-left"
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--blue-bright)]">
                {item.k}
              </div>
              <div className="mt-0.5 text-sm font-medium text-[var(--text-h)]">
                {item.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
