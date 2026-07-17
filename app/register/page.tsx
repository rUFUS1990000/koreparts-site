"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { AuthSocialButtons } from "@/components/AuthSocialButtons";
import { useAuth } from "@/lib/auth/auth-context";

function RegisterForm() {
  const { registerWithEmail, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace(next);
  }, [authLoading, user, next, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== password2) {
      setError("Пароли не совпадают");
      return;
    }
    setLoading(true);
    try {
      const res = await registerWithEmail(name, email, password);
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
          Регистрация
        </h1>
        <p className="mt-1.5 text-center text-sm text-[var(--text-muted)]">
          Создайте аккаунт по email или через соцсети
        </p>

        <div className="mt-6">
          <AuthSocialButtons mode="register" />
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <div className="h-px flex-1 bg-[var(--border)]" />
          или email
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-[var(--text-h)]">
              Имя *
            </span>
            <input
              className="input"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к вам обращаться"
              disabled={loading}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-[var(--text-h)]">
              Email *
            </span>
            <input
              className="input"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              disabled={loading}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-[var(--text-h)]">
              Пароль *
            </span>
            <input
              className="input"
              type="password"
              required
              autoComplete="new-password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              disabled={loading}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-[var(--text-h)]">
              Повтор пароля *
            </span>
            <input
              className="input"
              type="password"
              required
              autoComplete="new-password"
              minLength={6}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Ещё раз"
              disabled={loading}
            />
          </label>

          {error ? (
            <p className="text-sm text-[var(--red-bright)]">{error}</p>
          ) : null}

          <button
            type="submit"
            className="btn btn-accent w-full"
            disabled={loading}
          >
            {loading ? "Создание…" : "Зарегистрироваться"}
          </button>
        </form>

        <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
          Регистрация по email хранится в браузере (подходит для static /
          reg.ru). Для общего сервера пользователей позже можно подключить
          облачную БД.
        </p>

        <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
          Уже есть аккаунт?{" "}
          <Link
            href={`/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-semibold text-[var(--blue-bright)] hover:underline"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="container-kp py-16 text-center text-[var(--text-muted)]">
          Загрузка…
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
