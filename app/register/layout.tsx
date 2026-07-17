import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Регистрация",
  description: "Регистрация в KoreParts: email, VK или Яндекс.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
