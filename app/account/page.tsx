"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { TELEGRAM_URL } from "@/lib/constants";
import { formatPrice } from "@/lib/products";
import {
  loadOrders,
  loadProfile,
  loadRequests,
  saveProfile,
  type SavedOrder,
  type SavedRequest,
  type UserProfile,
} from "@/lib/storage";

type Tab = "profile" | "orders" | "requests";

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [requests, setRequests] = useState<SavedRequest[]>([]);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setOrders(loadOrders());
    setRequests(loadRequests());
    setHydrated(true);
  }, []);

  function onSaveProfile(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!hydrated || !profile) {
    return (
      <div className="container-kp py-16 text-center text-[var(--text-muted)]">
        Загрузка кабинета…
      </div>
    );
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "profile", label: "Профиль" },
    { id: "orders", label: "Заказы", count: orders.length },
    { id: "requests", label: "Заявки", count: requests.length },
  ];

  return (
    <div className="container-kp py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge">Личный кабинет</span>
          <h1 className="mt-4 section-title text-3xl md:text-4xl">
            {profile.name ? `Здравствуйте, ${profile.name}` : "Мой кабинет"}
          </h1>
          <p className="section-sub mt-2">
            Профиль авто, история заказов и заявок. Данные хранятся в этом
            браузере.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/request" className="btn btn-accent btn-sm">
            Новая заявка
          </Link>
          <Link href="/catalog" className="btn btn-ghost btn-sm">
            В каталог
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-[var(--border)] pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? "bg-[var(--blue-dim)] text-[var(--blue-bright)]"
                : "text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-h)]"
            }`}
          >
            {t.label}
            {typeof t.count === "number" ? (
              <span className="ml-1.5 text-xs opacity-70">({t.count})</span>
            ) : null}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <form onSubmit={onSaveProfile} className="card mt-6 max-w-3xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-[var(--text-h)]">Контакты</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(
              [
                ["name", "Имя", "Иван"],
                ["phone", "Телефон", "+7…"],
                ["email", "Email", "mail@example.com"],
                ["city", "Город", "Москва"],
              ] as const
            ).map(([key, label, ph]) => (
              <label key={key} className="block text-sm">
                <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                  {label}
                </span>
                <input
                  className="input"
                  value={profile[key]}
                  onChange={(e) =>
                    setProfile({ ...profile, [key]: e.target.value })
                  }
                  placeholder={ph}
                />
              </label>
            ))}
          </div>

          <h2 className="mt-8 text-lg font-bold text-[var(--text-h)]">
            Мой автомобиль
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(
              [
                ["carBrand", "Марка", "Hyundai"],
                ["carModel", "Модель", "Creta"],
                ["carYear", "Год", "2021"],
                ["vin", "VIN", "17 символов"],
              ] as const
            ).map(([key, label, ph]) => (
              <label key={key} className="block text-sm">
                <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                  {label}
                </span>
                <input
                  className={`input ${key === "vin" ? "font-mono uppercase" : ""}`}
                  value={profile[key]}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      [key]:
                        key === "vin"
                          ? e.target.value.toUpperCase()
                          : e.target.value,
                    })
                  }
                  placeholder={ph}
                  maxLength={key === "vin" ? 17 : undefined}
                />
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn btn-primary">
              {saved ? "Сохранено ✓" : "Сохранить профиль"}
            </button>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Написать в Telegram
            </a>
          </div>
        </form>
      )}

      {tab === "orders" && (
        <div className="mt-6 space-y-4">
          {!orders.length ? (
            <div className="card p-8 text-center">
              <p className="text-[var(--text-muted)]">Заказов пока нет</p>
              <Link href="/catalog" className="btn btn-primary btn-sm mt-4">
                Перейти в каталог
              </Link>
            </div>
          ) : (
            orders.map((o) => (
              <article key={o.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-[var(--text-h)]">{o.id}</div>
                    <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                      {new Date(o.createdAt).toLocaleString("ru-RU")} ·{" "}
                      {o.status === "new" ? "Новый" : o.status}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-[var(--text-h)]">
                    {formatPrice(o.total)}
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5 border-t border-[var(--border)] pt-3 text-sm">
                  {o.items.map((it, i) => (
                    <li
                      key={`${o.id}-${i}`}
                      className="flex justify-between gap-3 text-[var(--text)]"
                    >
                      <span className="min-w-0 truncate">
                        {it.name}{" "}
                        <span className="text-[var(--text-muted)]">
                          ×{it.qty}
                        </span>
                      </span>
                      <span className="shrink-0 font-medium">
                        {formatPrice(it.price * it.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
                {(o.city || o.phone) && (
                  <p className="mt-3 text-xs text-[var(--text-muted)]">
                    {[o.name, o.phone, o.city].filter(Boolean).join(" · ")}
                  </p>
                )}
              </article>
            ))
          )}
        </div>
      )}

      {tab === "requests" && (
        <div className="mt-6 space-y-4">
          {!requests.length ? (
            <div className="card p-8 text-center">
              <p className="text-[var(--text-muted)]">Заявок пока нет</p>
              <Link href="/request" className="btn btn-accent btn-sm mt-4">
                Оставить заявку
              </Link>
            </div>
          ) : (
            requests.map((r) => (
              <article key={r.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-[var(--text-h)]">{r.id}</div>
                    <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                      {new Date(r.createdAt).toLocaleString("ru-RU")}
                    </div>
                  </div>
                  <span className="badge">Новая</span>
                </div>
                <div className="mt-3 text-sm font-semibold text-[var(--text-h)]">
                  {r.partName}
                </div>
                {r.oem ? (
                  <div className="mt-1 font-mono text-xs text-[var(--blue-bright)]">
                    OEM {r.oem}
                  </div>
                ) : null}
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  {[r.brand, r.model, r.year, r.vin]
                    .filter(Boolean)
                    .join(" · ") || "Авто не указано"}
                </p>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}
