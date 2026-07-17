# Выкладка KoreParts на reg.ru

Сайт собирается в **обычные HTML/CSS/JS** — подходит для **обычного хостинга** reg.ru (без Node.js).

---

## Быстрый старт (Windows)

```powershell
cd C:\Users\Windows\koreparts-site
npm install
npm run build:static
```

После сборки появятся:

| Что | Для чего |
|-----|----------|
| **`dist/`** | Папка сайта — заливать на хостинг |
| **`koreparts-regru.zip`** | Тот же сайт архивом (удобно залить одним файлом) |

Опционально — ваш домен (для sitemap / SEO):

```powershell
$env:NEXT_PUBLIC_SITE_URL = "https://ваш-домен.ru"
npm run build:static
```

---

## Загрузка на reg.ru

### Вариант А — архив (проще)

1. Войдите в **панель reg.ru** → хостинг → **Файловый менеджер** (ISPmanager).
2. Откройте корень сайта: обычно `www/ваш-домен.ru` или `public_html`.
3. Загрузите **`koreparts-regru.zip`**.
4. Распакуйте **прямо в этот каталог** (чтобы `index.html` лежал в корне, а не в `dist/`).
5. Удалите zip с сервера, если мешает.

### Вариант Б — папка `dist/`

1. Откройте тот же корень сайта.
2. Загрузите **содержимое** `dist/` (все файлы и папки **изнутри** `dist`, не саму папку `dist`).
3. В корне должны быть:
   - `index.html`
   - `_next/`
   - `logo.png`, `logo-header.png`
   - `.htaccess`
   - `catalog/`, `product/`, …

### Важно

- ❌ Неправильно: `public_html/dist/index.html`
- ✅ Правильно: `public_html/index.html`
- Включите **SSL (HTTPS)** для домена в панели reg.ru.
- После замены файлов сделайте **Ctrl+F5** в браузере.

---

## Что работает на reg.ru (static)

| Функция | Статус |
|---------|--------|
| Каталог, карточки, фильтры | ✅ |
| Корзина, оформление, кабинет | ✅ (в браузере, localStorage) |
| Заявка, VIN (демо) | ✅ |
| Логотип, Telegram, контакты | ✅ |
| ИИ-чат | ❌ нет сервера — предложит Telegram |
| Заявки / заказы на email | ✅ через Web3Forms (ключ вшит при сборке) |

ИИ можно оставить на **Vercel** (с `XAI_API_KEY`) или на **VPS reg.ru** с Node.js.

---

## Проверка после выкладки

Откройте:

- `https://ваш-домен.ru/`
- `/catalog/`
- `/product/...` (любой товар)
- `/cart/`, `/request/`, `/contacts/`
- Логотип в шапке

Если 404 на внутренних страницах — проверьте, что загружен **`.htaccess`** и на хостинге включён **mod_rewrite** (на reg.ru обычно да).

---

## Обновление сайта

1. Внесите правки локально.
2. Снова: `npm run build:static`
3. Залейте новый `dist/` или zip **поверх** старых файлов.

Обновление каталога из Excel:

```powershell
python scripts/import-pricelist.py "C:\path\to\price.xlsx"
npm run build:static
```

---

## VPS / Node.js на reg.ru (полный режим + ИИ)

Если есть Node.js:

```bash
npm install
npm run build
npm run start
```

Переменные окружения:

```
XAI_API_KEY=xai-...
NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru
```

Тогда ИИ-чат (`/api/chat`) будет работать.

---

## Проблемы

| Симптом | Что сделать |
|---------|-------------|
| Белый экран / старая версия | Ctrl+F5, очистить кэш, проверить что залит новый `dist` |
| Нет логотипа | Есть ли `logo.png` и `logo-header.png` в корне сайта |
| 404 на `/catalog` | Есть ли `.htaccess`, URL с `/` в конце: `/catalog/` |
| «ИИ недоступен» | Нормально для static — используйте Telegram |
| Сборка падает | `npm install`, Node ≥ 18, снова `npm run build:static` |
