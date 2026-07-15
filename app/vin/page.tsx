import type { Metadata } from "next";
import { VinLookup } from "@/components/VinLookup";

export const metadata: Metadata = {
  title: "Подбор запчастей по VIN",
  description:
    "Подбор автозапчастей по VIN-коду для Kia, Hyundai, Genesis. Демо-расшифровка и каталог KoreParts.",
  openGraph: {
    title: "VIN-подбор | KoreParts",
    description: "Введите VIN — покажем подходящие запчасти из каталога.",
  },
};

export default function VinPage() {
  return (
    <div className="container-kp py-10 md:py-14">
      <VinLookup variant="full" />
      <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
        Сервис носит демонстрационный характер и не заменяет официальную
        расшифровку VIN у дилера. Для точного подбора используйте{" "}
        <a
          href="https://t.me/KorePartsBot"
          className="text-[var(--blue-bright)] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          @KorePartsBot
        </a>
        .
      </p>
    </div>
  );
}
