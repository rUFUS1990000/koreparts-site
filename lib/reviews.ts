export type Review = {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  car: string;
  date: string;
};

export const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Алексей",
    city: "Москва",
    rating: 5,
    text: "Заказал колодки и фильтры на Creta — артикулы совпали 1 в 1. Доставили за 3 дня, всё оригинальное качество.",
    car: "Hyundai Creta",
    date: "2026-06-12",
  },
  {
    id: "r2",
    name: "Марина",
    city: "Казань",
    rating: 5,
    text: "Очень удобный сайт и бот в Telegram. Подсказали по VIN, что именно брать. Буду заказывать ещё.",
    car: "Kia Rio",
    date: "2026-05-28",
  },
  {
    id: "r3",
    name: "Игорь",
    city: "Екатеринбург",
    rating: 5,
    text: "Амортизаторы на Sportage пришли быстро. Цена ниже, чем у дилера, установка прошла без сюрпризов.",
    car: "Kia Sportage",
    date: "2026-06-02",
  },
  {
    id: "r4",
    name: "Дмитрий",
    city: "Новосибирск",
    rating: 4,
    text: "Масло и фильтр на Solaris — всё чётко. Хотелось бы ещё больше кузовщины, но расходники на высоте.",
    car: "Hyundai Solaris",
    date: "2026-04-19",
  },
  {
    id: "r5",
    name: "Сергей",
    city: "Санкт-Петербург",
    rating: 5,
    text: "Genesis G70 — нашёл performance-колодки. Менеджер в боте подтвердил совместимость. Рекомендую.",
    car: "Genesis G70",
    date: "2026-07-01",
  },
  {
    id: "r6",
    name: "Ольга",
    city: "Краснодар",
    rating: 5,
    text: "Сайт понятный, корзина сохраняется. Заказ оформила с телефона за пару минут.",
    car: "Hyundai Tucson",
    date: "2026-05-10",
  },
];

export const PROMOS = [
  {
    id: "sale-filters",
    title: "−15% на фильтры",
    text: "Масляные, воздушные и салонные — выгодный комплект на ТО",
    badge: "Акция",
    href: "/catalog?category=filters&sort=price-asc",
    accent: "blue" as const,
  },
  {
    id: "sale-brakes",
    title: "Комплект тормозов",
    text: "Колодки + диски со скидкой при заказе на одну ось",
    badge: "Хит",
    href: "/catalog?category=brakes",
    accent: "red" as const,
  },
  {
    id: "sale-vin",
    title: "Бесплатный подбор по VIN",
    text: "Введите VIN на сайте или в боте — подскажем точные артикулы",
    badge: "Сервис",
    href: "/vin",
    accent: "blue" as const,
  },
];
