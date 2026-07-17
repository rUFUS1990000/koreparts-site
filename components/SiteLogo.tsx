import Image from "next/image";
import Link from "next/link";

type Props = {
  /** Высота логотипа в px */
  height?: number;
  className?: string;
  priority?: boolean;
  /** null — без ссылки */
  href?: string | null;
  /** header — компактный файл, full — полный логотип */
  variant?: "header" | "full";
  /** Тёмный фон под лого (белый текст читается и в светлой теме) */
  withBg?: boolean;
};

/** Соотношение сторон исходника ~3:1 */
const ASPECT = 1400 / 467;

export function SiteLogo({
  height = 40,
  className = "",
  priority = false,
  href = "/",
  variant = "header",
  withBg = true,
}: Props) {
  const width = Math.round(height * ASPECT);
  const src = variant === "full" ? "/logo.png" : "/logo-header.png";

  const shell = (
    <span
      className={`inline-flex shrink-0 items-center overflow-hidden transition group-hover:opacity-90 ${
        withBg
          ? "rounded-xl bg-[#05070d] px-2 py-1 ring-1 ring-white/10 shadow-sm"
          : ""
      } ${className}`}
    >
      <Image
        src={src}
        alt="KoreParts — запчасти Kia, Hyundai, Genesis"
        width={width}
        height={height}
        priority={priority}
        className="block h-auto w-auto object-contain object-left"
        style={{ height, width: "auto", maxWidth: width }}
        sizes={`${width}px`}
      />
    </span>
  );

  if (href === null) return shell;

  return (
    <Link
      href={href}
      className="group shrink-0"
      aria-label="KoreParts — на главную"
    >
      {shell}
    </Link>
  );
}
