import Link from "next/link";

type Props = {
  /** Высота логотипа в px */
  height?: number;
  className?: string;
  /** null — без ссылки */
  href?: string | null;
  /** header — компактный файл, full — полный логотип */
  variant?: "header" | "full";
  /** Тёмный фон под лого (белый текст читается и в светлой теме) */
  withBg?: boolean;
  /** для совместимости, игнорируется */
  priority?: boolean;
};

/** Соотношение сторон исходника ≈ 3:1 */
const ASPECT = 2172 / 724;

/**
 * Логотип KoreParts.
 * Обычный <img> — без next/image, чтобы стабильно работало на Vercel и static export.
 */
export function SiteLogo({
  height = 40,
  className = "",
  href = "/",
  variant = "header",
  withBg = true,
}: Props) {
  const width = Math.round(height * ASPECT);
  const src = variant === "full" ? "/logo.png" : "/logo-header.png";

  const shell = (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden ${
        withBg
          ? "rounded-xl bg-[#05070d] px-2.5 py-1.5 ring-1 ring-white/10 shadow-sm"
          : ""
      } ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="KoreParts — запчасти Kia, Hyundai, Genesis"
        width={width}
        height={height}
        decoding="async"
        fetchPriority={variant === "header" ? "high" : "auto"}
        className="block object-contain object-left"
        style={{
          width,
          height,
          maxWidth: "100%",
        }}
      />
    </span>
  );

  if (href === null) return shell;

  return (
    <Link
      href={href}
      className="group shrink-0 transition hover:opacity-90"
      aria-label="KoreParts — на главную"
    >
      {shell}
    </Link>
  );
}
