import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Корзина KoreParts — проверьте заказ и перейдите к оформлению.",
  robots: { index: false, follow: true },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
