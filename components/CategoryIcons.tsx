import type { ReactNode } from "react";
import type { CategoryId } from "@/lib/types";

type IconProps = {
  className?: string;
  size?: number;
};

/** Красивые SVG-иконки категорий в стиле Autodoc — крупные, читаемые, с акцентом */
export function CategoryIcon({
  id,
  className = "",
  size = 56,
}: {
  id: CategoryId;
  className?: string;
  size?: number;
}) {
  const map: Record<CategoryId, (p: IconProps) => ReactNode> = {
    engine: EngineIcon,
    chassis: ChassisIcon,
    brakes: BrakesIcon,
    body: BodyIcon,
    filters: FiltersIcon,
    electric: ElectricIcon,
    oils: OilsIcon,
  };
  const Icon = map[id];
  return <Icon className={className} size={size} />;
}

function IconShell({
  size = 56,
  className = "",
  children,
  gradientId,
  from,
  to,
}: {
  size?: number;
  className?: string;
  children: ReactNode;
  gradientId: string;
  from: string;
  to: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="8" y1="8" x2="56" y2="56">
          <stop stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      {children}
    </svg>
  );
}

/** Двигатель / ГРМ — шестерня + поршень */
function EngineIcon({ size, className }: IconProps) {
  return (
    <IconShell
      size={size}
      className={className}
      gradientId="eng"
      from="#60a5fa"
      to="#3b82f6"
    >
      <circle cx="32" cy="32" r="26" fill="url(#eng)" fillOpacity="0.12" />
      <path
        d="M32 14c-1.1 0-2 .9-2 2v2.1a12 12 0 0 0-3.5 1.45l-1.5-1.5a2 2 0 1 0-2.8 2.8l1.5 1.5A12 12 0 0 0 22.1 30H20a2 2 0 1 0 0 4h2.1a12 12 0 0 0 1.45 3.5l-1.5 1.5a2 2 0 1 0 2.8 2.8l1.5-1.5A12 12 0 0 0 30 45.9V48a2 2 0 1 0 4 0v-2.1a12 12 0 0 0 3.5-1.45l1.5 1.5a2 2 0 1 0 2.8-2.8l-1.5-1.5A12 12 0 0 0 41.9 34H44a2 2 0 1 0 0-4h-2.1a12 12 0 0 0-1.45-3.5l1.5-1.5a2 2 0 1 0-2.8-2.8l-1.5 1.5A12 12 0 0 0 34 18.1V16c0-1.1-.9-2-2-2z"
        stroke="url(#eng)"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="32" cy="32" r="6.5" stroke="url(#eng)" strokeWidth="2.2" fill="none" />
      <circle cx="32" cy="32" r="2.5" fill="url(#eng)" />
      <path
        d="M46 18h6v4h-2v6h-4v-6h-2v-2a2 2 0 0 1 2-2z"
        fill="url(#eng)"
        fillOpacity="0.9"
      />
    </IconShell>
  );
}

/** Подвеска — амортизатор */
function ChassisIcon({ size, className }: IconProps) {
  return (
    <IconShell
      size={size}
      className={className}
      gradientId="chs"
      from="#34d399"
      to="#10b981"
    >
      <circle cx="32" cy="32" r="26" fill="url(#chs)" fillOpacity="0.12" />
      {/* rod top */}
      <rect x="29" y="10" width="6" height="10" rx="1.5" fill="url(#chs)" />
      {/* spring coils */}
      <path
        d="M22 22c4-3 16-3 20 0M22 28c4-3 16-3 20 0M22 34c4-3 16-3 20 0M22 40c4-3 16-3 20 0"
        stroke="url(#chs)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* body */}
      <rect x="24" y="42" width="16" height="10" rx="3" fill="url(#chs)" fillOpacity="0.85" />
      <rect x="28" y="52" width="8" height="4" rx="1.5" fill="url(#chs)" />
    </IconShell>
  );
}

/** Тормоза — тормозной диск + колодка */
function BrakesIcon({ size, className }: IconProps) {
  return (
    <IconShell
      size={size}
      className={className}
      gradientId="brk"
      from="#fb7185"
      to="#e11d48"
    >
      <circle cx="32" cy="32" r="26" fill="url(#brk)" fillOpacity="0.12" />
      {/* disc */}
      <circle cx="32" cy="34" r="18" stroke="url(#brk)" strokeWidth="2.5" fill="none" />
      <circle cx="32" cy="34" r="12" stroke="url(#brk)" strokeWidth="1.8" fill="none" opacity="0.7" />
      <circle cx="32" cy="34" r="5" fill="url(#brk)" fillOpacity="0.35" stroke="url(#brk)" strokeWidth="1.5" />
      {/* caliper / pad */}
      <path
        d="M18 22c0-2 1.5-4 4-4h8c2 0 3 1.5 3 3.5V28H18V22z"
        fill="url(#brk)"
      />
      <rect x="20" y="26" width="12" height="3.5" rx="1" fill="#0a0e18" fillOpacity="0.35" />
    </IconShell>
  );
}

/** Кузов / оптика — силуэт авто + фара */
function BodyIcon({ size, className }: IconProps) {
  return (
    <IconShell
      size={size}
      className={className}
      gradientId="bdy"
      from="#a78bfa"
      to="#7c3aed"
    >
      <circle cx="32" cy="32" r="26" fill="url(#bdy)" fillOpacity="0.12" />
      {/* car body */}
      <path
        d="M12 38h40v4a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3v-4z"
        fill="url(#bdy)"
        fillOpacity="0.9"
      />
      <path
        d="M16 38l4-12h16l8 8h6v4H16z"
        stroke="url(#bdy)"
        strokeWidth="2"
        fill="url(#bdy)"
        fillOpacity="0.25"
      />
      {/* windows */}
      <path d="M22 28h8l-2 6h-8l2-6z" fill="url(#bdy)" fillOpacity="0.5" />
      <path d="M32 28h6l4 6h-8l-2-6z" fill="url(#bdy)" fillOpacity="0.35" />
      {/* wheels */}
      <circle cx="20" cy="45" r="4.5" stroke="url(#bdy)" strokeWidth="2" fill="#0a0e18" />
      <circle cx="44" cy="45" r="4.5" stroke="url(#bdy)" strokeWidth="2" fill="#0a0e18" />
      {/* headlight glow */}
      <ellipse cx="50" cy="36" rx="3" ry="2" fill="#fde68a" fillOpacity="0.9" />
    </IconShell>
  );
}

/** Фильтры — канистра / фильтр */
function FiltersIcon({ size, className }: IconProps) {
  return (
    <IconShell
      size={size}
      className={className}
      gradientId="flt"
      from="#38bdf8"
      to="#0284c7"
    >
      <circle cx="32" cy="32" r="26" fill="url(#flt)" fillOpacity="0.12" />
      {/* filter cartridge */}
      <rect
        x="20"
        y="16"
        width="24"
        height="36"
        rx="5"
        stroke="url(#flt)"
        strokeWidth="2.2"
        fill="url(#flt)"
        fillOpacity="0.15"
      />
      <rect x="24" y="12" width="16" height="6" rx="2" fill="url(#flt)" />
      {/* pleats */}
      <path
        d="M24 26h16M24 32h16M24 38h16M24 44h16"
        stroke="url(#flt)"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="32" cy="20" r="1.5" fill="#0a0e18" fillOpacity="0.4" />
    </IconShell>
  );
}

/** Электрика — батарея + молния */
function ElectricIcon({ size, className }: IconProps) {
  return (
    <IconShell
      size={size}
      className={className}
      gradientId="elc"
      from="#fbbf24"
      to="#f59e0b"
    >
      <circle cx="32" cy="32" r="26" fill="url(#elc)" fillOpacity="0.12" />
      {/* battery body */}
      <rect
        x="14"
        y="22"
        width="36"
        height="24"
        rx="4"
        stroke="url(#elc)"
        strokeWidth="2.2"
        fill="url(#elc)"
        fillOpacity="0.12"
      />
      <rect x="22" y="17" width="8" height="5" rx="1.5" fill="url(#elc)" />
      <rect x="34" y="17" width="8" height="5" rx="1.5" fill="url(#elc)" />
      {/* bolt */}
      <path
        d="M34 28l-8 8h5l-2 8 10-10h-5l2-6z"
        fill="url(#elc)"
      />
    </IconShell>
  );
}

/** Масла — капля / канистра */
function OilsIcon({ size, className }: IconProps) {
  return (
    <IconShell
      size={size}
      className={className}
      gradientId="oil"
      from="#f97316"
      to="#ea580c"
    >
      <circle cx="32" cy="32" r="26" fill="url(#oil)" fillOpacity="0.12" />
      {/* drop */}
      <path
        d="M32 12c0 0-14 16-14 26a14 14 0 0 0 28 0c0-10-14-26-14-26z"
        stroke="url(#oil)"
        strokeWidth="2.2"
        fill="url(#oil)"
        fillOpacity="0.2"
      />
      <path
        d="M32 22c-4 5-7 10-7 15a7 7 0 0 0 14 0c0-5-3-10-7-15z"
        fill="url(#oil)"
        fillOpacity="0.75"
      />
      <ellipse cx="28" cy="34" rx="3" ry="4" fill="#fff" fillOpacity="0.25" />
    </IconShell>
  );
}

/** Акцентные цвета для карточек категорий */
export const CATEGORY_ACCENT: Record<
  CategoryId,
  { from: string; to: string; glow: string; ring: string }
> = {
  engine: {
    from: "from-blue-500/20",
    to: "to-blue-600/5",
    glow: "group-hover:shadow-blue-500/20",
    ring: "group-hover:border-blue-500/40",
  },
  chassis: {
    from: "from-emerald-500/20",
    to: "to-emerald-600/5",
    glow: "group-hover:shadow-emerald-500/20",
    ring: "group-hover:border-emerald-500/40",
  },
  brakes: {
    from: "from-rose-500/20",
    to: "to-rose-600/5",
    glow: "group-hover:shadow-rose-500/20",
    ring: "group-hover:border-rose-500/40",
  },
  body: {
    from: "from-violet-500/20",
    to: "to-violet-600/5",
    glow: "group-hover:shadow-violet-500/20",
    ring: "group-hover:border-violet-500/40",
  },
  filters: {
    from: "from-sky-500/20",
    to: "to-sky-600/5",
    glow: "group-hover:shadow-sky-500/20",
    ring: "group-hover:border-sky-500/40",
  },
  electric: {
    from: "from-amber-500/20",
    to: "to-amber-600/5",
    glow: "group-hover:shadow-amber-500/20",
    ring: "group-hover:border-amber-500/40",
  },
  oils: {
    from: "from-orange-500/20",
    to: "to-orange-600/5",
    glow: "group-hover:shadow-orange-500/20",
    ring: "group-hover:border-orange-500/40",
  },
};
