import { REVIEWS } from "@/lib/reviews";

function Stars({ n }: { n: number }) {
  return (
    <span className="tracking-tight text-amber-400" aria-label={`${n} из 5`}>
      {"★".repeat(n)}
      <span className="text-slate-600">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export function ReviewsSection() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)]/70 py-16">
      <div className="container-kp">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Отзывы клиентов</h2>
            <p className="section-sub">
              Реальные истории владельцев Kia, Hyundai и Genesis
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm">
            <span className="text-amber-400">★ 4.9</span>
            <span className="ml-2 text-[var(--text-muted)]">
              на основе {REVIEWS.length}+ отзывов
            </span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <article
              key={r.id}
              className="card card-hover p-5 reveal"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-[var(--text-h)]">{r.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {r.city} · {r.car}
                  </div>
                </div>
                <Stars n={r.rating} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text)]">
                “{r.text}”
              </p>
              <div className="mt-3 text-[11px] text-[var(--text-muted)]">
                {new Date(r.date).toLocaleDateString("ru-RU")}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
