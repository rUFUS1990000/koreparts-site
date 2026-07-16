# Деплой KoreParts на reg.ru

Сайт — Next.js. На **обычном хостинге reg.ru** (без Node.js) нужен **статический экспорт**.

## 1. Сборка на компьютере

```powershell
cd C:\Users\Windows\koreparts-site
npm install
npm run build:static
```

Готовая папка: **`dist/`** (HTML, CSS, JS, картинки).

Перед сборкой можно задать адрес сайта:

```powershell
$env:NEXT_PUBLIC_SITE_URL = "https://ваш-домен.ru"
npm run build:static
```

## 2. Загрузка на reg.ru

1. Войдите в панель **ISPmanager / Файловый менеджер**
2. Откройте каталог сайта (обычно `www/ваш-домен.ru` или `public_html`)
3. Загрузите **содержимое** папки `dist/` в корень сайта:
   - `index.html`
   - `catalog.html` / `catalog/`
   - `_next/`
   - и остальные файлы
4. Если есть старый `index.html` — замените

### Важно

- Загружайте **внутрь** `dist`, а не саму папку `dist` как вложенную.
- Для ЧПУ (красивые URL `/catalog`) хостинг должен отдавать `catalog/index.html` или `catalog.html` — Next static export создаёт оба варианта.
- SSL (HTTPS) включите в панели reg.ru для домена.

## 3. Проверка после выкладки

- Главная `/`
- `/catalog` — каталог
- `/request` — заявка
- `/account` — личный кабинет
- `/product/...` — карточка товара
- Корзина и кабинет работают в **браузере** (localStorage), без серверной БД

## 4. Если на reg.ru есть VPS / Node.js

Можно не static export, а обычный:

```bash
npm install
npm run build
npm run start
```

В панели укажите порт и `npm run start` (или PM2).  
`NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru`

## 5. Обновление каталога из прайса Excel

```powershell
python scripts/import-pricelist.py "C:\path\to\price.xlsx"
npm run build:static
```

Заново залейте `dist/` на хостинг.
