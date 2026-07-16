/** localStorage: draft, orders, profile, requests */

const DRAFT_KEY = "koreparts-checkout-draft-v1";
const ORDERS_KEY = "koreparts-orders";
const PROFILE_KEY = "koreparts-profile-v1";
const REQUESTS_KEY = "koreparts-requests-v1";

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

export type UserProfile = {
  name: string;
  phone: string;
  email: string;
  city: string;
  carBrand: string;
  carModel: string;
  carYear: string;
  vin: string;
};

export type SavedRequest = {
  id: string;
  createdAt: string;
  status: string;
  name: string;
  phone: string;
  city: string;
  brand: string;
  model: string;
  year: string;
  vin: string;
  partName: string;
  oem: string;
  comment: string;
};

const emptyProfile = (): UserProfile => ({
  name: "",
  phone: "",
  email: "",
  city: "",
  carBrand: "",
  carModel: "",
  carYear: "",
  vin: "",
});

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function loadCheckoutDraft(): CheckoutDraft | null {
  return readJson<CheckoutDraft | null>(DRAFT_KEY, null);
}

export function saveCheckoutDraft(draft: CheckoutDraft) {
  writeJson(DRAFT_KEY, draft);
}

export function clearCheckoutDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

export function saveOrder(order: SavedOrder) {
  const prev = readJson<SavedOrder[]>(ORDERS_KEY, []);
  writeJson(ORDERS_KEY, [order, ...prev].slice(0, 50));
}

export function loadOrders(): SavedOrder[] {
  return readJson<SavedOrder[]>(ORDERS_KEY, []);
}

export function loadProfile(): UserProfile {
  return { ...emptyProfile(), ...readJson<Partial<UserProfile>>(PROFILE_KEY, {}) };
}

export function saveProfile(profile: UserProfile) {
  writeJson(PROFILE_KEY, profile);
}

export function saveRequest(req: SavedRequest) {
  const prev = readJson<SavedRequest[]>(REQUESTS_KEY, []);
  writeJson(REQUESTS_KEY, [req, ...prev].slice(0, 50));
}

export function loadRequests(): SavedRequest[] {
  return readJson<SavedRequest[]>(REQUESTS_KEY, []);
}
