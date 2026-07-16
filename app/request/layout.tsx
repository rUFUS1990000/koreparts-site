import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Оставить заявку",
  description:
    "Заявка на подбор автозапчасти: VIN, OEM, марка и модель. KoreParts — Kia, Hyundai, Genesis, SsangYong.",
};

export default function RequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
