import type { BrandId, CategoryId, Product } from "./types";
import botProducts from "./bot-products.json";

export const BRANDS: Record<BrandId, string> = {
  hyundai: "Hyundai",
  kia: "Kia",
  genesis: "Genesis",
  ssangyong: "SsangYong",
};

export const MODELS: Record<BrandId, { id: string; title: string }[]> = {
  hyundai: [
    { id: "solaris", title: "Solaris" },
    { id: "creta", title: "Creta" },
    { id: "tucson", title: "Tucson" },
    { id: "santafe", title: "Santa Fe" },
    { id: "elantra", title: "Elantra / Avante" },
    { id: "sonata", title: "Sonata" },
    { id: "palisade", title: "Palisade" },
    { id: "starex", title: "Grand Starex / H-1" },
    { id: "staria", title: "Staria" },
    { id: "accent", title: "Accent" },
    { id: "getz", title: "Getz" },
    { id: "veloster", title: "Veloster" },
    { id: "porter", title: "Porter" },
    { id: "i20", title: "i20" },
    { id: "i30", title: "i30" },
    { id: "i40", title: "i40" },
    { id: "other", title: "Другие модели" },
  ],
  kia: [
    { id: "rio", title: "Rio" },
    { id: "ceed", title: "Ceed" },
    { id: "sportage", title: "Sportage" },
    { id: "sorento", title: "Sorento" },
    { id: "k5", title: "K5 / Optima" },
    { id: "carnival", title: "Carnival" },
    { id: "seltos", title: "Seltos" },
    { id: "cerato", title: "Cerato / Forte" },
    { id: "soul", title: "Soul" },
    { id: "kx7", title: "KX7" },
    { id: "stonic", title: "Stonic" },
    { id: "picanto", title: "Picanto" },
    { id: "other", title: "Другие модели" },
  ],
  genesis: [
    { id: "g70", title: "G70" },
    { id: "g80", title: "G80" },
    { id: "gv70", title: "GV70" },
    { id: "gv80", title: "GV80" },
    { id: "other", title: "Другие модели" },
  ],
  ssangyong: [
    { id: "kyron", title: "Kyron" },
    { id: "rexton", title: "Rexton" },
    { id: "actyon", title: "Actyon" },
    { id: "korando", title: "Korando / New Actyon" },
    { id: "rodius", title: "Rodius" },
    { id: "other", title: "Другие модели" },
  ],
};

/** Плоский список моделей для фильтра «Kia Rio», «Hyundai Creta»… */
export const ALL_MODELS: { brand: BrandId; model: string; label: string }[] = (
  Object.entries(MODELS) as [BrandId, { id: string; title: string }[]][]
).flatMap(([brand, list]) =>
  list.map((m) => ({
    brand,
    model: m.id,
    label: `${BRANDS[brand]} ${m.title}`,
  })),
);

export const CATEGORIES: Record<
  CategoryId,
  { title: string; emoji: string; blurb: string }
> = {
  engine: {
    title: "Двигатель и ГРМ",
    emoji: "⚙️",
    blurb: "ГРМ, помпы, термостаты, свечи",
  },
  chassis: {
    title: "Подвеска и рулевое",
    emoji: "🛞",
    blurb: "Амортизаторы, рычаги, наконечники",
  },
  brakes: {
    title: "Тормозная система",
    emoji: "🛑",
    blurb: "Колодки, диски, комплекты",
  },
  body: {
    title: "Кузов и оптика",
    emoji: "🚘",
    blurb: "Фары, зеркала, бамперы",
  },
  filters: {
    title: "Фильтры и расходники",
    emoji: "🧰",
    blurb: "Масляные, воздушные, салонные",
  },
  electric: {
    title: "Электрика и датчики",
    emoji: "🔌",
    blurb: "Датчики, катушки, АКБ",
  },
  oils: {
    title: "Масла и жидкости",
    emoji: "🛢️",
    blurb: "Моторные масла, ATF, антифриз",
  },
};

/** Товары из Telegram-бота KoreParts (единый каталог) */
export const PRODUCTS: Product[] = (botProducts as Product[]).map((p) => ({
  ...p,
  brand: p.brand as BrandId,
  category: p.category as CategoryId,
}));

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function brandTitle(id: BrandId | string): string {
  return BRANDS[id as BrandId] ?? id;
}

export function modelTitle(brand: BrandId | string, model: string): string {
  const list = MODELS[brand as BrandId];
  return list?.find((m) => m.id === model)?.title ?? model;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return PRODUCTS;
  const tokens = q.split(/\s+/).filter((t) => t.length >= 2);
  return PRODUCTS.filter((p) => {
    const hay =
      `${p.name} ${p.oem} ${p.desc} ${p.brand} ${p.model} ${BRANDS[p.brand as BrandId] ?? ""} ${modelTitle(p.brand, p.model)} ${CATEGORIES[p.category as CategoryId]?.title ?? ""}`.toLowerCase();
    if (hay.includes(q)) return true;
    return tokens.every((t) => hay.includes(t));
  });
}

export interface CatalogFilters {
  q?: string;
  brand?: string;
  model?: string;
  category?: string;
  /** Год выпуска авто — показать подходящие запчасти */
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-asc" | "price-desc" | "name" | "popular";
}

/** Годы для селекта (от новых к старым) */
export const YEAR_OPTIONS: number[] = Array.from(
  { length: 2026 - 1998 + 1 },
  (_, i) => 2026 - i,
);

/** Подходит ли товар к выбранному году авто */
export function productFitsYear(p: Product, year: number): boolean {
  if (p.yearFrom == null && p.yearTo == null) return true;
  const from = p.yearFrom ?? 1990;
  const to = p.yearTo ?? 2030;
  return year >= from && year <= to;
}

export function yearLabel(p: Product): string | null {
  if (p.yearFrom == null && p.yearTo == null) return null;
  if (p.yearFrom != null && p.yearTo != null) {
    if (p.yearFrom === p.yearTo) return String(p.yearFrom);
    return `${p.yearFrom}–${p.yearTo}`;
  }
  if (p.yearFrom != null) return `${p.yearFrom}+`;
  return `до ${p.yearTo}`;
}

export function filterProducts(f: CatalogFilters): Product[] {
  let list = [...PRODUCTS];

  if (f.q?.trim()) list = searchProducts(f.q);
  if (f.brand) list = list.filter((p) => p.brand === f.brand);
  if (f.model) list = list.filter((p) => p.model === f.model);
  if (f.category) list = list.filter((p) => p.category === f.category);
  if (f.year != null && !Number.isNaN(f.year)) {
    list = list.filter((p) => productFitsYear(p, f.year!));
  }
  if (f.minPrice != null && !Number.isNaN(f.minPrice)) {
    list = list.filter((p) => p.price >= f.minPrice!);
  }
  if (f.maxPrice != null && !Number.isNaN(f.maxPrice)) {
    list = list.filter((p) => p.price <= f.maxPrice!);
  }

  switch (f.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "name":
      list.sort((a, b) => a.name.localeCompare(b.name, "ru"));
      break;
    case "popular":
    default:
      list.sort(
        (a, b) =>
          Number(!!b.popular) - Number(!!a.popular) || a.price - b.price,
      );
      break;
  }

  return list;
}

export const popularProducts = PRODUCTS.filter((p) => p.popular).slice(0, 8);

export function priceRange(): { min: number; max: number } {
  const prices = PRODUCTS.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
