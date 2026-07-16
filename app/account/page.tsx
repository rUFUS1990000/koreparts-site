"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { TELEGRAM_URL } from "@/lib/constants";
import {
  brandTitle,
  formatPrice,
  getProduct,
  modelTitle,
  popularProducts,
} from "@/lib/products";
import {
  ensureAccountDemo,
  orderStatusLabel,
  orderStatusTone,
  saveFavorites,
  saveProfile,
  type SavedOrder,
  type SavedRequest,
  type UserProfile,
} from "@/lib/storage";

type Tab = "overview" | "profile" | "orders" | "requests" | "favorites" | "garage";

export default function AccountPage() {
  const { totalQty, totalPrice, lines } = useCart();
  const [tab, setTab] = useState<Tab>("overview");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [requests, setRequests] = useState<SavedRequest[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = ensureAccountDemo();
    setProfile(data.profile);
    setOrders(data.orders);
    setRequests(data.requests);
    setFavorites(data.favorites);
    setHydrated(true);
  }, []);

  const favProducts = useMemo(
    () => favorites.map((id) => getProduct(id)).filter(Boolean),
    [favorites],
  );

  const recs = popularProducts.slice(0, 4);

  function onSaveProfile(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function removeFavorite(id: string) {
    const next = favorites.filter((x) => x !== id);
    setFavorites(next);
    saveFavorites(next);
  }

  if (!hydrated || !profile) {
    return (
      <div className="container-kp py-16 text-center text-[var(--text-muted)]">
        Загрузка кабинета…
      </div>
    );
  }

  const initials = (profile.name || "КП")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Обзор" },
    { id: "profile", label: "Профиль" },
    { id: "garage", label: "Гараж" },
    { id: "orders", label: "Заказы", count: orders.length },
    { id: "requests", label: "Заявки", count: requests.length },
    { id: "favorites", label: "Избранное", count: favorites.length },
  ];

  const bonuses = profile.bonuses ?? 0;

  return (
    <div className="container-kp py-8 md:py-12">
      {/* Header card */}
      <div className="card overflow-hidden p-0">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-rose-500 px-5 py-6 md:px-8 md:py-8">
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20 text-xl font-black text-white ring-2 ring-white/30 backdrop-blur md:h-20 md:w-20 md:text-2xl">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white/80">
                Личный кабинет KoreParts
              </div>
              <h1 className="mt-0.5 text-2xl font-black tracking-tight text-white md:text-3xl">
                {profile.name || "Гость"}
              </h1>
              <p className="mt-1 text-sm text-white/85">
                {[profile.city, profile.phone, profile.email]
                  .filter(Boolean)
                  .join(" · ") || "Заполните профиль"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/request" className="btn btn-sm bg-white text-[var(--blue-bright)] hover:bg-blue-50">
                Новая заявка
              </Link>
              <Link href="/catalog" className="btn btn-sm border border-white/40 bg-white/10 text-white hover:bg-white/20">
                Каталог
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-[var(--border)] sm:grid-cols-4">
          {[
            { k: "Бонусы", v: `${bonuses.toLocaleString("ru-RU")} ₽`, t: "Накоплено" },
            { k: "Заказы", v: String(orders.length), t: "Всего" },
            { k: "Заявки", v: String(requests.length), t: "Подбор" },
            {
              k: "Корзина",
              v: totalQty ? formatPrice(totalPrice) : "0 ₽",
              t: totalQty ? `${totalQty} шт.` : "Пусто",
            },
          ].map((s) => (
            <div key={s.k} className="bg-[var(--bg-elevated)] px-4 py-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                {s.k}
              </div>
              <div className="mt-1 text-xl font-extrabold text-[var(--text-h)]">
                {s.v}
              </div>
              <div className="text-xs text-[var(--text-muted)]">{s.t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-1.5 border-b border-[var(--border)] pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? "bg-[var(--blue-dim)] text-[var(--blue-bright)]"
                : "text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-h)]"
            }`}
          >
            {t.label}
            {typeof t.count === "number" ? (
              <span className="ml-1 text-xs opacity-70">({t.count})</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <section className="card p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-[var(--text-h)]">
                  Последние заказы
                </h2>
                <button
                  type="button"
                  className="text-sm font-semibold text-[var(--blue-bright)]"
                  onClick={() => setTab("orders")}
                >
                  Все →
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {orders.slice(0, 3).map((o) => (
                  <OrderRow key={o.id} order={o} compact />
                ))}
              </div>
            </section>

            <section className="card p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-[var(--text-h)]">
                  Заявки на подбор
                </h2>
                <button
                  type="button"
                  className="text-sm font-semibold text-[var(--blue-bright)]"
                  onClick={() => setTab("requests")}
                >
                  Все →
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {requests.slice(0, 2).map((r) => (
                  <RequestRow key={r.id} req={r} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-[var(--text-h)]">
                Рекомендуем для вас
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {recs.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="card card-hover flex gap-3 p-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--bg-muted)]">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="line-clamp-2 text-sm font-semibold text-[var(--text-h)]">
                        {p.name}
                      </div>
                      <div className="mt-1 font-bold text-[var(--blue-bright)]">
                        {formatPrice(p.price)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="card p-5">
              <h2 className="font-bold text-[var(--text-h)]">Мой автомобиль</h2>
              {profile.carBrand || profile.carModel ? (
                <div className="mt-3 rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--blue-dim)] to-[var(--bg-muted)] p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-[var(--blue-bright)]">
                    Гараж
                  </div>
                  <div className="mt-1 text-xl font-extrabold text-[var(--text-h)]">
                    {profile.carBrand} {profile.carModel}
                  </div>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">
                    {[profile.carYear && `${profile.carYear} г.`, profile.vin]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                  <Link
                    href={`/catalog?q=${encodeURIComponent(
                      [profile.carBrand, profile.carModel].filter(Boolean).join(" "),
                    )}`}
                    className="btn btn-primary btn-sm mt-4"
                  >
                    Запчасти для авто
                  </Link>
                </div>
              ) : (
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Добавьте авто в профиле
                </p>
              )}
            </div>

            <div className="card p-5">
              <h2 className="font-bold text-[var(--text-h)]">Быстрые действия</h2>
              <div className="mt-3 flex flex-col gap-2">
                <Link href="/request" className="btn btn-accent btn-sm w-full">
                  Оставить заявку
                </Link>
                <Link href="/vin" className="btn btn-ghost btn-sm w-full">
                  Подбор по VIN
                </Link>
                <Link href="/cart" className="btn btn-ghost btn-sm w-full">
                  Корзина{totalQty ? ` (${totalQty})` : ""}
                </Link>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm w-full"
                >
                  Написать в Telegram
                </a>
              </div>
            </div>

            {lines.length > 0 && (
              <div className="card p-5">
                <h2 className="font-bold text-[var(--text-h)]">В корзине</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {lines.slice(0, 3).map((l) => (
                    <li key={l.product.id} className="flex justify-between gap-2">
                      <span className="line-clamp-1 text-[var(--text)]">
                        {l.product.name}
                      </span>
                      <span className="shrink-0 font-semibold">
                        ×{l.qty}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
                  <span className="font-bold text-[var(--text-h)]">
                    {formatPrice(totalPrice)}
                  </span>
                  <Link href="/checkout" className="btn btn-primary btn-sm">
                    Оформить
                  </Link>
                </div>
              </div>
            )}

            <div className="card border-blue-100 bg-blue-50/50 p-5">
              <div className="text-sm font-bold text-[var(--blue-bright)]">
                Бонусный баланс
              </div>
              <div className="mt-1 text-3xl font-black text-[var(--text-h)]">
                {bonuses.toLocaleString("ru-RU")} ₽
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                1% с каждого заказа возвращается бонусами. Можно списать при
                следующем заказе (по согласованию с менеджером).
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* PROFILE */}
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
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn btn-primary">
              {saved ? "Сохранено ✓" : "Сохранить"}
            </button>
          </div>
        </form>
      )}

      {/* GARAGE */}
      {tab === "garage" && (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <form
            onSubmit={onSaveProfile}
            className="card p-5 md:p-7"
          >
            <h2 className="text-lg font-bold text-[var(--text-h)]">
              Автомобиль в гараже
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Сохраните авто — подбор запчастей станет быстрее
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["carBrand", "Марка", "Hyundai"],
                  ["carModel", "Модель", "Creta"],
                  ["carYear", "Год", "2021"],
                  ["vin", "VIN", "17 символов"],
                ] as const
              ).map(([key, label, ph]) => (
                <label key={key} className="block text-sm sm:col-span-1">
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
            <button type="submit" className="btn btn-primary mt-5">
              {saved ? "Сохранено ✓" : "Сохранить авто"}
            </button>
          </form>

          <div className="card relative overflow-hidden p-6">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-200/40 blur-2xl" />
            <div className="relative">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--blue-bright)]">
                Активный авто
              </div>
              <div className="mt-2 text-3xl font-black text-[var(--text-h)]">
                {profile.carBrand || "—"} {profile.carModel || ""}
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3 border-b border-[var(--border)] pb-2">
                  <dt className="text-[var(--text-muted)]">Год</dt>
                  <dd className="font-semibold text-[var(--text-h)]">
                    {profile.carYear || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-[var(--border)] pb-2">
                  <dt className="text-[var(--text-muted)]">VIN</dt>
                  <dd className="font-mono text-xs font-semibold text-[var(--text-h)]">
                    {profile.vin || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--text-muted)]">Город</dt>
                  <dd className="font-semibold text-[var(--text-h)]">
                    {profile.city || "—"}
                  </dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/vin" className="btn btn-primary btn-sm">
                  VIN-подбор
                </Link>
                <Link href="/request" className="btn btn-ghost btn-sm">
                  Заявка на деталь
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS */}
      {tab === "orders" && (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <OrderRow key={o.id} order={o} />
          ))}
        </div>
      )}

      {/* REQUESTS */}
      {tab === "requests" && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Link href="/request" className="btn btn-accent btn-sm">
              + Новая заявка
            </Link>
          </div>
          {requests.map((r) => (
            <RequestRow key={r.id} req={r} />
          ))}
        </div>
      )}

      {/* FAVORITES */}
      {tab === "favorites" && (
        <div className="mt-6">
          {!favProducts.length ? (
            <div className="card p-8 text-center">
              <p className="text-[var(--text-muted)]">Избранное пусто</p>
              <Link href="/catalog" className="btn btn-primary btn-sm mt-4">
                В каталог
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {favProducts.map((p) =>
                p ? (
                  <div key={p.id} className="card flex flex-col p-3">
                    <Link
                      href={`/product/${p.id}`}
                      className="relative mb-3 block aspect-[4/3] overflow-hidden rounded-xl bg-[var(--bg-muted)]"
                    >
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="300px"
                      />
                    </Link>
                    <Link
                      href={`/product/${p.id}`}
                      className="line-clamp-2 text-sm font-semibold text-[var(--text-h)] hover:text-[var(--blue-bright)]"
                    >
                      {p.name}
                    </Link>
                    <div className="mt-1 text-xs text-[var(--text-muted)]">
                      {brandTitle(p.brand)} {modelTitle(p.brand, p.model)}
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                      <span className="font-bold text-[var(--text-h)]">
                        {formatPrice(p.price)}
                      </span>
                      <button
                        type="button"
                        className="text-xs font-semibold text-[var(--red)] hover:underline"
                        onClick={() => removeFavorite(p.id)}
                      >
                        Убрать
                      </button>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone = orderStatusTone(status);
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "amber"
        ? "bg-amber-50 text-amber-800 border-amber-200"
        : tone === "blue"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${cls}`}
    >
      {orderStatusLabel(status)}
    </span>
  );
}

function OrderRow({
  order,
  compact,
}: {
  order: SavedOrder;
  compact?: boolean;
}) {
  return (
    <article className="card p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[var(--text-h)]">{order.id}</span>
            <StatusBadge status={order.status} />
          </div>
          <div className="mt-0.5 text-xs text-[var(--text-muted)]">
            {new Date(order.createdAt).toLocaleString("ru-RU")}
            {order.city ? ` · ${order.city}` : ""}
          </div>
        </div>
        <div className="text-lg font-bold text-[var(--text-h)]">
          {formatPrice(order.total)}
        </div>
      </div>
      {!compact && (
        <ul className="mt-3 space-y-1.5 border-t border-[var(--border)] pt-3 text-sm">
          {order.items.map((it, i) => (
            <li
              key={`${order.id}-${i}`}
              className="flex justify-between gap-3 text-[var(--text)]"
            >
              <span className="min-w-0 truncate">
                {it.name}{" "}
                <span className="text-[var(--text-muted)]">×{it.qty}</span>
              </span>
              <span className="shrink-0 font-medium">
                {formatPrice(it.price * it.qty)}
              </span>
            </li>
          ))}
        </ul>
      )}
      {compact && (
        <p className="mt-2 line-clamp-1 text-sm text-[var(--text-muted)]">
          {order.items.map((i) => i.name).join(", ")}
        </p>
      )}
    </article>
  );
}

function RequestRow({ req }: { req: SavedRequest }) {
  return (
    <article className="card p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[var(--text-h)]">{req.id}</span>
            <StatusBadge status={req.status} />
          </div>
          <div className="mt-0.5 text-xs text-[var(--text-muted)]">
            {new Date(req.createdAt).toLocaleString("ru-RU")}
          </div>
        </div>
      </div>
      <div className="mt-3 text-sm font-semibold text-[var(--text-h)]">
        {req.partName}
      </div>
      {req.oem ? (
        <div className="mt-1 font-mono text-xs text-[var(--blue-bright)]">
          OEM {req.oem}
        </div>
      ) : null}
      <p className="mt-2 text-xs text-[var(--text-muted)]">
        {[req.brand, req.model, req.year].filter(Boolean).join(" · ") ||
          "Авто не указано"}
        {req.comment ? ` · ${req.comment}` : ""}
      </p>
    </article>
  );
}
