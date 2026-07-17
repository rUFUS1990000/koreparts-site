"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";

/**
 * OAuth redirect: VK / Яндекс возвращают token в #hash
 */
export default function AuthCallbackPage() {
  const { completeOAuthFromHash, user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (!hash || hash.length < 5) {
        // иногда token в query
        const q = window.location.search;
        if (q.includes("error")) {
          const p = new URLSearchParams(q);
          setError(p.get("error_description") || p.get("error") || "OAuth error");
          return;
        }
        setError("Нет токена от соцсети. Попробуйте войти снова.");
        return;
      }

      const res = await completeOAuthFromHash(hash);
      if (cancelled) return;
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDone(true);
      // убрать token из URL
      try {
        window.history.replaceState(null, "", "/auth/callback/");
      } catch {
        /* ignore */
      }
      router.replace("/account");
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [completeOAuthFromHash, router]);

  if (user && done) {
    return (
      <div className="container-kp py-16 text-center text-[var(--text-muted)]">
        Вход выполнен, перенаправляем…
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-kp flex min-h-[60vh] items-center justify-center py-10">
        <div className="card max-w-md p-8 text-center">
          <div className="text-3xl">⚠️</div>
          <h1 className="mt-3 text-xl font-bold text-[var(--text-h)]">
            Не удалось войти
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{error}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/login" className="btn btn-primary">
              Ко входу
            </Link>
            <Link href="/register" className="btn btn-ghost">
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-kp py-16 text-center">
      <div className="text-lg font-semibold text-[var(--text-h)]">
        Завершаем вход…
      </div>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Получаем данные из VK / Яндекс
      </p>
    </div>
  );
}
