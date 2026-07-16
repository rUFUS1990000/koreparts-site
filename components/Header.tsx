"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { TELEGRAM_URL } from "@/lib/constants";
import { MAIN_NAV } from "@/lib/nav";
import { CatalogsMenu } from "./CatalogsMenu";
import { SearchBox } from "./SearchBox";

export function Header() {
  const pathname = usePathname();
  const { totalQty } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="hidden border-b border-[var(--border)] bg-[var(--bg-elevated)] text-xs text-[var(--text-muted)] sm:block">
        <div className="container-kp flex h-9 items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-medium text-[var(--text)]">
              Kia · Hyundai · Genesis · SsangYong
            </span>
            <Link href="/delivery" className="hover:text-[var(--blue-bright)]">
              Доставка по РФ
            </Link>
            <Link href="/request" className="hover:text-[var(--blue-bright)]">
              Подбор под заказ
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="font-semibold text-[var(--text-h)] hover:text-[var(--blue-bright)]"
            >
              Личный кабинет
            </Link>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--blue-bright)] hover:underline"
            >
              @KorePartsBot
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="glass border-b border-[var(--border)] shadow-sm">
        <div className="container-kp flex h-[3.75rem] items-center gap-3 md:h-[4.25rem] md:gap-4">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 font-bold tracking-tight"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#e11d48] text-xs font-black text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-600/20 transition group-hover:scale-105">
              KP
            </span>
            <span className="hidden text-lg text-[var(--text-h)] sm:inline">
              Kore
              <span className="bg-gradient-to-r from-[var(--blue-bright)] to-[var(--red)] bg-clip-text text-transparent">
                Parts
              </span>
            </span>
          </Link>

          <div className="mx-auto hidden min-w-0 flex-1 max-w-xl md:block lg:max-w-2xl">
            <SearchBox placeholder="Поиск: OEM, название, модель…" />
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              className="btn btn-ghost btn-sm md:hidden"
              aria-label="Поиск"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <SearchIcon />
            </button>

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
              <span className="ml-1.5 hidden font-semibold lg:inline">
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
              <span className="ml-1.5 hidden font-semibold lg:inline">
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

        {searchOpen && (
          <div className="border-t border-[var(--border)] px-4 py-3 md:hidden">
            <SearchBox autoFocus placeholder="OEM, название, модель…" />
          </div>
        )}
      </div>

      {/* Secondary nav */}
      <div className="hidden border-b border-[var(--border)] bg-[var(--bg-elevated)] lg:block">
        <div className="container-kp flex h-11 items-center gap-0.5">
          <CatalogsMenu />
          <span className="mx-1.5 h-4 w-px bg-[var(--border)]" />
          {MAIN_NAV.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "bg-[var(--blue-dim)] text-[var(--blue-bright)]"
                    : "text-[var(--text)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-h)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="ml-auto flex items-center gap-1.5">
            {(
              [
                ["kia", "Kia"],
                ["hyundai", "Hyundai"],
                ["ssangyong", "SsangYong"],
              ] as const
            ).map(([id, title]) => (
              <Link
                key={id}
                href={`/catalog?brand=${id}`}
                className="rounded-full border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--text-h)] transition hover:border-blue-300 hover:text-[var(--blue-bright)]"
              >
                {title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="max-h-[min(80vh,640px)] overflow-y-auto border-b border-[var(--border)] bg-white shadow-lg lg:hidden">
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
                Telegram
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

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}
