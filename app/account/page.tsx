"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { useCart } from "@/lib/cart-context";
import { TELEGRAM_CHANNEL_URL, TELEGRAM_URL } from "@/lib/constants";
import {
  BRANDS,
  brandTitle,
  formatPrice,
  getProduct,
  MODELS,
  modelTitle,
  popularProducts,
} from "@/lib/products";
import {
  ensureAccountDemo,
  loadFavorites,
  loadOrders,
  loadProfile,
  loadRequests,
  orderStatusLabel,
  orderStatusTone,
  saveFavorites,
  saveProfile,
  type SavedOrder,
  type SavedRequest,
  type UserProfile,
} from "@/lib/storage";
import type { BrandId } from "@/lib/types";

type Tab =
  | "overview"
  | "profile"
  | "garage"
  | "orders"
  | "requests"
  | "favorites"
  | "settings";

function profileCompleteness(p: UserProfile): {
  pct: number;
  missing: string[];
  done: number;
  total: number;
} {
  const checks: { ok: boolean; label: string }[] = [
    { ok: Boolean(p.name?.trim()), label: "Имя" },
    { ok: Boolean(p.phone?.replace(/\D/g, "").length >= 10), label: "Телефон" },
    { ok: Boolean(p.email?.includes("@")), label: "Email" },
    { ok: Boolean(p.city?.trim()), label: "Город" },
    { ok: Boolean(p.carBrand?.trim()), label: "Марка авто" },
    { ok: Boolean(p.carModel?.trim()), label: "Модель" },
    { ok: Boolean(p.carYear?.trim()), label: "Год" },
    { ok: (p.vin?.trim().length ?? 0) >= 11, label: "VIN" },
  ];
  const done = checks.filter((c) => c.ok).length;
  const total = checks.length;
  return {
    pct: Math.round((done / total) * 100),
    missing: checks.filter((c) => !c.ok).map((c) => c.label),
    done,
    total,
  };
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AccountPage() {
  const { user, loading: authLoading, logout, updateAccount, changePassword } =
    useAuth();
  const router = useRouter();
  const { totalQty, totalPrice, lines, add } = useCart();
  const [tab, setTab] = useState<Tab>("overview");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [requests, setRequests] = useState<SavedRequest[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [favAdded, setFavAdded] = useState<string | null>(null);
  const [pwdForm, setPwdForm] = useState({
    current: "",
    next: "",
    next2: "",
  });
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);
  const [pwdOk, setPwdOk] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?next=/account");
      return;
    }
    const p = loadProfile();
    if (!p.name && user.name) p.name = user.name;
    if (!p.email && user.email) p.email = user.email;
    if (!p.phone && user.phone) p.phone = user.phone;
    saveProfile(p);

    const data = ensureAccountDemo();
    setProfile({
      ...data.profile,
      name: data.profile.name || user.name,
      email: data.profile.email || user.email,
      phone: data.profile.phone || user.phone || "",
    });
    setOrders(loadOrders());
    setRequests(loadRequests());
    setFavorites(loadFavorites());
    setHydrated(true);
  }, [authLoading, user, router]);

  const favProducts = useMemo(
    () => favorites.map((id) => getProduct(id)).filter(Boolean),
    [favorites],
  );

  const recs = useMemo(() => {
    const brand = profile?.carBrand?.toLowerCase() || "";
    const model = profile?.carModel?.toLowerCase() || "";
    const pool = popularProducts.filter((p) => {
      if (brand && p.brand.includes(brand.slice(0, 4))) return true;
      if (model && p.model.includes(model.slice(0, 4))) return true;
      return false;
    });
    const list = (pool.length >= 4 ? pool : popularProducts).slice(0, 4);
    return list;
  }, [profile?.carBrand, profile?.carModel]);

  const completeness = useMemo(
    () =>
      profile
        ? profileCompleteness(profile)
        : { pct: 0, missing: [], done: 0, total: 8 },
    [profile],
  );

  function flashSaved() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  async function onSaveProfile(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    saveProfile(profile);
    await updateAccount({ name: profile.name, phone: profile.phone });
    flashSaved();
  }

  function removeFavorite(id: string) {
    const next = favorites.filter((x) => x !== id);
    setFavorites(next);
    saveFavorites(next);
  }

  function addFavToCart(id: string) {
    add(id, 1);
    setFavAdded(id);
    window.setTimeout(() => setFavAdded(null), 1400);
  }

  function repeatOrder(order: SavedOrder) {
    for (const it of order.items) {
      if (getProduct(it.id)) add(it.id, it.qty);
    }
    router.push("/cart");
  }

  async function onChangePassword(e: FormEvent) {
    e.preventDefault();
    setPwdMsg(null);
    setPwdOk(false);
    if (pwdForm.next !== pwdForm.next2) {
      setPwdMsg("Новые пароли не совпадают");
      return;
    }
    const res = await changePassword(pwdForm.current, pwdForm.next);
    if (!res.ok) {
      setPwdMsg(res.error);
      return;
    }
    setPwdOk(true);
    setPwdMsg("Пароль обновлён");
    setPwdForm({ current: "", next: "", next2: "" });
  }

  if (authLoading || !user || !hydrated || !profile) {
    return (
      <div className="container-kp py-20 text-center">
        <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-[var(--blue-dim)]" />
        <p className="mt-4 text-[var(--text-muted)]">
          {authLoading || !user ? "Проверка входа…" : "Загрузка кабинета…"}
        </p>
      </div>
    );
  }

  const initials = (profile.name || user.name || "КП")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const providerLabel =
    user.provider === "vk"
      ? "VK"
      : user.provider === "yandex"
        ? "Яндекс"
        : "Email";

  const tabs: { id: Tab; label: string; count?: number; icon: string }[] = [
    { id: "overview", label: "Обзор", icon: "⌂" },
    { id: "orders", label: "Заказы", count: orders.length, icon: "📦" },
    { id: "requests", label: "Заявки", count: requests.length, icon: "📝" },
    { id: "favorites", label: "Избранное", count: favorites.length, icon: "♥" },
    { id: "garage", label: "Гараж", icon: "🚗" },
    { id: "profile", label: "Профиль", icon: "👤" },
    { id: "settings", label: "Аккаунт", icon: "⚙" },
  ];

  const bonuses = profile.bonuses ?? 0;
  const brandKeys = Object.keys(BRANDS) as BrandId[];
  const brandIdGuess = brandKeys.find(
    (id) => BRANDS[id].toLowerCase() === profile.carBrand.toLowerCase(),
  );
  const modelOptions = brandIdGuess ? MODELS[brandIdGuess] : [];

  const garageCatalogHref = `/catalog?${new URLSearchParams(
    [
      brandIdGuess ? ["brand", brandIdGuess] : null,
      profile.carModel
        ? [
            "model",
            modelOptions.find(
              (m) =>
                m.title.toLowerCase() === profile.carModel.toLowerCase(),
            )?.id || profile.carModel.toLowerCase(),
          ]
        : null,
    ]
      .filter(Boolean)
      .map((x) => x as [string, string]),
  ).toString()}`;

  return (
    <div className="container-kp py-6 md:py-10">
      {/* Header */}
      <div className="card overflow-hidden p-0">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-rose-500 px-5 py-6 md:px-8 md:py-8">
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="relative">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt=""
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/40 md:h-20 md:w-20"
                />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20 text-xl font-black text-white ring-2 ring-white/30 backdrop-blur md:h-20 md:w-20 md:text-2xl">
                  {initials}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white/80">
                Личный кабинет · {providerLabel}
              </div>
              <h1 className="mt-0.5 text-2xl font-black tracking-tight text-white md:text-3xl">
                {profile.name || user.name || "Пользователь"}
              </h1>
              <p className="mt-1 text-sm text-white/85">
                {[profile.city, profile.phone, profile.email || user.email]
                  .filter(Boolean)
                  .join(" · ") || "Заполните профиль — так менеджеру проще связаться"}
              </p>
              {/* completeness */}
              <div className="mt-3 max-w-md">
                <div className="flex items-center justify-between text-xs text-white/80">
                  <span>Профиль заполнен на {completeness.pct}%</span>
                  <span>
                    {completeness.done}/{completeness.total}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: `${completeness.pct}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/request"
                className="btn btn-sm bg-white text-[var(--blue-bright)] hover:bg-blue-50"
              >
                Новая заявка
              </Link>
              <Link
                href="/catalog"
                className="btn btn-sm border border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                Каталог
              </Link>
              <button
                type="button"
                className="btn btn-sm border border-white/40 bg-white/10 text-white hover:bg-white/20"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>

        {/* Clickable stats */}
        <div className="grid grid-cols-2 gap-px bg-[var(--border)] sm:grid-cols-4">
          {(
            [
              {
                k: "Бонусы",
                v: `${bonuses.toLocaleString("ru-RU")} ₽`,
                t: "1% с заказов",
                tab: "overview" as Tab,
              },
              {
                k: "Заказы",
                v: String(orders.length),
                t: orders.length ? "История" : "Пока пусто",
                tab: "orders" as Tab,
              },
              {
                k: "Заявки",
                v: String(requests.length),
                t: "Подбор деталей",
                tab: "requests" as Tab,
              },
              {
                k: "Корзина",
                v: totalQty ? formatPrice(totalPrice) : "0 ₽",
                t: totalQty ? `${totalQty} шт.` : "Пусто",
                href: "/cart",
              },
            ] as const
          ).map((s) =>
            "href" in s && s.href ? (
              <Link
                key={s.k}
                href={s.href}
                className="bg-[var(--bg-elevated)] px-4 py-4 transition hover:bg-[var(--bg-muted)]"
              >
                <div className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                  {s.k}
                </div>
                <div className="mt-1 text-xl font-extrabold text-[var(--text-h)]">
                  {s.v}
                </div>
                <div className="text-xs text-[var(--text-muted)]">{s.t}</div>
              </Link>
            ) : (
              <button
                key={s.k}
                type="button"
                onClick={() => "tab" in s && s.tab && setTab(s.tab)}
                className="bg-[var(--bg-elevated)] px-4 py-4 text-left transition hover:bg-[var(--bg-muted)]"
              >
                <div className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                  {s.k}
                </div>
                <div className="mt-1 text-xl font-extrabold text-[var(--text-h)]">
                  {s.v}
                </div>
                <div className="text-xs text-[var(--text-muted)]">{s.t}</div>
              </button>
            ),
          )}
        </div>
      </div>

      {/* Incomplete profile banner */}
      {completeness.pct < 75 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/30">
          <div className="text-sm text-[var(--text-h)]">
            <span className="font-bold">Дополните профиль</span>
            <span className="text-[var(--text-muted)]">
              {" "}
              — не хватает: {completeness.missing.slice(0, 4).join(", ")}
              {completeness.missing.length > 4 ? "…" : ""}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() =>
              setTab(
                completeness.missing.some((m) =>
                  ["Марка авто", "Модель", "Год", "VIN"].includes(m),
                )
                  ? "garage"
                  : "profile",
              )
            }
          >
            Заполнить
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-5 -mx-1 flex gap-1 overflow-x-auto px-1 pb-2 md:flex-wrap md:overflow-visible">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? "bg-[var(--blue-dim)] text-[var(--blue-bright)] ring-1 ring-[var(--blue)]/25"
                : "text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-h)]"
            }`}
          >
            <span className="mr-1 opacity-80">{t.icon}</span>
            {t.label}
            {typeof t.count === "number" ? (
              <span className="ml-1 text-xs opacity-70">({t.count})</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="mt-4 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
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
              {orders.length === 0 ? (
                <EmptyBlock
                  title="Заказов пока нет"
                  text="Добавьте товары в корзину и оформите заказ — история появится здесь."
                  action={{ href: "/catalog", label: "В каталог" }}
                />
              ) : (
                <div className="mt-4 space-y-3">
                  {orders.slice(0, 3).map((o) => (
                    <OrderRow
                      key={o.id}
                      order={o}
                      compact
                      onRepeat={() => repeatOrder(o)}
                    />
                  ))}
                </div>
              )}
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
              {requests.length === 0 ? (
                <EmptyBlock
                  title="Заявок нет"
                  text="Не нашли деталь? Оставьте заявку — подберём по VIN или OEM."
                  action={{ href: "/request", label: "Оставить заявку" }}
                />
              ) : (
                <div className="mt-4 space-y-3">
                  {requests.slice(0, 2).map((r) => (
                    <RequestRow key={r.id} req={r} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-[var(--text-h)]">
                {profile.carBrand
                  ? `Рекомендуем для ${profile.carBrand} ${profile.carModel || ""}`
                  : "Рекомендуем для вас"}
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
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-[var(--text-h)]">Мой автомобиль</h2>
                <button
                  type="button"
                  className="text-xs font-semibold text-[var(--blue-bright)]"
                  onClick={() => setTab("garage")}
                >
                  Изменить
                </button>
              </div>
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
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={garageCatalogHref}
                      className="btn btn-primary btn-sm"
                    >
                      Запчасти для авто
                    </Link>
                    <Link
                      href={`/request?brand=${encodeURIComponent(profile.carBrand)}&model=${encodeURIComponent(profile.carModel)}&vin=${encodeURIComponent(profile.vin || "")}`}
                      className="btn btn-ghost btn-sm"
                    >
                      Заявка
                    </Link>
                  </div>
                </div>
              ) : (
                <EmptyBlock
                  title="Гараж пуст"
                  text="Укажите марку и модель — быстрее подберём запчасти."
                  action={{ label: "Добавить авто", onClick: () => setTab("garage") }}
                />
              )}
            </div>

            <div className="card p-5">
              <h2 className="font-bold text-[var(--text-h)]">Быстрые действия</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href="/request" className="btn btn-accent btn-sm">
                  Заявка
                </Link>
                <Link href="/vin" className="btn btn-ghost btn-sm">
                  VIN
                </Link>
                <Link href="/cart" className="btn btn-ghost btn-sm">
                  Корзина{totalQty ? ` (${totalQty})` : ""}
                </Link>
                <Link href="/checkout" className="btn btn-primary btn-sm">
                  Оформить
                </Link>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm col-span-2"
                >
                  ✈️ Telegram-бот
                </a>
                <a
                  href={TELEGRAM_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm col-span-2"
                >
                  📢 Канал t.me/KoreParts
                </a>
              </div>
            </div>

            {lines.length > 0 && (
              <div className="card p-5">
                <h2 className="font-bold text-[var(--text-h)]">В корзине</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {lines.slice(0, 4).map((l) => (
                    <li
                      key={l.product.id}
                      className="flex justify-between gap-2"
                    >
                      <span className="line-clamp-1 text-[var(--text)]">
                        {l.product.name}
                      </span>
                      <span className="shrink-0 font-semibold">×{l.qty}</span>
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

            <div className="card border-[var(--blue)]/20 bg-[var(--blue-dim)]/40 p-5">
              <div className="text-sm font-bold text-[var(--blue-bright)]">
                Бонусный баланс
              </div>
              <div className="mt-1 text-3xl font-black text-[var(--text-h)]">
                {bonuses.toLocaleString("ru-RU")} ₽
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                1% с заказа возвращается бонусами. Списание — по согласованию с
                менеджером.
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* PROFILE */}
      {tab === "profile" && (
        <form
          onSubmit={onSaveProfile}
          className="card mt-4 max-w-3xl p-5 md:p-7"
        >
          <h2 className="text-lg font-bold text-[var(--text-h)]">Контакты</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Эти данные подставляются в заявки и заказы
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(
              [
                ["name", "Имя *", "Как к вам обращаться"],
                ["phone", "Телефон *", "+7 (___) ___-__-__"],
                ["email", "Email", "you@email.com"],
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
                  type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                />
              </label>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn btn-primary">
              {saved ? "Сохранено ✓" : "Сохранить профиль"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setTab("garage")}
            >
              К гаражу →
            </button>
          </div>
        </form>
      )}

      {/* GARAGE */}
      {tab === "garage" && (
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <form onSubmit={onSaveProfile} className="card p-5 md:p-7">
            <h2 className="text-lg font-bold text-[var(--text-h)]">
              Автомобиль в гараже
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Сохраните авто — каталог и заявки станут точнее
            </p>

            <div className="mt-4">
              <span className="mb-1.5 block text-sm font-semibold text-[var(--text-h)]">
                Марка
              </span>
              <div className="flex flex-wrap gap-2">
                {brandKeys.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() =>
                      setProfile({
                        ...profile,
                        carBrand: BRANDS[id],
                        carModel: "",
                      })
                    }
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition ${
                      profile.carBrand === BRANDS[id]
                        ? "bg-[var(--blue-dim)] text-[var(--blue-bright)] ring-[var(--blue)]/30"
                        : "bg-[var(--bg-muted)] text-[var(--text)] ring-[var(--border)] hover:ring-blue-300"
                    }`}
                  >
                    {BRANDS[id]}
                  </button>
                ))}
              </div>
            </div>

            {modelOptions.length > 0 && (
              <div className="mt-4">
                <span className="mb-1.5 block text-sm font-semibold text-[var(--text-h)]">
                  Модель
                </span>
                <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
                  {modelOptions
                    .filter((m) => m.id !== "other")
                    .map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          setProfile({ ...profile, carModel: m.title })
                        }
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 transition ${
                          profile.carModel === m.title
                            ? "bg-[var(--blue-dim)] text-[var(--blue-bright)] ring-[var(--blue)]/30"
                            : "bg-[var(--bg)] text-[var(--text)] ring-[var(--border)] hover:ring-blue-300"
                        }`}
                      >
                        {m.title}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                  Год
                </span>
                <input
                  className="input"
                  value={profile.carYear}
                  onChange={(e) =>
                    setProfile({ ...profile, carYear: e.target.value })
                  }
                  placeholder="2021"
                  inputMode="numeric"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                  VIN
                </span>
                <input
                  className="input font-mono uppercase"
                  value={profile.vin}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      vin: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="17 символов"
                  maxLength={17}
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                  Марка / модель вручную
                </span>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    className="input"
                    value={profile.carBrand}
                    onChange={(e) =>
                      setProfile({ ...profile, carBrand: e.target.value })
                    }
                    placeholder="Hyundai"
                  />
                  <input
                    className="input"
                    value={profile.carModel}
                    onChange={(e) =>
                      setProfile({ ...profile, carModel: e.target.value })
                    }
                    placeholder="Creta"
                  />
                </div>
              </label>
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
                <Link href={garageCatalogHref} className="btn btn-primary btn-sm">
                  Каталог под авто
                </Link>
                <Link href="/vin" className="btn btn-ghost btn-sm">
                  VIN-подбор
                </Link>
                <Link
                  href={`/request?brand=${encodeURIComponent(profile.carBrand)}&model=${encodeURIComponent(profile.carModel)}&year=${encodeURIComponent(profile.carYear)}&vin=${encodeURIComponent(profile.vin || "")}`}
                  className="btn btn-accent btn-sm"
                >
                  Заявка с авто
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS */}
      {tab === "orders" && (
        <div className="mt-4 space-y-4">
          {orders.length === 0 ? (
            <EmptyBlock
              title="История заказов пуста"
              text="После оформления заказа на сайте он появится здесь."
              action={{ href: "/catalog", label: "Перейти в каталог" }}
            />
          ) : (
            orders.map((o) => (
              <OrderRow
                key={o.id}
                order={o}
                onRepeat={() => repeatOrder(o)}
              />
            ))
          )}
        </div>
      )}

      {/* REQUESTS */}
      {tab === "requests" && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-[var(--text-muted)]">
              Заявки сохраняются в этом браузере и уходят менеджеру на email
            </p>
            <Link href="/request" className="btn btn-accent btn-sm">
              + Новая заявка
            </Link>
          </div>
          {requests.length === 0 ? (
            <EmptyBlock
              title="Заявок пока нет"
              text="Опишите деталь — ответим по наличию и цене."
              action={{ href: "/request", label: "Оставить заявку" }}
            />
          ) : (
            requests.map((r) => <RequestRow key={r.id} req={r} />)
          )}
        </div>
      )}

      {/* FAVORITES */}
      {tab === "favorites" && (
        <div className="mt-4">
          {!favProducts.length ? (
            <EmptyBlock
              title="Избранное пусто"
              text="Нажимайте «в избранное» на карточках товаров в каталоге."
              action={{ href: "/catalog", label: "Открыть каталог" }}
            />
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
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                      <span className="font-bold text-[var(--text-h)]">
                        {formatPrice(p.price)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={p.stock <= 0}
                          onClick={() => addFavToCart(p.id)}
                        >
                          {favAdded === p.id
                            ? "✓"
                            : p.stock <= 0
                              ? "Нет"
                              : "В корзину"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-[var(--red)]"
                          onClick={() => removeFavorite(p.id)}
                        >
                          Убрать
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          )}
        </div>
      )}

      {/* SETTINGS */}
      {tab === "settings" && (
        <div className="mt-4 grid max-w-3xl gap-5">
          <div className="card p-5 md:p-6">
            <h2 className="text-lg font-bold text-[var(--text-h)]">
              Аккаунт
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3 border-b border-[var(--border)] pb-2">
                <dt className="text-[var(--text-muted)]">Вход через</dt>
                <dd className="font-semibold text-[var(--text-h)]">
                  {providerLabel}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-[var(--border)] pb-2">
                <dt className="text-[var(--text-muted)]">Email</dt>
                <dd className="font-semibold text-[var(--text-h)]">
                  {user.email}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--text-muted)]">Имя в аккаунте</dt>
                <dd className="font-semibold text-[var(--text-h)]">
                  {user.name}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
              На static-хостинге (reg.ru) данные кабинета хранятся в этом
              браузере. Вход через Яндекс/VK — удобнее на разных устройствах.
            </p>
          </div>

          {user.provider === "email" && (
            <form onSubmit={onChangePassword} className="card p-5 md:p-6">
              <h2 className="text-lg font-bold text-[var(--text-h)]">
                Сменить пароль
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-1">
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold">Текущий пароль</span>
                  <input
                    type="password"
                    className="input"
                    autoComplete="current-password"
                    value={pwdForm.current}
                    onChange={(e) =>
                      setPwdForm({ ...pwdForm, current: e.target.value })
                    }
                    required
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold">Новый пароль</span>
                  <input
                    type="password"
                    className="input"
                    autoComplete="new-password"
                    minLength={6}
                    value={pwdForm.next}
                    onChange={(e) =>
                      setPwdForm({ ...pwdForm, next: e.target.value })
                    }
                    required
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold">Повтор нового</span>
                  <input
                    type="password"
                    className="input"
                    autoComplete="new-password"
                    minLength={6}
                    value={pwdForm.next2}
                    onChange={(e) =>
                      setPwdForm({ ...pwdForm, next2: e.target.value })
                    }
                    required
                  />
                </label>
              </div>
              {pwdMsg ? (
                <p
                  className={`mt-3 text-sm ${pwdOk ? "text-[var(--success)]" : "text-[var(--red-bright)]"}`}
                >
                  {pwdMsg}
                </p>
              ) : null}
              <button type="submit" className="btn btn-primary mt-4">
                Обновить пароль
              </button>
            </form>
          )}

          <div className="card border-[var(--red)]/20 p-5">
            <h2 className="font-bold text-[var(--text-h)]">Сессия</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Выйти из кабинета на этом устройстве
            </p>
            <button
              type="button"
              className="btn btn-sm mt-4 border border-[var(--red)]/40 text-[var(--red-bright)] hover:bg-[var(--red-dim)]"
              onClick={() => {
                if (confirm("Выйти из личного кабинета?")) {
                  logout();
                  router.push("/login");
                }
              }}
            >
              Выйти из аккаунта
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyBlock({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: { href?: string; label: string; onClick?: () => void };
}) {
  return (
    <div className="mt-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)]/50 px-4 py-8 text-center">
      <div className="font-semibold text-[var(--text-h)]">{title}</div>
      <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--text-muted)]">
        {text}
      </p>
      {action ? (
        action.href ? (
          <Link href={action.href} className="btn btn-primary btn-sm mt-4">
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-sm mt-4"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone = orderStatusTone(status);
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
      : tone === "amber"
        ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800"
        : tone === "blue"
          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-800"
          : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700";
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
  onRepeat,
}: {
  order: SavedOrder;
  compact?: boolean;
  onRepeat?: () => void;
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
            {fmtDate(order.createdAt)}
            {order.city ? ` · ${order.city}` : ""}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-[var(--text-h)]">
            {formatPrice(order.total)}
          </div>
          {onRepeat ? (
            <button
              type="button"
              className="mt-1 text-xs font-semibold text-[var(--blue-bright)] hover:underline"
              onClick={onRepeat}
            >
              Повторить в корзину
            </button>
          ) : null}
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
          {order.address ? (
            <li className="pt-1 text-xs text-[var(--text-muted)]">
              Доставка: {order.address}
            </li>
          ) : null}
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
            {fmtDate(req.createdAt)}
          </div>
        </div>
        <Link
          href="/request"
          className="text-xs font-semibold text-[var(--blue-bright)] hover:underline"
        >
          Ещё заявка
        </Link>
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
