"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { TELEGRAM_CHANNEL_URL, TELEGRAM_URL } from "@/lib/constants";
import { MAIN_NAV } from "@/lib/nav";
import { CatalogsMenu } from "./CatalogsMenu";
import { SiteLogo } from "./SiteLogo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const { totalQty } = useCart();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-b border-[var(--border)] shadow-sm">
        <div className="container-kp flex h-[4rem] items-center gap-3 md:h-[4.25rem] md:gap-5">
          <SiteLogo height={36} priority />

          <nav className="ml-2 hidden items-center gap-0.5 lg:flex">
            <CatalogsMenu />
            {MAIN_NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  isActive(l.href)
                    ? "bg-[var(--blue-dim)] text-[var(--blue-bright)]"
                    : "text-[var(--text)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-h)]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />

            <a
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm hidden md:inline-flex"
              title="Telegram-канал KoreParts"
              aria-label="Telegram-канал KoreParts"
            >
              📢
              <span className="ml-1.5 hidden font-semibold lg:inline">
                Канал
              </span>
            </a>

            <Link
              href="/request"
              className="btn btn-accent btn-sm hidden sm:inline-flex"
            >
              Заявка
            </Link>

            <Link
              href="/account"
              className={`btn btn-ghost btn-sm ${isActive("/account") ? "border-[var(--blue)] text-[var(--blue-bright)]" : ""}`}
              aria-label="Личный кабинет"
            >
              <UserIcon />
              <span className="ml-1.5 hidden font-semibold md:inline">
                Кабинет
              </span>
            </Link>

            <Link
              href="/cart"
              className="btn btn-ghost btn-sm relative"
              aria-label="Корзина"
            >
              <CartIcon />
              {totalQty > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--red)] px-1 text-[10px] font-bold text-white">
                  {totalQty}
                </span>
              )}
              <span className="ml-1.5 hidden font-semibold md:inline">
                Корзина
              </span>
            </Link>

            <button
              type="button"
              className="btn btn-ghost btn-sm lg:hidden"
              aria-label="Меню"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "✕" : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="max-h-[min(80vh,640px)] overflow-y-auto border-b border-[var(--border)] bg-[var(--bg-elevated)] shadow-lg lg:hidden">
          <div className="container-kp flex flex-col gap-4 py-4">
            <nav className="flex flex-col gap-0.5">
              {[
                { href: "/", label: "Главная" },
                ...MAIN_NAV,
                { href: "/account", label: "Личный кабинет" },
                { href: "/cart", label: "Корзина" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-3 font-semibold hover:bg-[var(--bg-muted)] ${
                    isActive(l.href)
                      ? "bg-[var(--blue-dim)] text-[var(--blue-bright)]"
                      : "text-[var(--text-h)]"
                  }`}
                >
                  {l.label}
                  {l.href === "/cart" && totalQty > 0 ? ` (${totalQty})` : ""}
                </Link>
              ))}
            </nav>
            <div className="divider" />
            <CatalogsMenu
              variant="mobile"
              onNavigate={() => setOpen(false)}
            />
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/request"
                onClick={() => setOpen(false)}
                className="btn btn-accent"
              >
                Оставить заявку
              </Link>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                onClick={() => setOpen(false)}
              >
                Telegram-бот
              </a>
              <a
                href={TELEGRAM_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost col-span-2"
                onClick={() => setOpen(false)}
              >
                📢 Канал t.me/KoreParts
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 8H7" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
