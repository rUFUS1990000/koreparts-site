/** localStorage helpers for checkout draft & orders */

const DRAFT_KEY = "koreparts-checkout-draft-v1";
const ORDERS_KEY = "koreparts-orders";

export type CheckoutDraft = {
  name: string;
  phone: string;
  city: string;
  address: string;
  comment: string;
};

export type SavedOrder = {
  id: string;
  createdAt: string;
  status: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  comment: string;
  items: {
    id: string;
    name: string;
    oem: string;
    qty: number;
    price: number;
  }[];
  total: number;
};

export function loadCheckoutDraft(): CheckoutDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as CheckoutDraft) : null;
  } catch {
    return null;
  }
}

export function saveCheckoutDraft(draft: CheckoutDraft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* ignore */
  }
}

export function clearCheckoutDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

export function saveOrder(order: SavedOrder) {
  try {
    const prev = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]") as SavedOrder[];
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...prev].slice(0, 50)));
  } catch {
    /* ignore */
  }
}

export function loadOrders(): SavedOrder[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]") as SavedOrder[];
  } catch {
    return [];
  }
}
