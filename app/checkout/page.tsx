"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { TELEGRAM_URL } from "@/lib/constants";
import { formatPrice } from "@/lib/products";
import {
  clearCheckoutDraft,
  loadCheckoutDraft,
  saveCheckoutDraft,
  saveOrder,
  type CheckoutDraft,
} from "@/lib/storage";
import { formatOrderMessage, submitWeb3Form } from "@/lib/web3forms";

const empty: CheckoutDraft = {
  name: "",
  phone: "",
  city: "",
  address: "",
  comment: "",
};

export default function CheckoutPage() {
  const { lines, totalPrice, totalQty, clear } = useCart();
  const [sent, setSent] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState<CheckoutDraft>(empty);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mailOk, setMailOk] = useState<boolean | null>(null);

  useEffect(() => {
    const draft = loadCheckoutDraft();
    if (draft) setForm(draft);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCheckoutDraft(form);
  }, [form, hydrated]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!lines.length || loading) return;
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      alert("Укажите корректный телефон (минимум 10 цифр)");
      return;
    }
    if (form.name.trim().length < 2) {
      alert("Укажите имя");
      return;
    }
    const id = `WEB-${Date.now()}`;
    const items = lines.map((l) => ({
      id: l.product.id,
      name: l.product.name,
      oem: l.product.oem,
      qty: l.qty,
      price: l.product.price,
    }));

    setLoading(true);
    try {
      const result = await submitWeb3Form({
        subject: `Заказ KoreParts ${id} · ${totalPrice} ₽`,
        name: form.name,
        phone: form.phone,
        message: formatOrderMessage({
          id,
          ...form,
          total: totalPrice,
          items,
        }),
      });
      if (result.ok) setMailOk(true);
      else if ("skipped" in result && result.skipped) setMailOk(null);
      else setMailOk(false);

      saveOrder({
        id,
        createdAt: new Date().toISOString(),
        status: "new",
        ...form,
        items,
        total: totalPrice,
      });
      clearCheckoutDraft();
      clear();
      setOrderId(id);
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="container-kp py-16">
        <div className="card mx-auto max-w-lg p-8 text-center">
          <div className="mb-3 text-4xl">✅</div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">
            Заказ {orderId} принят!
          </h1>
          <p className="mt-3 text-[var(--text-muted)]">
            {mailOk === true
              ? "Заказ отправлен на почту менеджеру. Мы свяжемся с вами."
              : mailOk === false
                ? "Заказ сохранён локально. Отправка на почту не удалась — продублируйте в Telegram."
                : "Данные сохранены. Менеджер свяжется с вами."}{" "}
            Можно продублировать в{" "}
            <a
              href={TELEGRAM_URL}
              className="text-[var(--blue-bright)] hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              @KorePartsBot
            </a>
            .
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/account" className="btn btn-primary">
              В личный кабинет
            </Link>
            <Link href="/catalog" className="btn btn-ghost">
              В каталог
            </Link>
            <a
              href={TELEGRAM_URL}
              className="btn btn-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="container-kp py-16">
        <div className="card mx-auto max-w-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-h)]">
            Нечего оформлять
          </h1>
          <p className="mt-2 text-[var(--text-muted)]">
            Сначала добавьте товары в корзину.
          </p>
          <Link href="/catalog" className="btn btn-primary mt-6">
            В каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-kp py-8 md:py-12">
      <h1 className="mb-2 text-3xl font-bold text-[var(--text-h)]">
        Оформление заказа
      </h1>
      <p className="mb-8 text-[var(--text-muted)]">
        Контакты сохраняются автоматически — можно вернуться позже
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <form className="card space-y-4 p-5 md:p-6" onSubmit={onSubmit}>
          <label className="block space-y-1.5 text-sm">
            <span className="font-semibold text-[var(--text-h)]">Имя *</span>
            <input
              className="input"
              required
              minLength={2}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Как к вам обращаться"
            />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="font-semibold text-[var(--text-h)]">Телефон *</span>
            <input
              className="input"
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+7 900 123-45-67"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm">
              <span className="font-semibold text-[var(--text-h)]">Город *</span>
              <input
                className="input"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Москва"
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-semibold text-[var(--text-h)]">
                Адрес / ПВЗ *
              </span>
              <input
                className="input"
                required
                minLength={5}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Улица или пункт выдачи"
              />
            </label>
          </div>
          <label className="block space-y-1.5 text-sm">
            <span className="font-semibold text-[var(--text-h)]">
              Комментарий / VIN
            </span>
            <textarea
              className="input min-h-[100px] resize-y"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="VIN, удобное время звонка…"
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto"
            disabled={loading}
          >
            {loading
              ? "Отправка…"
              : `Подтвердить заказ · ${formatPrice(totalPrice)}`}
          </button>
        </form>

        <aside className="card h-fit space-y-3 p-5 lg:sticky lg:top-24">
          <div className="font-bold text-[var(--text-h)]">Ваш заказ</div>
          <ul className="max-h-72 space-y-2 overflow-auto text-sm">
            {lines.map((l) => (
              <li
                key={l.product.id}
                className="flex justify-between gap-3 border-b border-[var(--border)] pb-2"
              >
                <span className="text-[var(--text)]">
                  {l.product.name} × {l.qty}
                </span>
                <span className="shrink-0 font-semibold text-[var(--text-h)]">
                  {formatPrice(l.sum)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-[var(--border)] pt-3 text-sm text-[var(--text-muted)]">
            <span>Позиций: {totalQty}</span>
            <span className="text-lg font-bold text-[var(--text-h)]">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <Link href="/cart" className="btn btn-ghost btn-sm w-full">
            ← Изменить корзину
          </Link>
        </aside>
      </div>
    </div>
  );
}
