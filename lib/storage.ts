/** localStorage: draft, orders, profile, requests, favorites */

const DRAFT_KEY = "koreparts-checkout-draft-v1";
const ORDERS_KEY = "koreparts-orders";
const PROFILE_KEY = "koreparts-profile-v1";
const REQUESTS_KEY = "koreparts-requests-v1";
const FAV_KEY = "koreparts-favorites-v1";
const SEEDED_KEY = "koreparts-account-seeded-v2";

export type CheckoutDraft = {
  name: string;
  phone: string;
  email?: string;
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
  email?: string;
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
  bonuses?: number;
};

export type SavedRequest = {
  id: string;
  createdAt: string;
  status: string;
  name: string;
  phone: string;
  email?: string;
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
  bonuses: 0,
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

export function loadFavorites(): string[] {
  return readJson<string[]>(FAV_KEY, []);
}

export function saveFavorites(ids: string[]) {
  writeJson(FAV_KEY, ids.slice(0, 100));
}

export function toggleFavorite(productId: string): string[] {
  const prev = loadFavorites();
  const next = prev.includes(productId)
    ? prev.filter((id) => id !== productId)
    : [productId, ...prev];
  saveFavorites(next);
  return next;
}

/** Демо-наполнение кабинета при первом визите */
export function ensureAccountDemo(): {
  profile: UserProfile;
  orders: SavedOrder[];
  requests: SavedRequest[];
  favorites: string[];
} {
  const already = typeof window !== "undefined" && localStorage.getItem(SEEDED_KEY);
  let profile = loadProfile();
  let orders = loadOrders();
  let requests = loadRequests();
  let favorites = loadFavorites();

  if (already) {
    return { profile, orders, requests, favorites };
  }

  if (!profile.name) {
    profile = {
      name: "Алексей",
      phone: "+7 (900) 123-45-67",
      email: "alexey@example.com",
      city: "Москва",
      carBrand: "Hyundai",
      carModel: "Creta",
      carYear: "2021",
      vin: "Z94G2811BMR234567",
      bonuses: 1250,
    };
    saveProfile(profile);
  } else if (profile.bonuses == null) {
    profile = { ...profile, bonuses: 500 };
    saveProfile(profile);
  }

  if (!orders.length) {
    orders = [
      {
        id: "WEB-20260315-01",
        createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
        status: "delivered",
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
        address: "ПВЗ СДЭК, ул. Ленина 12",
        comment: "",
        items: [
          {
            id: "581011ra00",
            name: "Колодка тормозная перед Mobis Велостер / Солярис / Рио",
            oem: "581011RA00",
            qty: 1,
            price: 1800,
          },
          {
            id: "demo-oil-filter",
            name: "Фильтр масляный Mobis",
            oem: "26300-35503",
            qty: 2,
            price: 720,
          },
        ],
        total: 3240,
      },
      {
        id: "WEB-20260402-02",
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        status: "shipped",
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
        address: "ПВЗ Boxberry",
        comment: "Позвоните за час",
        items: [
          {
            id: "553101c500",
            name: "Амортизатор Mobis Hyundai Getz 2002-",
            oem: "553101C500",
            qty: 2,
            price: 2500,
          },
        ],
        total: 5000,
      },
      {
        id: "WEB-20260410-03",
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        status: "new",
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
        address: profile.city,
        comment: "",
        items: [
          {
            id: "555103w000",
            name: "Стабилизатор задний Mobis Спортаж Туксон 09-",
            oem: "555103W000",
            qty: 1,
            price: 2500,
          },
        ],
        total: 2500,
      },
    ];
    writeJson(ORDERS_KEY, orders);
  }

  if (!requests.length) {
    requests = [
      {
        id: "REQ-20260408-01",
        createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        status: "done",
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
        brand: "Hyundai",
        model: "Creta",
        year: "2021",
        vin: profile.vin,
        partName: "Датчик ABS передний правый",
        oem: "95671-M0000",
        comment: "Подтвердили наличие, заказ оформлен",
      },
      {
        id: "REQ-20260414-02",
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: "in_progress",
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
        brand: "Hyundai",
        model: "Creta",
        year: "2021",
        vin: profile.vin,
        partName: "Ремень приводной + ролик",
        oem: "",
        comment: "Ждём поставку 2–3 дня",
      },
    ];
    writeJson(REQUESTS_KEY, requests);
  }

  if (!favorites.length) {
    favorites = ["581011ra00", "553101c500", "555103w000"].filter(Boolean);
    saveFavorites(favorites);
  }

  try {
    localStorage.setItem(SEEDED_KEY, "1");
  } catch {
    /* ignore */
  }

  return { profile, orders, requests, favorites };
}

export function orderStatusLabel(status: string): string {
  const map: Record<string, string> = {
    new: "Новый",
    processing: "В обработке",
    shipped: "В пути",
    delivered: "Доставлен",
    cancelled: "Отменён",
    done: "Выполнена",
    in_progress: "В работе",
  };
  return map[status] || status;
}

export function orderStatusTone(
  status: string,
): "blue" | "green" | "amber" | "muted" {
  if (status === "delivered" || status === "done") return "green";
  if (status === "shipped" || status === "in_progress") return "amber";
  if (status === "new" || status === "processing") return "blue";
  return "muted";
}
