import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вход",
  description: "Вход в личный кабинет KoreParts: email, VK, Яндекс.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
