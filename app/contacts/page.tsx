import type { Metadata } from "next";
import Link from "next/link";
import {
  EMAIL_DISPLAY,
  TELEGRAM_URL,
  WORK_HOURS,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Связаться с KoreParts: Telegram, заявка на подбор, доставка по России.",
};

export default function ContactsPage() {
  return (
    <div className="container-kp py-10 md:py-14">
      <span className="badge">Связь</span>
      <h1 className="mt-4 section-title text-3xl md:text-4xl">Контакты</h1>
      <p className="section-sub mt-3">
        Поможем с подбором детали, наличием и доставкой. Пишите удобным
        способом — отвечаем в рабочее время.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="card card-hover block p-6 md:p-8"
        >
          <div className="text-3xl">✈️</div>
          <h2 className="mt-3 text-xl font-bold text-[var(--text-h)]">
            Telegram @KorePartsBot
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            Каталог, корзина и заказ в мессенджере. Быстрый ответ по наличию.
          </p>
          <span className="mt-4 inline-flex text-sm font-semibold text-[var(--blue-bright)]">
            Открыть бота →
          </span>
        </a>

        <Link href="/request" className="card card-hover block p-6 md:p-8">
          <div className="text-3xl">📝</div>
          <h2 className="mt-3 text-xl font-bold text-[var(--text-h)]">
            Оставить заявку
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            Форма на сайте: VIN, OEM, описание детали. Заявка сохранится в
            личном кабинете.
          </p>
          <span className="mt-4 inline-flex text-sm font-semibold text-[var(--blue-bright)]">
            Заполнить форму →
          </span>
        </Link>

        <div className="card p-6 md:p-8">
          <div className="text-3xl">🕒</div>
          <h2 className="mt-3 text-xl font-bold text-[var(--text-h)]">
            Режим работы
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text)]">
            <li>{WORK_HOURS}</li>
            <li>Вс: по сообщениям в Telegram</li>
            <li>Ответ обычно в течение 15–30 минут</li>
          </ul>
        </div>

        <div className="card p-6 md:p-8">
          <div className="text-3xl">📧</div>
          <h2 className="mt-3 text-xl font-bold text-[var(--text-h)]">
            Email и кабинет
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            <a
              href={`mailto:${EMAIL_DISPLAY}`}
              className="font-semibold text-[var(--blue-bright)] hover:underline"
            >
              {EMAIL_DISPLAY}
            </a>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/account" className="btn btn-primary btn-sm">
              Личный кабинет
            </Link>
            <Link href="/catalog" className="btn btn-ghost btn-sm">
              Каталог
            </Link>
          </div>
        </div>
      </div>

      <div className="card mt-6 overflow-hidden p-0">
        <div className="grid md:grid-cols-2">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-[var(--text-h)]">
              Регионы и для сервисов
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Отправляем по всей России. Работаем с частными клиентами и
              СТО. Для опта напишите в Telegram с пометкой «опт».
            </p>
          </div>
          <div className="flex items-center justify-center bg-gradient-to-br from-[var(--blue-dim)] to-[var(--red-dim)] p-8 text-center">
            <div>
              <div className="text-4xl font-black tracking-tight text-[var(--text-h)]">
                KoreParts
              </div>
              <div className="mt-1 text-sm text-[var(--text-muted)]">
                Kia · Hyundai · Genesis · SsangYong
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
