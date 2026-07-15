import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Оформление заказа",
  description:
    "Оформите заказ запчастей KoreParts: контакты, адрес доставки, комментарий.",
  robots: { index: false, follow: true },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
