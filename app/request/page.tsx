"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  TELEGRAM_CHANNEL_URL,
  telegramRequestUrl,
  TELEGRAM_URL,
} from "@/lib/constants";
import { saveRequest, type SavedRequest } from "@/lib/storage";
import {
  formatRequestMessage,
  submitWeb3Form,
  WEB3FORMS_ACCESS_KEY,
} from "@/lib/web3forms";

const empty = {
  name: "",
  phone: "",
  city: "",
  brand: "",
  model: "",
  year: "",
  vin: "",
  partName: "",
  oem: "",
  comment: "",
};

export default function RequestPage() {
  const [form, setForm] = useState(empty);
  const [sent, setSent] = useState<SavedRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [mailOk, setMailOk] = useState<boolean | null>(null);

  function set<K extends keyof typeof empty>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (form.name.trim().length < 2) {
      alert("Укажите имя");
      return;
    }
    if (phoneDigits.length < 10) {
      alert("Укажите корректный телефон (минимум 10 цифр)");
      return;
    }
    if (form.partName.trim().length < 2) {
      alert("Укажите, какая деталь нужна");
      return;
    }

    const req: SavedRequest = {
      id: `REQ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "new",
      ...form,
    };

    setLoading(true);
    try {
      const result = await submitWeb3Form({
        subject: `Заявка KoreParts ${req.id}: ${form.partName}`,
        name: form.name,
        phone: form.phone,
        message: formatRequestMessage(req),
      });

      if (result.ok) {
        setMailOk(true);
      } else if ("skipped" in result && result.skipped) {
        setMailOk(null);
      } else {
        setMailOk(false);
        const err = "error" in result ? result.error : "Ошибка отправки";
        // всё равно сохраняем локально, но предупреждаем
        console.warn(err);
      }

      saveRequest(req);
      setSent(req);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    const tg = telegramRequestUrl(sent);
    return (
      <div className="container-kp py-12 md:py-16">
        <div className="card mx-auto max-w-lg p-8 text-center">
          <div className="mb-3 text-4xl">✅</div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">
            Заявка {sent.id} принята
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
            {mailOk === true
              ? "Заявка отправлена на почту менеджеру и сохранена в личном кабинете."
              : mailOk === false
                ? "Сохранили в личном кабинете. Отправка на почту не удалась — продублируйте в Telegram."
                : "Сохранили в личном кабинете. Чтобы ускорить ответ — продублируйте заявку в Telegram."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={tg}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Отправить в Telegram
            </a>
            <Link href="/account" className="btn btn-ghost">
              В личный кабинет
            </Link>
            <Link href="/catalog" className="btn btn-ghost">
              В каталог
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-kp py-10 md:py-14">
      <span className="badge">Подбор под заказ</span>
      <h1 className="mt-4 section-title text-3xl md:text-4xl">
        Оставить заявку
      </h1>
      <p className="section-sub mt-3">
        Не нашли деталь в каталоге или нужна помощь с подбором — заполните
        форму. Ответим в рабочее время, обычно в течение 15–30 минут.
        {WEB3FORMS_ACCESS_KEY ? (
          <span className="mt-1 block text-xs text-[var(--success)]">
            Заявка уйдёт менеджеру на email.
          </span>
        ) : null}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={onSubmit} className="card p-5 md:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                Имя *
              </span>
              <input
                className="input"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Как к вам обращаться"
                required
                disabled={loading}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                Телефон *
              </span>
              <input
                className="input"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+7 (___) ___-__-__"
                required
                disabled={loading}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                Город
              </span>
              <input
                className="input"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Город доставки"
                disabled={loading}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                Год авто
              </span>
              <input
                className="input"
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                placeholder="2018"
                disabled={loading}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                Марка
              </span>
              <input
                className="input"
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
                placeholder="Kia, Hyundai…"
                disabled={loading}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                Модель
              </span>
              <input
                className="input"
                value={form.model}
                onChange={(e) => set("model", e.target.value)}
                placeholder="Sportage, Creta…"
                disabled={loading}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                VIN (если есть)
              </span>
              <input
                className="input font-mono uppercase"
                value={form.vin}
                onChange={(e) => set("vin", e.target.value.toUpperCase())}
                placeholder="17 символов"
                maxLength={17}
                disabled={loading}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                Какая деталь нужна *
              </span>
              <input
                className="input"
                value={form.partName}
                onChange={(e) => set("partName", e.target.value)}
                placeholder="Например: амортизатор передний левый"
                required
                disabled={loading}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                OEM / артикул
              </span>
              <input
                className="input font-mono"
                value={form.oem}
                onChange={(e) => set("oem", e.target.value)}
                placeholder="Если знаете номер"
                disabled={loading}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block font-semibold text-[var(--text-h)]">
                Комментарий
              </span>
              <textarea
                className="textarea min-h-[100px]"
                value={form.comment}
                onChange={(e) => set("comment", e.target.value)}
                placeholder="Сроки, предпочтения по бренду, фото…"
                disabled={loading}
              />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="btn btn-accent"
              disabled={loading}
            >
              {loading ? "Отправка…" : "Отправить заявку"}
            </button>
            <Link href="/catalog" className="btn btn-ghost">
              Сначала в каталог
            </Link>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="font-bold text-[var(--text-h)]">Что указать</h2>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
              <li>• Марку, модель и год</li>
              <li>• VIN — для точного подбора</li>
              <li>• Название детали или OEM</li>
              <li>• Город — для расчёта доставки</li>
            </ul>
          </div>
          <div className="card p-5">
            <h2 className="font-bold text-[var(--text-h)]">Telegram</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Напишите менеджеру в боте или подпишитесь на канал с новостями и
              акциями.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                @KorePartsBot
              </a>
              <a
                href={TELEGRAM_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
              >
                t.me/KoreParts
              </a>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="font-bold text-[var(--text-h)]">Личный кабинет</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              История заявок и заказов хранится в вашем браузере.
            </p>
            <Link href="/account" className="btn btn-ghost btn-sm mt-4">
              Открыть кабинет
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
