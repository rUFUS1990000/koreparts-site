import { TELEGRAM_URL } from "@/lib/constants";

type Props = {
  href?: string;
  className?: string;
  children?: React.ReactNode;
  compact?: boolean;
};

export function TelegramLink({
  href = TELEGRAM_URL,
  className = "btn btn-accent btn-sm",
  children,
  compact,
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label="Написать в Telegram-бот KoreParts"
    >
      {children ?? (compact ? "✈️ Бот" : "✈️ Telegram-бот")}
    </a>
  );
}
