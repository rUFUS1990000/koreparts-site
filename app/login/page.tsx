"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { AuthSocialButtons } from "@/components/AuthSocialButtons";
import { useAuth } from "@/lib/auth/auth-context";

function LoginForm() {
  const { loginWithEmail, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace(next);
  }, [authLoading, user, next, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginWithEmail(email, password);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.replace(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-kp flex min-h-[70vh] items-center justify-center py-10">
      <div className="card w-full max-w-md p-6 md:p-8">
        <div className="mb-1 text-center text-sm font-semibold uppercase tracking-wide text-[var(--blue-bright)]">
          KoreParts
        </div>
        <h1 className="text-center text-2xl font-black text-[var(--text-h)]">
          Вход в кабинет
        </h1>
        <p className="mt-1.5 text-center text-sm text-[var(--text-muted)]">
          Email и пароль или через VK / Яндекс
        </p>

        <div className="mt-6">
          <AuthSocialButtons mode="login" />
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <div className="h-px flex-1 bg-[var(--border)]" />
          или email
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-[var(--text-h)]">
              Email
            </span>
            <input
              className="input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              disabled={loading}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-[var(--text-h)]">
              Пароль
            </span>
            <input
              className="input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </label>

          {error ? (
            <p className="text-sm text-[var(--red-bright)]">{error}</p>
          ) : null}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Вход…" : "Войти"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
          Нет аккаунта?{" "}
          <Link
            href={`/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-semibold text-[var(--blue-bright)] hover:underline"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container-kp py-16 text-center text-[var(--text-muted)]">
          Загрузка…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
