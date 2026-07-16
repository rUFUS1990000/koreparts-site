import Link from "next/link";
import type { PopularSection } from "@/lib/nav";
import { POPULAR_SECTIONS } from "@/lib/nav";
import type { CategoryId } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcons";

const ACCENT: Record<
  PopularSection["accent"],
  { wrap: string; ring: string }
> = {
  blue: {
    wrap: "from-blue-500/20 to-blue-600/5",
    ring: "group-hover:border-blue-500/40",
  },
  red: {
    wrap: "from-rose-500/20 to-rose-600/5",
    ring: "group-hover:border-rose-500/40",
  },
  green: {
    wrap: "from-emerald-500/20 to-emerald-600/5",
    ring: "group-hover:border-emerald-500/40",
  },
  amber: {
    wrap: "from-amber-500/20 to-amber-600/5",
    ring: "group-hover:border-amber-500/40",
  },
  violet: {
    wrap: "from-violet-500/20 to-violet-600/5",
    ring: "group-hover:border-violet-500/40",
  },
  sky: {
    wrap: "from-sky-500/20 to-sky-600/5",
    ring: "group-hover:border-sky-500/40",
  },
  orange: {
    wrap: "from-orange-500/20 to-orange-600/5",
    ring: "group-hover:border-orange-500/40",
  },
};

export function PopularSections() {
  return (
    <section className="container-kp py-12 md:py-14">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="section-title">Популярные разделы</h2>
          <p className="section-sub">
            ТО, оригинал, подвеска, тормоза — быстрый вход в каталог
          </p>
        </div>
        <Link href="/catalog" className="btn btn-ghost btn-sm">
          Весь каталог →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {POPULAR_SECTIONS.map((s) => {
          const a = ACCENT[s.accent];
          return (
            <Link
              key={s.id}
              href={s.href}
              className={`cat-card group flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-3.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-4 ${a.ring}`}
            >
              <span
                className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${a.wrap} ring-1 ring-black/5 transition group-hover:scale-105`}
              >
                <SectionIcon icon={s.icon} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-snug text-[var(--text-h)] group-hover:text-[var(--blue-bright)] sm:text-[0.95rem]">
                  {s.title}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-[var(--text-muted)] sm:text-xs">
                  {s.blurb}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function SectionIcon({ icon }: { icon: PopularSection["icon"] }) {
  if (icon === "to") return <ToIcon />;
  if (icon === "oem") return <OemIcon />;
  return <CategoryIcon id={icon as CategoryId} size={36} />;
}

function ToIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 64 64" fill="none" aria-hidden>
      <defs>
        <linearGradient id="to-g" x1="8" y1="8" x2="56" y2="56">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="26" fill="url(#to-g)" fillOpacity="0.12" />
      <rect
        x="18"
        y="16"
        width="28"
        height="36"
        rx="4"
        stroke="url(#to-g)"
        strokeWidth="2.2"
        fill="url(#to-g)"
        fillOpacity="0.12"
      />
      <path
        d="M24 26h16M24 33h16M24 40h10"
        stroke="url(#to-g)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="42" cy="40" r="6" fill="url(#to-g)" />
      <path
        d="M40 40l1.5 1.5 3-3"
        stroke="#0a0e18"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OemIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 64 64" fill="none" aria-hidden>
      <defs>
        <linearGradient id="oem-g" x1="8" y1="8" x2="56" y2="56">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="26" fill="url(#oem-g)" fillOpacity="0.12" />
      <path
        d="M20 40V24a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v16"
        stroke="url(#oem-g)"
        strokeWidth="2.2"
        fill="none"
      />
      <rect x="16" y="38" width="32" height="10" rx="3" fill="url(#oem-g)" fillOpacity="0.85" />
      <path
        d="M28 20v-4h8v4"
        stroke="url(#oem-g)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text
        x="32"
        y="46"
        textAnchor="middle"
        fill="#0a0e18"
        fontSize="8"
        fontWeight="800"
        fontFamily="system-ui,sans-serif"
      >
        OEM
      </text>
    </svg>
  );
}
