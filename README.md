# KoreParts — магазин запчастей

Премиальный сайт-магазин для **Kia · Hyundai · Genesis**.

## Стек

- Next.js 16 (App Router)
- TypeScript + Tailwind CSS 4
- Корзина: `localStorage`
- Каталог: **92 товара** из Telegram-бота (`lib/bot-products.json`)

## Запуск

```powershell
cd C:\Users\Windows\koreparts-site
npm install
npm run dev
```

Откройте http://localhost:3000

## Production

```powershell
npm run build
npm start
```

## Страницы

| URL | Описание |
|-----|----------|
| `/` | Главная: hero, преимущества, категории, хиты |
| `/catalog` | Каталог + фильтры |
| `/product/[id]` | Карточка товара |
| `/cart` | Корзина |
| `/checkout` | Оформление заказа |
| `/delivery` | Доставка и оплата |
| `/contacts` | Контакты |

## Переменные

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Синхронизация с ботом

Товары экспортируются из `korea-parts-bot/bot/catalog.py` в `lib/bot-products.json`.
