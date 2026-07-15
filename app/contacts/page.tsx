import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Связаться с KoreParts: Telegram-бот, подбор запчастей по VIN для Kia, Hyundai, Genesis.",
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
          href="https://t.me/KorePartsBot"
          target="_blank"
          rel="noreferrer"
          className="card card-hover block p-6 md:p-8"
        >
          <div className="text-3xl">🤖</div>
          <h2 className="mt-3 text-xl font-bold text-[var(--text-h)]">
            Telegram-бот @KorePartsBot
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            Каталог, корзина и заказ прямо в мессенджере. Тот же ассортимент, что
            на сайте.
          </p>
          <span className="mt-4 inline-flex text-sm font-semibold text-[var(--blue-bright)]">
            Открыть бота →
          </span>
        </a>

        <div className="card p-6 md:p-8">
          <div className="text-3xl">🕒</div>
          <h2 className="mt-3 text-xl font-bold text-[var(--text-h)]">
            Режим работы
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text)]">
            <li>Пн–Сб: 10:00–20:00 (МСК)</li>
            <li>Вс: по сообщениям в Telegram</li>
            <li>Ответ обычно в течение нескольких часов</li>
          </ul>
        </div>

        <div className="card p-6 md:p-8">
          <div className="text-3xl">🔧</div>
          <h2 className="mt-3 text-xl font-bold text-[var(--text-h)]">
            Для быстрого подбора
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Пришлите:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[var(--text)]">
            <li>марку, модель и год</li>
            <li>VIN (если есть)</li>
            <li>название или OEM-артикул</li>
          </ul>
        </div>

        <div className="card p-6 md:p-8">
          <div className="text-3xl">🌐</div>
          <h2 className="mt-3 text-xl font-bold text-[var(--text-h)]">
            Заказ на сайте
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            Добавьте товары в корзину и оформите заказ — мы получим заявку и
            свяжемся для подтверждения.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/catalog" className="btn btn-primary btn-sm">
              Каталог
            </Link>
            <Link href="/checkout" className="btn btn-ghost btn-sm">
              Оформить
            </Link>
          </div>
        </div>
      </div>

      <div className="card mt-6 overflow-hidden p-0">
        <div className="grid md:grid-cols-2">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-[var(--text-h)]">
              Регионы работы
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Отправляем по всей России. Работаем с частными клиентами и
              сервисами. Для оптовых запросов — напишите в бот с пометкой
              «опт».
            </p>
          </div>
          <div className="flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-rose-600/15 p-8 text-center">
            <div>
              <div className="text-4xl font-black tracking-tight text-[var(--text-h)]">
                KoreParts
              </div>
              <div className="mt-1 text-sm text-[var(--text-muted)]">
                Kia · Hyundai · Genesis
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
