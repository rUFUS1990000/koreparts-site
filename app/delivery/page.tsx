import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Доставка и оплата",
  description:
    "Условия доставки и оплаты в KoreParts: СДЭК, ПВЗ, оплата при получении, перевод.",
};

const methods = [
  {
    t: "Транспортные компании",
    d: "СДЭК, Boxberry, Деловые Линии и другие. Срок 2–7 дней по РФ.",
  },
  {
    t: "Пункты выдачи",
    d: "Укажите удобный ПВЗ в комментарии к заказу — отправим туда.",
  },
  {
    t: "Крупные города",
    d: "Москва, СПб, Казань, Екатеринбург, Новосибирск — приоритетная отправка.",
  },
];

const pay = [
  {
    t: "При получении",
    d: "Наличными или картой в ПВЗ / курьеру (где доступно).",
  },
  {
    t: "Перевод",
    d: "По реквизитам после подтверждения заказа менеджером.",
  },
  {
    t: "Для юрлиц",
    d: "Счёт и закрывающие документы — по запросу.",
  },
];

export default function DeliveryPage() {
  return (
    <div className="container-kp py-10 md:py-14">
      <span className="badge">Информация</span>
      <h1 className="mt-4 section-title text-3xl md:text-4xl">
        Доставка и оплата
      </h1>
      <p className="section-sub mt-3">
        Прозрачные условия: сначала подтверждаем наличие, затем отправляем.
        Средний срок отправки — 1 рабочий день после оплаты/подтверждения.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="card p-6 md:p-8">
          <h2 className="text-xl font-bold text-[var(--text-h)]">🚚 Доставка</h2>
          <div className="mt-5 space-y-4">
            {methods.map((m) => (
              <div
                key={m.t}
                className="rounded-2xl bg-[var(--bg)]/70 p-4 ring-1 ring-[var(--border)]"
              >
                <div className="font-semibold text-[var(--text-h)]">{m.t}</div>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                  {m.d}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-[var(--text-muted)]">
            Стоимость доставки рассчитывается по тарифам ТК и зависит от веса,
            габаритов и города. Сообщим точную сумму до отправки.
          </p>
        </section>

        <section className="card p-6 md:p-8">
          <h2 className="text-xl font-bold text-[var(--text-h)]">💳 Оплата</h2>
          <div className="mt-5 space-y-4">
            {pay.map((m) => (
              <div
                key={m.t}
                className="rounded-2xl bg-[var(--bg)]/70 p-4 ring-1 ring-[var(--border)]"
              >
                <div className="font-semibold text-[var(--text-h)]">{m.t}</div>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                  {m.d}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-[rgba(59,130,246,0.25)] bg-[var(--blue-dim)] p-4 text-sm text-[var(--text)]">
            <b className="text-[var(--text-h)]">Гарантия:</b> отправляем только
            после сверки артикула. При ошибке совместимости — поможем с
            обменом/возвратом по согласованию.
          </div>
        </section>
      </div>

      <section className="card mt-6 p-6 md:p-8">
        <h2 className="text-xl font-bold text-[var(--text-h)]">
          Как проходит заказ
        </h2>
        <ol className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            "Оформление на сайте или в боте",
            "Подтверждение менеджером",
            "Оплата / договорённость",
            "Отправка и трек-номер",
          ].map((t, i) => (
            <li
              key={t}
              className="rounded-2xl bg-[var(--bg)] p-4 ring-1 ring-[var(--border)]"
            >
              <div className="text-xs font-bold text-[var(--blue-bright)]">
                Шаг {i + 1}
              </div>
              <div className="mt-1 text-sm font-semibold text-[var(--text-h)]">
                {t}
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/catalog" className="btn btn-primary">
            В каталог
          </Link>
          <Link href="/contacts" className="btn btn-ghost">
            Контакты
          </Link>
        </div>
      </section>
    </div>
  );
}
