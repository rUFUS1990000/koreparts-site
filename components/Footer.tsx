import Link from "next/link";
import { TELEGRAM_URL } from "@/lib/constants";
import { POPULAR_SECTIONS } from "@/lib/nav";
import { BRANDS, CATEGORIES, MODELS } from "@/lib/products";
import type { BrandId, CategoryId } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcons";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="container-kp grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 text-xl font-bold text-[var(--text-h)]">
            Kore
            <span className="bg-gradient-to-r from-[var(--blue-bright)] to-[var(--red-bright)] bg-clip-text text-transparent">
              Parts
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Запчасти Kia, Hyundai и Genesis. Каталоги по маркам и моделям, OEM,
            доставка по РФ.
          </p>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent btn-sm mt-4"
          >
            @KorePartsBot
          </a>
        </div>

        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-h)]">
            Меню
          </div>
          <div className="flex flex-col gap-2.5 text-sm">
            <Link href="/" className="hover:text-[var(--blue-bright)]">
              Главная
            </Link>
            <Link href="/catalog" className="hover:text-[var(--blue-bright)]">
              Каталог
            </Link>
            <Link href="/delivery" className="hover:text-[var(--blue-bright)]">
              Доставка
            </Link>
            <Link href="/contacts" className="hover:text-[var(--blue-bright)]">
              Контакты
            </Link>
            <Link href="/cart" className="hover:text-[var(--blue-bright)]">
              Корзина
            </Link>
            <Link href="/vin" className="hover:text-[var(--blue-bright)]">
              VIN-подбор
            </Link>
          </div>
        </div>

        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-h)]">
            Каталоги
          </div>
          <div className="flex flex-col gap-2 text-sm">
            {(
              Object.entries(CATEGORIES) as [
                CategoryId,
                (typeof CATEGORIES)[CategoryId],
              ][]
            )
              .slice(0, 6)
              .map(([id, c]) => (
                <Link
                  key={id}
                  href={`/catalog?category=${id}`}
                  className="flex items-center gap-2 hover:text-[var(--blue-bright)]"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-[var(--bg-muted)] ring-1 ring-[var(--border)]">
                    <CategoryIcon id={id} size={16} />
                  </span>
                  {c.title}
                </Link>
              ))}
          </div>
        </div>

        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-h)]">
            Марки и модели
          </div>
          <div className="space-y-3 text-sm">
            {(Object.keys(BRANDS) as BrandId[]).map((id) => (
              <div key={id}>
                <Link
                  href={`/catalog?brand=${id}`}
                  className="font-semibold text-[var(--text-h)] hover:text-[var(--blue-bright)]"
                >
                  {BRANDS[id]}
                </Link>
                <div className="mt-1 flex flex-wrap gap-1">
                  {MODELS[id].slice(0, 4).map((m) => (
                    <Link
                      key={m.id}
                      href={`/catalog?brand=${id}&model=${m.id}`}
                      className="rounded-full bg-[var(--bg)] px-2 py-0.5 text-[11px] text-[var(--text-muted)] ring-1 ring-[var(--border)] hover:text-[var(--blue-bright)]"
                    >
                      {m.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="container-kp flex flex-wrap gap-2 py-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Популярное:
          </span>
          {POPULAR_SECTIONS.slice(0, 6).map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-muted)] hover:border-[var(--blue-bright)]/40 hover:text-[var(--blue-bright)]"
            >
              {s.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="divider" />
      <div className="container-kp flex flex-col gap-2 py-5 text-center text-xs text-[var(--text-muted)] sm:flex-row sm:justify-between sm:text-left">
        <span>© {new Date().getFullYear()} KoreParts. Все права защищены.</span>
        <span>Kia · Hyundai · Genesis · OEM &amp; аналоги</span>
      </div>
    </footer>
  );
}
