import Link from "next/link";
import {
  EMAIL_DISPLAY,
  TELEGRAM_URL,
  WORK_HOURS,
} from "@/lib/constants";
import { MAIN_NAV } from "@/lib/nav";
import { BRANDS, CATEGORIES, PRODUCTS } from "@/lib/products";
import type { BrandId, CategoryId } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcons";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      {/* CTA strip */}
      <div className="border-b border-[var(--border)] bg-gradient-to-r from-[var(--blue-dim)] via-[var(--bg-elevated)] to-[var(--red-dim)]">
        <div className="container-kp flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <div>
            <div className="text-lg font-bold text-[var(--text-h)]">
              Не нашли нужную деталь?
            </div>
            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
              Оставьте заявку — подберём по VIN, OEM или описанию за 15–30 минут
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/request" className="btn btn-accent btn-sm">
              Оставить заявку
            </Link>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>

      <div className="container-kp grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="mb-3 text-xl font-bold text-[var(--text-h)]">
            Kore
            <span className="bg-gradient-to-r from-[var(--blue-bright)] to-[var(--red)] bg-clip-text text-transparent">
              Parts
            </span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
            Интернет-магазин запчастей для корейских автомобилей.{" "}
            {PRODUCTS.length}+ позиций с OEM, доставка по России.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--text)]">
            <li>
              <span className="text-[var(--text-muted)]">Telegram: </span>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--blue-bright)] hover:underline"
              >
                @KorePartsBot
              </a>
            </li>
            <li>
              <span className="text-[var(--text-muted)]">Email: </span>
              <a
                href={`mailto:${EMAIL_DISPLAY}`}
                className="font-semibold hover:text-[var(--blue-bright)]"
              >
                {EMAIL_DISPLAY}
              </a>
            </li>
            <li>
              <span className="text-[var(--text-muted)]">Режим: </span>
              {WORK_HOURS}
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-h)]">
            Магазин
          </div>
          <div className="flex flex-col gap-2.5 text-sm">
            <Link href="/" className="hover:text-[var(--blue-bright)]">
              Главная
            </Link>
            {MAIN_NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-[var(--blue-bright)]"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/account" className="hover:text-[var(--blue-bright)]">
              Личный кабинет
            </Link>
            <Link href="/cart" className="hover:text-[var(--blue-bright)]">
              Корзина
            </Link>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-h)]">
            Каталоги
          </div>
          <div className="flex flex-col gap-2 text-sm">
            {(
              Object.entries(CATEGORIES) as [
                CategoryId,
                (typeof CATEGORIES)[CategoryId],
              ][]
            ).map(([id, c]) => (
              <Link
                key={id}
                href={`/catalog?category=${id}`}
                className="flex items-center gap-2 hover:text-[var(--blue-bright)]"
              >
                <span className="grid h-6 w-6 place-items-center rounded-md bg-[var(--bg-muted)] ring-1 ring-[var(--border)]">
                  <CategoryIcon id={id} size={14} />
                </span>
                {c.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-h)]">
            Марки
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(BRANDS) as BrandId[]).map((id) => (
              <Link
                key={id}
                href={`/catalog?brand=${id}`}
                className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-sm font-semibold text-[var(--text-h)] shadow-sm transition hover:border-blue-300 hover:text-[var(--blue-bright)]"
              >
                {BRANDS[id]}
              </Link>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]/60 p-4">
            <div className="text-sm font-semibold text-[var(--text-h)]">
              Быстрый заказ
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
              Добавьте товары в корзину или оставьте заявку — менеджер
              подтвердит наличие и сроки.
            </p>
            <Link
              href="/checkout"
              className="mt-3 inline-flex text-sm font-semibold text-[var(--blue-bright)] hover:underline"
            >
              Оформить заказ →
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--bg-muted)]/40">
        <div className="container-kp flex flex-col gap-2 py-4 text-center text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span>
            © {new Date().getFullYear()} KoreParts. Все права защищены.
          </span>
          <span>
            Kia · Hyundai · Genesis · SsangYong · OEM и аналоги
          </span>
        </div>
      </div>
    </footer>
  );
}
