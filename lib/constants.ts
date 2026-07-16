/** Публичные константы магазина */
export const SITE_NAME = "KoreParts";
export const SITE_TAGLINE = "Запчасти Kia · Hyundai · Genesis · SsangYong";
export const TELEGRAM_BOT = "KorePartsBot";
export const TELEGRAM_URL = "https://t.me/KorePartsBot";
export const TELEGRAM_ORDER_URL =
  "https://t.me/KorePartsBot?start=order_from_site";
export const PHONE_DISPLAY = "+7 (900) 000-00-00";
export const EMAIL_DISPLAY = "info@koreparts.ru";
export const WORK_HOURS = "Пн–Сб 10:00–20:00 (МСК)";

/** Inline script for <head> — prevents flash of wrong theme */
export const THEME_INIT_SCRIPT = `(function(){try{var k='koreparts-theme';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;


export function telegramProductUrl(oem: string, name: string): string {
  const text = encodeURIComponent(
    `Здравствуйте! Интересует товар:\n${name}\nOEM: ${oem}\nС сайта KoreParts`,
  );
  return `https://t.me/${TELEGRAM_BOT}?text=${text}`;
}

export function telegramRequestUrl(payload: {
  name: string;
  phone: string;
  partName: string;
  oem?: string;
  brand?: string;
  model?: string;
  vin?: string;
}): string {
  const lines = [
    "Заявка с сайта KoreParts",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    payload.brand || payload.model
      ? `Авто: ${[payload.brand, payload.model].filter(Boolean).join(" ")}`
      : "",
    payload.vin ? `VIN: ${payload.vin}` : "",
    `Деталь: ${payload.partName}`,
    payload.oem ? `OEM: ${payload.oem}` : "",
  ].filter(Boolean);
  return `https://t.me/${TELEGRAM_BOT}?text=${encodeURIComponent(lines.join("\n"))}`;
}
