import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Личный кабинет",
  description:
    "Профиль, заказы и заявки KoreParts. История хранится в вашем браузере.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
