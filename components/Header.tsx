"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { TELEGRAM_URL } from "@/lib/constants";
import { SearchBox } from "./SearchBox";
import { TelegramLink } from "./TelegramLink";

const links = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/vin", label: "VIN" },
  { href: "/delivery", label: "Доставка" },
  { href: "/contacts", label: "Контакты" },
];

export function Header() {
  const pathname = usePathname();
  const { totalQty } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 border-b border-[var(--border)]">
      <div className="container-kp flex h-[4rem] items-center justify-between gap-3">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 font-bold tracking-tight"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#e11d48] text-xs font-black text-white shadow-lg shadow-blue-900/40 ring-1 ring-white/10 transition group-hover:scale-105">
            KP
          </span>
          <span className="text-lg text-[var(--text-h)]">
            Kore
            <span className="bg-gradient-to-r from-[var(--blue-bright)] to-[var(--red-bright)] bg-clip-text text-transparent">
              Parts
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-[var(--blue-dim)] text-[var(--blue-bright)] ring-1 ring-[rgba(59,130,246,0.25)]"
                    : "text-[var(--text)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-h)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/catalog"
            className="btn btn-primary btn-sm hidden sm:inline-flex"
          >
            Каталог
          </Link>
          <TelegramLink
            href={TELEGRAM_URL}
            className="btn btn-ghost btn-sm hidden xl:inline-flex"
            compact
          />
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
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-sm lg:hidden"
            aria-label="Меню"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <span className="text-base">✕</span>
            ) : (
              <MenuIcon />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-elevated)] lg:hidden">
          <div className="container-kp flex flex-col gap-3 py-3">
            <SearchBox />
            <div className="flex flex-col gap-0.5">
              {[...links, { href: "/cart", label: "Корзина" }].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 font-semibold text-[var(--text-h)] hover:bg-[var(--bg-muted)]"
                >
                  {l.label}
                  {l.href === "/cart" && totalQty > 0
                    ? ` (${totalQty})`
                    : ""}
                </Link>
              ))}
            </div>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent"
              onClick={() => setOpen(false)}
            >
              Telegram-бот
            </a>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="btn btn-primary"
            >
              Оформить заказ
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 8H7" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
