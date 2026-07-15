"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { ProductCard } from "@/components/ProductCard";
import { TELEGRAM_URL } from "@/lib/constants";
import {
  decodeVinStub,
  VIN_EXAMPLES,
  type VinDecodeResult,
} from "@/lib/vin";

type Props = {
  /** compact = для вставки в hero / узкую колонку */
  variant?: "full" | "compact" | "section";
  className?: string;
};

export function VinLookup({ variant = "section", className = "" }: Props) {
  const [vin, setVin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VinDecodeResult | null>(null);
  const [pending, startTransition] = useTransition();

  const catalogHref = useMemo(() => {
    if (!result) return "/catalog";
    return `/catalog?brand=${result.brand}&model=${result.model}`;
  }, [result]);

  function runSearch(raw: string) {
    setError(null);
    startTransition(() => {
      // небольшая «задержка» для ощущения поиска
      const decoded = decodeVinStub(raw);
      if (!decoded.ok) {
        setResult(null);
        setError(decoded.error);
        return;
      }
      setResult(decoded);
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    runSearch(vin);
  }

  const isCompact = variant === "compact";

  return (
    <div className={className}>
      <div
        className={
          isCompact
            ? "space-y-3"
            : "card relative overflow-hidden p-5 md:p-7"
        }
      >
        {!isCompact && (
          <>
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-rose-500/15 blur-3xl" />
          </>
        )}

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(59,130,246,0.3)] bg-[var(--blue-dim)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--blue-bright)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--blue-bright)]" />
                VIN-подбор
              </div>
              <h2
                className={
                  isCompact
                    ? "mt-2 text-lg font-bold text-[var(--text-h)]"
                    : "mt-3 text-2xl font-bold text-[var(--text-h)] md:text-3xl"
                }
              >
                Подбор запчастей по VIN
              </h2>
              {!isCompact && (
                <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)] md:text-base">
                  Введите 17-значный VIN — покажем подходящие детали из каталога
                  KoreParts. Сейчас работает демо-расшифровка (примеры ниже).
                </p>
              )}
            </div>
            {!isCompact && (
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent btn-sm shrink-0"
              >
                ✈️ Точный подбор в боте
              </a>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className={
              isCompact
                ? "flex flex-col gap-2 sm:flex-row"
                : "flex flex-col gap-3 sm:flex-row sm:items-stretch"
            }
          >
            <div className="relative flex-1">
              <input
                className="input font-mono tracking-wider uppercase"
                placeholder="Например: Z94CU41DBBR123456"
                value={vin}
                maxLength={17}
                autoComplete="off"
                spellCheck={false}
                onChange={(e) => {
                  const v = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/gi, "");
                  setVin(v);
                }}
                aria-label="VIN-код автомобиля"
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">
                {vin.length}/17
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary min-w-[8.5rem]"
              disabled={pending || vin.length < 11}
            >
              {pending ? "Ищем…" : "Найти"}
            </button>
          </form>

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-[var(--red-bright)]">
              {error}
            </div>
          )}

          {/* Examples */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Примеры VIN (нажмите, чтобы подставить)
            </div>
            <div className="flex flex-wrap gap-2">
              {VIN_EXAMPLES.map((ex) => (
                <button
                  key={ex.vin}
                  type="button"
                  className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-left text-xs transition hover:border-[var(--blue)] hover:text-[var(--blue-bright)]"
                  onClick={() => {
                    setVin(ex.vin);
                    runSearch(ex.vin);
                  }}
                >
                  <span className="font-semibold text-[var(--text-h)]">
                    {ex.label}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] text-[var(--text-muted)]">
                    {ex.vin}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-5 animate-[fadeIn_0.35s_ease]">
          <div className="card overflow-hidden p-0">
            <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3 p-5 md:p-6">
                <div className="badge">Результат подбора · демо</div>
                <h3 className="text-xl font-bold text-[var(--text-h)] md:text-2xl">
                  {result.label}
                </h3>
                <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                  <div className="rounded-xl bg-[var(--bg)] p-3 ring-1 ring-[var(--border)]">
                    <dt className="text-[var(--text-muted)]">Год</dt>
                    <dd className="font-semibold text-[var(--text-h)]">
                      {result.year}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-[var(--bg)] p-3 ring-1 ring-[var(--border)]">
                    <dt className="text-[var(--text-muted)]">Двигатель</dt>
                    <dd className="font-semibold text-[var(--text-h)]">
                      {result.engine || "—"}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-[var(--bg)] p-3 ring-1 ring-[var(--border)] sm:col-span-1 col-span-2">
                    <dt className="text-[var(--text-muted)]">Найдено в каталоге</dt>
                    <dd className="font-semibold text-[var(--blue-bright)]">
                      {result.products.length} позиций
                    </dd>
                  </div>
                </dl>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  {result.note}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link href={catalogHref} className="btn btn-primary btn-sm">
                    Весь каталог модели
                  </Link>
                  <a
                    href={`${TELEGRAM_URL}?text=${encodeURIComponent(`Подбор по VIN: ${result.vin}\n${result.label}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-accent btn-sm"
                  >
                    ✈️ Уточнить в боте
                  </a>
                </div>
              </div>
              <div className="flex flex-col justify-center border-t border-[var(--border)] bg-gradient-to-br from-blue-600/15 to-rose-600/10 p-5 md:border-l md:border-t-0 md:p-6">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--blue-bright)]">
                  VIN
                </div>
                <div className="mt-2 break-all font-mono text-lg font-bold tracking-wide text-[var(--text-h)] md:text-xl">
                  {result.vin}
                </div>
                <div className="mt-4 text-sm text-[var(--text-muted)]">
                  Подобраны запчасти из каталога KoreParts для{" "}
                  <b className="text-[var(--text-h)]">{result.label}</b>
                </div>
              </div>
            </div>
          </div>

          {result.products.length > 0 ? (
            <div>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <h3 className="text-lg font-bold text-[var(--text-h)] md:text-xl">
                  Подходящие запчасти
                </h3>
                <Link
                  href={catalogHref}
                  className="text-sm font-semibold text-[var(--blue-bright)] hover:underline"
                >
                  Смотреть все →
                </Link>
              </div>
              <div className="grid-products">
                {result.products.slice(0, 8).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ) : (
            <div className="card p-6 text-center text-[var(--text-muted)]">
              Для этой модели пока мало позиций. Напишите в{" "}
              <a href={TELEGRAM_URL} className="text-[var(--blue-bright)] hover:underline">
                Telegram-бот
              </a>
              .
            </div>
          )}
        </div>
      )}
    </div>
  );
}
