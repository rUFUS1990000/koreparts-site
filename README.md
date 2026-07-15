# KoreParts — магазин запчастей

Премиальный сайт для **Kia · Hyundai · Genesis**.

## Стек

- Next.js 16 (App Router) · TypeScript · Tailwind CSS 4  
- 92 товара из Telegram-бота  
- Корзина / checkout · VIN-подбор · PWA-ready  

## Локально

```powershell
cd C:\Users\Windows\koreparts-site
npm install
npm run dev
```

http://localhost:3000

```powershell
npm run build   # production-сборка для Vercel
npm start       # next start
```

## Деплой на Vercel

Подробно: **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)**

Кратко:

1. Залить на GitHub  
2. [vercel.com/new](https://vercel.com/new) → Import  
3. Env: `NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app`  
4. Deploy  

Конфиг: `vercel.json`, `next.config.ts`.

## Переменные

Скопируйте `.env.example` → `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Страницы

| URL | Описание |
|-----|----------|
| `/` | Главная |
| `/catalog` | Каталог + фильтры + поиск |
| `/product/[id]` | Карточка товара |
| `/cart` | Корзина |
| `/checkout` | Оформление |
| `/vin` | Подбор по VIN |
| `/delivery` | Доставка |
| `/contacts` | Контакты |

## Статический dist (опционально)

Для Nginx/S3 (не для Vercel):

```powershell
$env:STATIC_EXPORT="1"; npx next build; node scripts/copy-to-dist.mjs
```

© KoreParts
