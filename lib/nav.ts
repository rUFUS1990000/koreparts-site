import type { BrandId, CategoryId } from "./types";

/** Пункты верхнего меню (как Autodoc: каталоги + служебные) */
export const MAIN_NAV = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог", isCatalogs: true },
  { href: "/delivery", label: "Доставка" },
  { href: "/contacts", label: "Контакты" },
  { href: "/cart", label: "Корзина" },
] as const;

/**
 * Популярные разделы главной (как на Autodoc.ru):
 * ТО, оригинал, масла, подвеска и т.д.
 */
export type PopularSection = {
  id: string;
  title: string;
  blurb: string;
  href: string;
  /** иконка из CategoryIcon или спец. тип */
  icon: CategoryId | "to" | "oem";
  accent: "blue" | "red" | "green" | "amber" | "violet" | "sky" | "orange";
};

export const POPULAR_SECTIONS: PopularSection[] = [
  {
    id: "to",
    title: "ТО и расходники",
    blurb: "Фильтры, свечи, комплекты ТО",
    href: "/catalog?category=filters",
    icon: "to",
    accent: "sky",
  },
  {
    id: "oem",
    title: "Оригинальные запчасти",
    blurb: "OEM-артикулы · хиты продаж",
    href: "/catalog?hits=1&sort=popular",
    icon: "oem",
    accent: "blue",
  },
  {
    id: "oils",
    title: "Масла и жидкости",
    blurb: "Моторные, ATF, антифриз",
    href: "/catalog?category=oils",
    icon: "oils",
    accent: "orange",
  },
  {
    id: "chassis",
    title: "Подвеска",
    blurb: "Амортизаторы, рычаги, втулки",
    href: "/catalog?category=chassis",
    icon: "chassis",
    accent: "green",
  },
  {
    id: "brakes",
    title: "Тормоза",
    blurb: "Колодки, диски, комплекты",
    href: "/catalog?category=brakes",
    icon: "brakes",
    accent: "red",
  },
  {
    id: "engine",
    title: "Двигатель",
    blurb: "ГРМ, помпы, термостаты",
    href: "/catalog?category=engine",
    icon: "engine",
    accent: "violet",
  },
  {
    id: "electric",
    title: "Электрика",
    blurb: "Датчики, катушки, АКБ",
    href: "/catalog?category=electric",
    icon: "electric",
    accent: "amber",
  },
  {
    id: "body",
    title: "Кузов и оптика",
    blurb: "Фары, зеркала, бамперы",
    href: "/catalog?category=body",
    icon: "body",
    accent: "violet",
  },
];

export const BRAND_META: Record<
  BrandId,
  { title: string; tagline: string; color: string }
> = {
  kia: {
    title: "Kia",
    tagline: "Rio · Ceed · Sportage · Sorento · K5",
    color: "#e11d48",
  },
  hyundai: {
    title: "Hyundai",
    tagline: "Solaris · Creta · Tucson · Santa Fe · Elantra",
    color: "#2563eb",
  },
  genesis: {
    title: "Genesis",
    tagline: "G70 · G80 · GV70 · GV80",
    color: "#a78bfa",
  },
};

export const QUICK_SEARCHES = [
  "колодки",
  "фильтр масляный",
  "амортизатор",
  "свечи",
  "масло 5W-30",
] as const;
