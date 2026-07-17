import {
  TELEGRAM_CHANNEL_URL,
  TELEGRAM_URL,
} from "@/lib/constants";

type Props = {
  href?: string;
  className?: string;
  children?: React.ReactNode;
  compact?: boolean;
  /** channel — ссылка на t.me/KoreParts, иначе бот */
  variant?: "bot" | "channel";
};

export function TelegramLink({
  href,
  className = "btn btn-accent btn-sm",
  children,
  compact,
  variant = "bot",
}: Props) {
  const url =
    href ?? (variant === "channel" ? TELEGRAM_CHANNEL_URL : TELEGRAM_URL);
  const isChannel = variant === "channel" || href === TELEGRAM_CHANNEL_URL;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={
        isChannel
          ? "Telegram-канал KoreParts"
          : "Написать в Telegram-бот KoreParts"
      }
    >
      {children ??
        (isChannel
          ? compact
            ? "📢 Канал"
            : "📢 t.me/KoreParts"
          : compact
            ? "✈️ Бот"
            : "✈️ Telegram-бот")}
    </a>
  );
}
