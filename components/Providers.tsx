"use client";

import { CartProvider } from "@/lib/cart-context";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ServiceWorkerRegister />
      {children}
    </CartProvider>
  );
}
