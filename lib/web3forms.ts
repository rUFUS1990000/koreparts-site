/**
 * Отправка форм через Web3Forms (клиентский fetch — free plan).
 * https://docs.web3forms.com
 *
 * Access key публичный — так и задумано.
 * Письма приходят на email, к которому привязан access key.
 */

/** Public access key (Web3Forms). Env перекрывает fallback. */
export const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() ||
  "7feebae0-b199-4b4b-9c5e-bb897061e0a0";

export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export type Web3Result =
  | { ok: true; message?: string }
  | { ok: false; skipped: true }
  | { ok: false; error: string };

/**
 * Отправка на Web3Forms только из браузера (не с сервера).
 * Free plan блокирует server-side → 403.
 */
export async function submitWeb3Form(fields: {
  subject: string;
  name: string;
  phone: string;
  /** Email клиента — для Reply-To; лучше реальный */
  email?: string;
  message: string;
}): Promise<Web3Result> {
  if (!WEB3FORMS_ACCESS_KEY) {
    return { ok: false, skipped: true };
  }

  const name = fields.name.trim();
  const phone = fields.phone.trim();
  const message = fields.message.trim();
  const email = (fields.email || "").trim();

  if (!name || !message) {
    return { ok: false, error: "Не заполнены обязательные поля" };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      ok: false,
      error: "Нужен корректный email клиента (Reply-To для Web3Forms)",
    };
  }

  // Только реальный email — фейковые домены (@phone.xxx) дают bounce
  // и могут попасть в suppression list на стороне Web3Forms.
  const payload: Record<string, string> = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: fields.subject,
    name,
    email,
    replyto: email,
    phone,
    message,
    from_name: "KoreParts",
  };

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data: {
      success?: boolean;
      message?: string;
      body?: { message?: string };
    } = {};

    const text = await res.text();
    try {
      data = JSON.parse(text) as typeof data;
    } catch {
      return {
        ok: false,
        error: `Сервер форм вернул не JSON (HTTP ${res.status}). Попробуйте Telegram.`,
      };
    }

    const msg =
      data.message || data.body?.message || `HTTP ${res.status}`;

    if (!res.ok || data.success === false) {
      return { ok: false, error: msg };
    }

    // success: true или 200
    if (data.success === true || res.status === 200) {
      return { ok: true, message: msg };
    }

    return { ok: false, error: msg };
  } catch (e) {
    const err = e instanceof Error ? e.message : "network";
    return {
      ok: false,
      error: `Нет связи с Web3Forms (${err}). Проверьте интернет или напишите в Telegram.`,
    };
  }
}

export function formatRequestMessage(data: {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  brand?: string;
  model?: string;
  year?: string;
  vin?: string;
  partName: string;
  oem?: string;
  comment?: string;
}): string {
  return [
    `Заявка ${data.id} с сайта KoreParts`,
    `Имя: ${data.name}`,
    `Телефон: ${data.phone}`,
    data.email ? `Email: ${data.email}` : "",
    data.city ? `Город: ${data.city}` : "",
    data.brand || data.model || data.year
      ? `Авто: ${[data.brand, data.model, data.year].filter(Boolean).join(" ")}`
      : "",
    data.vin ? `VIN: ${data.vin}` : "",
    `Деталь: ${data.partName}`,
    data.oem ? `OEM: ${data.oem}` : "",
    data.comment ? `Комментарий: ${data.comment}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatOrderMessage(data: {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  comment?: string;
  total: number;
  items: { name: string; oem: string; qty: number; price: number }[];
}): string {
  const lines = data.items
    .map(
      (it) =>
        `• ${it.name} (OEM ${it.oem}) × ${it.qty} = ${it.price * it.qty} ₽`,
    )
    .join("\n");
  return [
    `Заказ ${data.id} с сайта KoreParts`,
    `Имя: ${data.name}`,
    `Телефон: ${data.phone}`,
    data.email ? `Email: ${data.email}` : "",
    data.city ? `Город: ${data.city}` : "",
    data.address ? `Адрес: ${data.address}` : "",
    data.comment ? `Комментарий: ${data.comment}` : "",
    "",
    "Товары:",
    lines,
    "",
    `Итого: ${data.total} ₽`,
  ]
    .filter((x) => x !== undefined)
    .join("\n");
}
