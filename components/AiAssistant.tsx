"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { TELEGRAM_URL } from "@/lib/constants";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Колодки на Hyundai Creta",
  "Фильтр масляный Solaris",
  "Как подобрать по VIN?",
  "Условия доставки",
];

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Здравствуйте! Я помощник KoreParts. Спрошу название детали, OEM, марку/модель или VIN — подскажу по каталогу.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      // На reg.ru (static) /api/chat нет — можно указать внешний URL (Vercel):
      // NEXT_PUBLIC_CHAT_API_URL=https://ваш-проект.vercel.app/api/chat
      const apiBase =
        (process.env.NEXT_PUBLIC_CHAT_API_URL || "").trim().replace(/\/$/, "") ||
        "/api/chat";

      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "Сервер ИИ вернул не JSON (часто static-хостинг без API).\n\nНужно: Vercel + XAI_API_KEY и NEXT_PUBLIC_CHAT_API_URL.\n\nПока — Telegram @KorePartsBot или заявка /request.",
          },
        ]);
        return;
      }

      const data = (await res.json()) as { reply?: string; error?: string };
      // 503/502 тоже могут нести полезный reply
      const reply =
        data.reply ||
        (res.ok
          ? "Не удалось ответить. Напишите в Telegram @KorePartsBot."
          : `Сервер ИИ: ошибка ${res.status}. Проверьте XAI_API_KEY на Vercel.`);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Нет связи с сервером ИИ (сеть или CORS).\n\n1) Vercel → XAI_API_KEY → Redeploy\n2) Сайт должен звать https://…vercel.app/api/chat\n\nПока — Telegram @KorePartsBot или /request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div
          className="card flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden shadow-2xl"
          style={{ height: "min(70vh, 520px)" }}
          role="dialog"
          aria-label="ИИ-помощник KoreParts"
        >
          <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-white">
            <div className="min-w-0">
              <div className="text-sm font-bold">ИИ-помощник</div>
              <div className="text-[11px] text-white/85">
                Подбор запчастей · OEM · доставка
              </div>
            </div>
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-lg hover:bg-white/25"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[var(--bg)] p-3">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[var(--blue)] text-white"
                      : "border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-h)]"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-xs text-[var(--text-muted)]">Печатает…</div>
            )}
            <div ref={bottomRef} />
          </div>

          {!messages.some((m) => m.role === "user") && (
            <div className="flex flex-wrap gap-1.5 border-t border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-h)] hover:border-blue-300 hover:text-[var(--blue-bright)]"
                  onClick={() => void send(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={onSubmit}
            className="flex gap-2 border-t border-[var(--border)] bg-[var(--bg-elevated)] p-3"
          >
            <input
              ref={inputRef}
              className="input flex-1 py-2 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Спросите про деталь или OEM…"
              disabled={loading}
              maxLength={1000}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm shrink-0"
              disabled={loading || !input.trim()}
            >
              →
            </button>
          </form>

          <div className="flex items-center justify-between gap-2 border-t border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-[10px] text-[var(--text-muted)]">
            <span>ИИ может ошибаться — уточняйте у менеджера</span>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--blue-bright)] hover:underline"
            >
              Telegram
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:brightness-110 sm:h-14"
        aria-expanded={open}
        aria-label={open ? "Закрыть помощника" : "Открыть ИИ-помощника"}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-base">
          {open ? "×" : "✦"}
        </span>
        <span className="pr-1">{open ? "Закрыть" : "Помощник"}</span>
      </button>

      {/* скрытая ссылка для SEO/доступности */}
      <span className="sr-only">
        <Link href="/request">Заявка на подбор</Link>
      </span>
    </div>
  );
}
