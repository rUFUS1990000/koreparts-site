import { NextResponse } from "next/server";
import { TELEGRAM_URL } from "@/lib/constants";
import { formatPrice, searchProducts } from "@/lib/products";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

/**
 * CORS: сайт на reg.ru (koreparts.ru) ходит на Vercel /api/chat.
 * Разрешаем публичные origin магазина + * fallback (без cookies).
 */
function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get("origin") || "";
  const allowed = [
    "https://koreparts.ru",
    "https://www.koreparts.ru",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];
  const allowExact =
    allowed.includes(origin) ||
    origin.endsWith(".vercel.app") ||
    origin.endsWith(".koreparts.ru");
  // Если origin пустой (curl/server) — * ; иначе отражаем доверенный origin
  const aco = !origin ? "*" : allowExact ? origin : "https://koreparts.ru";
  return {
    "Access-Control-Allow-Origin": aco,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(
  req: Request,
  body: unknown,
  init?: { status?: number },
) {
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: corsHeaders(req),
  });
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

const SYSTEM = `Ты — ИИ-помощник интернет-магазина KoreParts (запчасти Kia, Hyundai, Genesis, SsangYong).
Отвечай по-русски, кратко и по делу. Помогай с подбором деталей, OEM, категориями, доставкой.

Правила:
- Не выдумывай точные цены/наличие, если их нет в контексте каталога — скажи проверить в каталоге или оставить заявку.
- Если клиент дал OEM или название — предложи похожие позиции из контекста.
- Для сложного подбора предложи /request (заявка) или Telegram: ${TELEGRAM_URL}
- VIN-подбор: /vin
- Каталог: /catalog
- Не проси банковские данные. Не обещай 100% совместимость без VIN/модели.
- Тон: дружелюбный консультант автозапчастей.`;

function catalogContext(userText: string): string {
  const hits = searchProducts(userText).slice(0, 8);
  if (!hits.length) {
    return "В каталоге по запросу точных совпадений не найдено — предложи заявку или уточнить марку/модель/VIN.";
  }
  return hits
    .map(
      (p) =>
        `• ${p.name} | OEM ${p.oem} | ${formatPrice(p.price)} | ${p.brand}/${p.model} | остаток ${p.stock} | /product/${p.id}`,
    )
    .join("\n");
}

/** Проверка: есть ли ключ (без раскрытия значения) */
export async function GET(req: Request) {
  const hasKey = Boolean((process.env.XAI_API_KEY || "").trim());
  return json(req, {
    ok: true,
    hasXaiKey: hasKey,
    hint: hasKey
      ? "Ключ XAI_API_KEY виден серверу"
      : "Ключа нет: добавьте XAI_API_KEY в Vercel Environment Variables и сделайте Redeploy",
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: ChatMessage[] };
    const messages = body.messages ?? [];
    if (!Array.isArray(messages) || messages.length === 0) {
      return json(req, { error: "Пустое сообщение" }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser?.content?.trim()) {
      return json(req, { error: "Нужен текст пользователя" }, { status: 400 });
    }

    const apiKey = (process.env.XAI_API_KEY || "").trim();
    if (!apiKey) {
      return json(
        req,
        {
          error: "no_api_key",
          reply:
            "Ключ ИИ на сервере ещё не подключён.\n\n1) Vercel → Environment Variables\n2) Key: XAI_API_KEY\n3) Value: xai-... с https://console.x.ai\n4) Redeploy\n\nПока Telegram @KorePartsBot или заявка /request",
        },
        { status: 503 },
      );
    }

    const context = catalogContext(lastUser.content);
    const systemWithCatalog = `${SYSTEM}\n\nФрагмент каталога по последнему запросу:\n${context}`;

    const payload = {
      model: process.env.XAI_MODEL || "grok-4.5",
      messages: [
        { role: "system", content: systemWithCatalog },
        ...messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) })),
      ],
      temperature: 0.4,
      max_tokens: 800,
    };

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("xAI error", res.status, errText.slice(0, 500));
      return json(
        req,
        {
          error: "upstream",
          reply:
            "Сейчас ИИ недоступен. Напишите в Telegram @KorePartsBot или оставьте заявку — ответим вручную.",
        },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Не удалось получить ответ. Попробуйте ещё раз или напишите в Telegram.";

    return json(req, { reply });
  } catch (e) {
    console.error("chat route", e);
    return json(
      req,
      {
        error: "server",
        reply:
          "Ошибка сервера. Попробуйте позже или свяжитесь через Telegram @KorePartsBot.",
      },
      { status: 500 },
    );
  }
}
