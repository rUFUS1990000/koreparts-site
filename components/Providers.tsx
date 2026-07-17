"use client";

import { AiAssistant } from "@/components/AiAssistant";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { AuthProvider } from "@/lib/auth/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { ThemeProvider } from "@/lib/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ServiceWorkerRegister />
          {children}
          <AiAssistant />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
