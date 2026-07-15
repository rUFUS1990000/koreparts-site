"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProduct } from "./products";
import type { CartItem, Product } from "./types";

const STORAGE_KEY = "koreparts-cart-v1";

type CartContextValue = {
  items: CartItem[];
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  totalQty: number;
  totalPrice: number;
  lines: { product: Product; qty: number; sum: number }[];
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((productId: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { productId, qty }];
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const lines = useMemo(() => {
    return items
      .map((i) => {
        const product = getProduct(i.productId);
        if (!product) return null;
        return { product, qty: i.qty, sum: product.price * i.qty };
      })
      .filter(Boolean) as { product: Product; qty: number; sum: number }[];
  }, [items]);

  const totalQty = useMemo(
    () => items.reduce((s, i) => s + i.qty, 0),
    [items],
  );
  const totalPrice = useMemo(
    () => lines.reduce((s, l) => s + l.sum, 0),
    [lines],
  );

  const value = useMemo(
    () => ({ items, add, remove, setQty, clear, totalQty, totalPrice, lines }),
    [items, add, remove, setQty, clear, totalQty, totalPrice, lines],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
