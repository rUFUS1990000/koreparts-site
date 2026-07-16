import { NextResponse } from "next/server";
import { TELEGRAM_URL } from "@/lib/constants";
import { formatPrice, searchProducts } from "@/lib/products";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

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
export async function GET() {
  const hasKey = Boolean((process.env.XAI_API_KEY || "").trim());
  return NextResponse.json({
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
      return NextResponse.json(
        { error: "Пустое сообщение" },
        { status: 400 },
      );
    }

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser?.content?.trim()) {
      return NextResponse.json(
        { error: "Нужен текст пользователя" },
        { status: 400 },
      );
    }

    const apiKey = (process.env.XAI_API_KEY || "").trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "no_api_key",
          reply:
            "Ключ ИИ на Vercel ещё не подключён.\n\n1) Vercel → проект koreparts-site → Environment Variables\n2) Key: XAI_API_KEY  (именно так)\n3) Value: ваш ключ xai-...\n4) Environments: Production + Preview\n5) Save → Deployments → Redeploy\n\nПока можно написать в Telegram @KorePartsBot или оставить заявку /request",
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
      return NextResponse.json(
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

    return NextResponse.json({ reply });
  } catch (e) {
    console.error("chat route", e);
    return NextResponse.json(
      {
        error: "server",
        reply:
          "Ошибка сервера. Попробуйте позже или свяжитесь через Telegram @KorePartsBot.",
      },
      { status: 500 },
    );
  }
}
