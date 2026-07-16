# Деплой KoreParts на Vercel

## Быстрый старт (рекомендуется)

### 1. GitHub

Репозиторий уже локально: `C:\Users\Windows\koreparts-site`

```powershell
cd C:\Users\Windows\koreparts-site
# если remote ещё нет:
# gh repo create koreparts-site --public --source=. --remote=origin --push
git push -u origin master
```

### 2. Импорт в Vercel

1. Откройте [vercel.com/new](https://vercel.com/new)
2. **Import** GitHub-репозиторий `koreparts-site`
3. Framework Preset: **Next.js** (определится сам)
4. Root Directory: `.` (корень)
5. Build Command: `npm run build` (по умолчанию)
6. Output: **не** указывайте `dist` — Vercel использует `.next`

### 3. Environment Variables (обязательно для ИИ)

В проекте Vercel: **Settings → Environment Variables** → добавить:

| Name | Value | Environments |
|------|--------|----------------|
| `NEXT_PUBLIC_SITE_URL` | `https://ваш-проект.vercel.app` | Production, Preview |
| `XAI_API_KEY` | `xai-...` ключ с https://console.x.ai | Production, Preview |

После сохранения env нажмите **Deployments → ⋮ → Redeploy** (без redeploy ключ не подхватится).

Ключ **нельзя** класть в GitHub / `.env` в репозитории — только в панели Vercel.

Опционально: Custom Domain в **Settings → Domains**.

### 4. Проверка

- Главная открывается  
- `/catalog` — фильтры  
- `/product/...` — карточки  
- Корзина (localStorage)  
- `/vin` — подбор  
- Кнопка **«Помощник»** — отвечает ИИ (если `XAI_API_KEY` задан)  

---

## CLI (альтернатива)

```powershell
npm i -g vercel
cd C:\Users\Windows\koreparts-site
vercel login
vercel          # preview
vercel --prod   # production
```

При промпте:
- Set up and deploy? **Y**
- Framework: **Next.js**
- Build: default

---

## Файлы для Vercel

| Файл | Назначение |
|------|------------|
| `vercel.json` | framework, headers, region `fra1` |
| `next.config.ts` | images Unsplash, без static export |
| `.env.example` | шаблон env |
| `package.json` → `build` | `next build` |

---

## Важно

1. **Не** ставьте Output Directory = `dist` — для Vercel это не нужно.  
2. `dist/` — только для статики (`npm run build:static`), другие хостинги.  
3. Node **≥ 18** (Vercel ставит сам).  
4. `node_modules` не коммитьте.  

---

## Статический export (не Vercel)

```powershell
# Windows PowerShell
$env:STATIC_EXPORT="1"; npm run build
# нужна доработка скрипта build:static — см. package.json
```

На Vercel используйте обычный `npm run build`.

---

## После деплоя

1. `NEXT_PUBLIC_SITE_URL` = production URL  
2. Redeploy  
3. Проверьте `/sitemap.xml` и `/robots.txt`  
4. (Опционально) подключите домен  

© KoreParts
