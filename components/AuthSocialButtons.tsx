"use client";

import { VK_APP_ID, vkAuthUrl, YANDEX_CLIENT_ID, yandexAuthUrl } from "@/lib/auth/oauth";

export function AuthSocialButtons({ mode }: { mode: "login" | "register" }) {
  const yandex = yandexAuthUrl();
  const vk = vkAuthUrl();
  const label = mode === "login" ? "Войти" : "Регистрация";

  function go(url: string | null, name: string, setupUrl: string) {
    if (!url) {
      alert(
        `${name} не настроен.\n\nДобавьте ключ приложения в .env.local и на Vercel:\n` +
          (name === "Яндекс"
            ? "NEXT_PUBLIC_YANDEX_CLIENT_ID=...\n\nСоздать: https://oauth.yandex.ru/"
            : "NEXT_PUBLIC_VK_APP_ID=...\n\nСоздать: https://dev.vk.com/") +
          `\n\nRedirect URI: ${typeof window !== "undefined" ? window.location.origin + "/auth/callback/" : ""}\n\nДокументация: ${setupUrl}`,
      );
      return;
    }
    window.location.href = url;
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() =>
          go(yandex, "Яндекс", "https://yandex.ru/dev/id/doc/ru/")
        }
        className="btn flex w-full items-center justify-center gap-2 border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-h)] hover:bg-[var(--bg-muted)]"
      >
        <YandexIcon />
        {label} через Яндекс
        {!YANDEX_CLIENT_ID ? (
          <span className="text-[10px] text-[var(--text-muted)]">(настроить)</span>
        ) : null}
      </button>
      <button
        type="button"
        onClick={() => go(vk, "VK", "https://dev.vk.com/")}
        className="btn flex w-full items-center justify-center gap-2 bg-[#0077FF] text-white hover:brightness-110"
      >
        <VkIcon />
        {label} через VK
        {!VK_APP_ID ? (
          <span className="text-[10px] text-white/80">(настроить)</span>
        ) : null}
      </button>
    </div>
  );
}

function YandexIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#FC3F1D" />
      <path
        fill="#fff"
        d="M13.2 18h-2.1l-.1-6.6L8.3 6h2.3l1.6 3.7c.2.5.4 1 .5 1.5h.1c.1-.5.3-1 .5-1.5L14.9 6h2.2l-2.7 5.4L13.2 18z"
      />
    </svg>
  );
}

function VkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.8 17.5c-5.5 0-8.6-3.8-8.7-10h2.7c.1 4.6 2.1 6.5 3.7 6.9V7.5h2.6v3.9c1.6-.2 3.2-2 3.8-3.9h2.6c-.5 2.5-2.4 4.4-3.7 5.1 1.4.6 3.5 2.2 4.3 5h-2.8c-.6-1.9-2.2-3.4-4.2-3.6v3.6h-.3z" />
    </svg>
  );
}
