import Link from "next/link";
import { TELEGRAM_URL } from "@/lib/constants";
import { CATEGORIES } from "@/lib/products";

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
            Премиальный магазин запчастей Kia, Hyundai и Genesis. OEM, доставка
            по РФ, подбор по VIN.
          </p>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent btn-sm mt-4"
          >
            ✈️ @KorePartsBot
          </a>
        </div>

        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-h)]">
            Магазин
          </div>
          <div className="flex flex-col gap-2.5 text-sm">
            <Link href="/catalog" className="hover:text-[var(--blue-bright)]">
              Каталог
            </Link>
            <Link href="/vin" className="hover:text-[var(--blue-bright)]">
              VIN-подбор
            </Link>
            <Link href="/cart" className="hover:text-[var(--blue-bright)]">
              Корзина
            </Link>
            <Link href="/checkout" className="hover:text-[var(--blue-bright)]">
              Оформление
            </Link>
          </div>
        </div>

        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-h)]">
            Категории
          </div>
          <div className="flex flex-col gap-2.5 text-sm">
            {Object.entries(CATEGORIES)
              .slice(0, 5)
              .map(([id, c]) => (
                <Link
                  key={id}
                  href={`/catalog?category=${id}`}
                  className="hover:text-[var(--blue-bright)]"
                >
                  {c.emoji} {c.title}
                </Link>
              ))}
          </div>
        </div>

        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-h)]">
            Покупателям
          </div>
          <div className="flex flex-col gap-2.5 text-sm">
            <Link href="/delivery" className="hover:text-[var(--blue-bright)]">
              Доставка и оплата
            </Link>
            <Link href="/contacts" className="hover:text-[var(--blue-bright)]">
              Контакты
            </Link>
            <Link href="/vin" className="hover:text-[var(--blue-bright)]">
              Подбор по VIN
            </Link>
            <a
              href={TELEGRAM_URL}
              className="hover:text-[var(--blue-bright)]"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram-бот
            </a>
          </div>
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
