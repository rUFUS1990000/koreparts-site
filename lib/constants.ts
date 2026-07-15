/** Публичные константы магазина */
export const SITE_NAME = "KoreParts";
export const SITE_TAGLINE = "Запчасти Kia · Hyundai · Genesis";
export const TELEGRAM_BOT = "KorePartsBot";
export const TELEGRAM_URL = "https://t.me/KorePartsBot";
export const TELEGRAM_ORDER_URL =
  "https://t.me/KorePartsBot?start=order_from_site";

export function telegramProductUrl(oem: string, name: string): string {
  const text = encodeURIComponent(
    `Здравствуйте! Интересует товар:\n${name}\nOEM: ${oem}\nС сайта KoreParts`,
  );
  return `https://t.me/${TELEGRAM_BOT}?text=${text}`;
}
