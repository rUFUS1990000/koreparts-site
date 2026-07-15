import type { BrandId, Product } from "./types";
import {
  brandTitle,
  filterProducts,
  modelTitle,
  PRODUCTS,
} from "./products";

export type VinDecodeResult = {
  ok: true;
  vin: string;
  brand: BrandId;
  model: string;
  year: number;
  engine?: string;
  label: string;
  note: string;
  demo: boolean;
  products: Product[];
};

export type VinDecodeError = {
  ok: false;
  error: string;
};

export type VinResult = VinDecodeResult | VinDecodeError;

/** Примеры VIN для демо-подбора (заглушка) */
const DEMO_VINS: Record<
  string,
  { brand: BrandId; model: string; year: number; engine: string }
> = {
  // Hyundai Solaris
  Z94CU41DBBR123456: {
    brand: "hyundai",
    model: "solaris",
    year: 2018,
    engine: "1.6 Gamma",
  },
  // Hyundai Creta
  Z94G2811BMR234567: {
    brand: "hyundai",
    model: "creta",
    year: 2021,
    engine: "1.6 / 2.0",
  },
  // Hyundai Tucson
  KM8J3CA46LU345678: {
    brand: "hyundai",
    model: "tucson",
    year: 2020,
    engine: "2.0 Nu",
  },
  // Kia Rio
  Z94CB41AAGR456789: {
    brand: "kia",
    model: "rio",
    year: 2019,
    engine: "1.6 Gamma",
  },
  // Kia Sportage
  KNDPMCAC5L7567890: {
    brand: "kia",
    model: "sportage",
    year: 2020,
    engine: "2.0 / 2.4",
  },
  // Kia Sorento
  KNDXM81C8N5678901: {
    brand: "kia",
    model: "sorento",
    year: 2022,
    engine: "2.5 Smartstream",
  },
  // Genesis G70
  KMTG341A1MU678901: {
    brand: "genesis",
    model: "g70",
    year: 2021,
    engine: "2.0T",
  },
  // Genesis GV70
  KMTM281BBMU789012: {
    brand: "genesis",
    model: "gv70",
    year: 2022,
    engine: "2.5T",
  },
};

const YEAR_MAP: Record<string, number> = {
  A: 2010,
  B: 2011,
  C: 2012,
  D: 2013,
  E: 2014,
  F: 2015,
  G: 2016,
  H: 2017,
  J: 2018,
  K: 2019,
  L: 2020,
  M: 2021,
  N: 2022,
  P: 2023,
  R: 2024,
  S: 2025,
};

function normalizeVin(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-HJ-NPR-Z0-9]/g, "")
    .slice(0, 17);
}

function isValidVinFormat(vin: string): boolean {
  if (vin.length !== 17) return false;
  // I, O, Q запрещены в VIN
  if (/[IOQ]/.test(vin)) return false;
  return true;
}

function guessYear(vin: string): number {
  const code = vin[9];
  return YEAR_MAP[code] ?? 2020;
}

/**
 * Эвристика бренда по WMI (первые 3 символа) — демо, не полный декодер.
 */
function guessBrand(vin: string): BrandId {
  const wmi = vin.slice(0, 3);
  if (wmi.startsWith("KMT")) return "genesis";
  if (wmi.startsWith("KMH") || wmi.startsWith("KM8") || wmi.startsWith("NLH")) {
    return "hyundai";
  }
  if (
    wmi.startsWith("KNA") ||
    wmi.startsWith("KND") ||
    wmi.startsWith("KNC") ||
    wmi.startsWith("U5Y")
  ) {
    return "kia";
  }
  // Russian plants often Z94…
  if (wmi.startsWith("Z94")) {
    const c = vin[3];
    if (c === "C" || c === "K") return "kia";
    return "hyundai";
  }
  return "hyundai";
}

function guessModel(brand: BrandId, vin: string): string {
  // char-based stub pick stable model from VIN hash
  const models =
    brand === "hyundai"
      ? ["solaris", "creta", "tucson", "santafe", "elantra"]
      : brand === "kia"
        ? ["rio", "ceed", "sportage", "sorento", "k5"]
        : ["g70", "g80", "gv70", "gv80"];
  let h = 0;
  for (let i = 0; i < vin.length; i++) h = (h + vin.charCodeAt(i) * (i + 1)) % 997;
  return models[h % models.length];
}

function productsFor(brand: BrandId, model: string): Product[] {
  const exact = filterProducts({ brand, model, sort: "popular" });
  if (exact.length >= 4) return exact;
  // fallback: brand only
  return filterProducts({ brand, sort: "popular" });
}

/**
 * Имитация VIN-декодирования + подбор из каталога KoreParts.
 * Не является официальным декодером — демо для UI.
 */
export function decodeVinStub(input: string): VinResult {
  const vin = normalizeVin(input);

  if (vin.length < 11) {
    return {
      ok: false,
      error: "Введите VIN полностью (17 символов) или хотя бы 11+ для демо.",
    };
  }

  if (vin.length === 17 && !isValidVinFormat(vin)) {
    return {
      ok: false,
      error: "Некорректный VIN: недопустимые символы (I, O, Q) или длина.",
    };
  }

  // Exact demo map (pad short vins only if full key match after normalize)
  const demo = DEMO_VINS[vin];
  if (demo) {
    const products = productsFor(demo.brand, demo.model);
    return {
      ok: true,
      vin,
      brand: demo.brand,
      model: demo.model,
      year: demo.year,
      engine: demo.engine,
      label: `${brandTitle(demo.brand)} ${modelTitle(demo.brand, demo.model)}`,
      note: "Демо-расшифровка по известному примеру VIN. Для точного подбора напишите в Telegram-бот.",
      demo: true,
      products,
    };
  }

  // Partial match on first 11 of demo keys
  if (vin.length >= 11) {
    const prefix = vin.slice(0, 11);
    for (const [key, val] of Object.entries(DEMO_VINS)) {
      if (key.startsWith(prefix) || prefix === key.slice(0, 11)) {
        const products = productsFor(val.brand, val.model);
        return {
          ok: true,
          vin: vin.length === 17 ? vin : key,
          brand: val.brand,
          model: val.model,
          year: val.year,
          engine: val.engine,
          label: `${brandTitle(val.brand)} ${modelTitle(val.brand, val.model)}`,
          note: "Найден похожий демо-VIN. Показаны запчасти из каталога для этой модели.",
          demo: true,
          products,
        };
      }
    }
  }

  if (vin.length !== 17) {
    return {
      ok: false,
      error: `VIN должен быть 17 символов (сейчас ${vin.length}). Попробуйте пример ниже.`,
    };
  }

  const brand = guessBrand(vin);
  const model = guessModel(brand, vin);
  const year = guessYear(vin);
  const products = productsFor(brand, model);

  return {
    ok: true,
    vin,
    brand,
    model,
    year,
    engine: "уточняется",
    label: `${brandTitle(brand)} ${modelTitle(brand, model)}`,
    note: "Имитация подбора: бренд/модель определены эвристикой. Для точного подбора пришлите VIN менеджеру в @KorePartsBot.",
    demo: true,
    products,
  };
}

export const VIN_EXAMPLES = [
  { vin: "Z94CU41DBBR123456", label: "Hyundai Solaris" },
  { vin: "Z94G2811BMR234567", label: "Hyundai Creta" },
  { vin: "Z94CB41AAGR456789", label: "Kia Rio" },
  { vin: "KNDPMCAC5L7567890", label: "Kia Sportage" },
  { vin: "KNDXM81C8N5678901", label: "Kia Sorento" },
  { vin: "KMTG341A1MU678901", label: "Genesis G70" },
];

export function catalogCount(): number {
  return PRODUCTS.length;
}
