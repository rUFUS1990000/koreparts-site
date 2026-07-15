import Link from "next/link";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import type { CategoryId } from "@/lib/types";
import { CATEGORY_ACCENT, CategoryIcon } from "./CategoryIcons";

type Props = {
  /** large = главная (Autodoc-style), compact = каталог */
  variant?: "large" | "compact";
  /** активная категория (каталог) */
  activeId?: string;
  /** клик по категории без перехода (для фильтров) */
  onSelect?: (id: CategoryId | "") => void;
  className?: string;
};

export function CategoryGrid({
  variant = "large",
  activeId,
  onSelect,
  className = "",
}: Props) {
  const cats = Object.entries(CATEGORIES) as [
    CategoryId,
    (typeof CATEGORIES)[CategoryId],
  ][];

  if (variant === "compact") {
    return (
      <div
        className={`flex gap-2 overflow-x-auto pb-1 scrollbar-thin ${className}`}
      >
        <CategoryChip
          label="Все"
          active={!activeId}
          onClick={() => onSelect?.("")}
          href={onSelect ? undefined : "/catalog"}
        />
        {cats.map(([id, c]) => (
          <CategoryChip
            key={id}
            id={id}
            label={c.title}
            active={activeId === id}
            onClick={() => onSelect?.(id)}
            href={onSelect ? undefined : `/catalog?category=${id}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 ${className}`}
    >
      {cats.map(([id, c]) => {
        const count = PRODUCTS.filter((p) => p.category === id).length;
        const accent = CATEGORY_ACCENT[id];
        const inner = (
          <>
            <div
              className={`mb-3 grid h-[4.5rem] w-[4.5rem] place-items-center rounded-2xl bg-gradient-to-br ${accent.from} ${accent.to} ring-1 ring-white/5 transition duration-300 group-hover:scale-110 group-hover:ring-white/10`}
            >
              <CategoryIcon id={id} size={52} />
            </div>
            <span className="block text-center text-sm font-bold leading-snug text-[var(--text-h)]">
              {c.title}
            </span>
            <span className="mt-1 block text-center text-[11px] text-[var(--text-muted)]">
              {count} товаров
            </span>
          </>
        );

        const baseClass = `cat-card group flex flex-col items-center rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 pt-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1.5 ${accent.ring} ${accent.glow} hover:shadow-xl`;

        if (onSelect) {
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={`${baseClass} ${
                activeId === id
                  ? "border-[var(--blue-bright)] ring-1 ring-[var(--blue-bright)]/30"
                  : ""
              }`}
            >
              {inner}
            </button>
          );
        }

        return (
          <Link
            key={id}
            href={`/catalog?category=${id}`}
            className={baseClass}
          >
            {inner}
          </Link>
        );
      })}
    </div>
  );
}

function CategoryChip({
  id,
  label,
  active,
  onClick,
  href,
}: {
  id?: CategoryId;
  label: string;
  active: boolean;
  onClick?: () => void;
  href?: string;
}) {
  const className = `group flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
    active
      ? "border-[var(--blue-bright)]/40 bg-[var(--blue-dim)] text-[var(--blue-bright)]"
      : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text)] hover:border-[var(--border-glow)] hover:text-[var(--text-h)]"
  }`;

  const content = (
    <>
      {id ? (
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--bg-muted)] ring-1 ring-[var(--border)]">
          <CategoryIcon id={id} size={22} />
        </span>
      ) : (
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--bg-muted)] text-xs font-bold text-[var(--text-muted)] ring-1 ring-[var(--border)]">
          All
        </span>
      )}
      <span className="max-w-[9rem] truncate">{label}</span>
    </>
  );

  if (href && !onClick) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
