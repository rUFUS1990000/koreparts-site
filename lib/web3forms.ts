/**
 * Отправка форм через Web3Forms (работает на static / reg.ru).
 * Access key — публичный, предназначен для клиента.
 * https://web3forms.com
 */

/** Public access key (Web3Forms). Env перекрывает fallback. */
export const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() ||
  "6a2f894a-0873-47f2-bd53-bf82fc68a2ef";

export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export type Web3Result =
  | { ok: true }
  | { ok: false; skipped: true }
  | { ok: false; error: string };

export async function submitWeb3Form(fields: {
  subject: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  /** доп. поля в письме */
  [key: string]: string | undefined;
}): Promise<Web3Result> {
  if (!WEB3FORMS_ACCESS_KEY) {
    return { ok: false, skipped: true };
  }

  const phoneDigits = fields.phone.replace(/\D/g, "");
  // Web3Forms ждёт email; если клиент не указал — подставляем технический
  const email =
    fields.email?.trim() ||
    (phoneDigits
      ? `${phoneDigits}@phone.koreparts.client`
      : "no-email@koreparts.client");

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: fields.subject,
        name: fields.name,
        email,
        phone: fields.phone,
        message: fields.message,
        from_name: "KoreParts Site",
        // honeypot
        botcheck: "",
      }),
    });

    const data = (await res.json()) as {
      success?: boolean;
      message?: string;
    };

    if (!res.ok || !data.success) {
      return {
        ok: false,
        error: data.message || `Ошибка отправки (${res.status})`,
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Не удалось связаться с сервером форм. Проверьте интернет.",
    };
  }
}

export function formatRequestMessage(data: {
  id: string;
  name: string;
  phone: string;
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
