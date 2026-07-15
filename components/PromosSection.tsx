import Link from "next/link";
import { PROMOS } from "@/lib/reviews";

export function PromosSection() {
  return (
    <section className="container-kp py-16">
      <h2 className="section-title">Акции и спецпредложения</h2>
      <p className="section-sub">Выгодные комплекты и сервисы для вашего авто</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {PROMOS.map((p) => (
          <Link
            key={p.id}
            href={p.href}
            className={`card card-hover group relative overflow-hidden p-6 ${
              p.accent === "red" ? "promo-red" : "promo-blue"
            }`}
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl transition group-hover:scale-125" />
            <span
              className={`badge ${p.accent === "red" ? "badge-red" : ""} relative`}
            >
              {p.badge}
            </span>
            <h3 className="relative mt-4 text-xl font-bold text-[var(--text-h)]">
              {p.title}
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              {p.text}
            </p>
            <span className="relative mt-4 inline-flex text-sm font-semibold text-[var(--blue-bright)] group-hover:underline">
              Смотреть →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
