# ИИ-помощник на reg.ru (koreparts.ru)

## Почему на обычном reg.ru «не работает»

Обычный **виртуальный хостинг** (папка `public_html`, HTML/PHP) **не запускает Node.js**.

ИИ-чат ходит на сервер:

```
POST /api/chat  →  xAI (Grok)  →  ответ
```

Для этого нужен **Node.js** и ключ `XAI_API_KEY`.  
Статическая заливка `dist/` API **не содержит**.

---

## Рекомендуемый способ (проще всего)

### Сайт на reg.ru + ИИ на Vercel (бесплатно)

```
Посетитель → https://koreparts.ru          (reg.ru, static)
                  ↓
            помощник в браузере
                  ↓
            https://ВАШ-ПРОЕКТ.vercel.app/api/chat   (Node + ключ)
                  ↓
                 xAI Grok
```

### Шаг 1. Ключ xAI

1. https://console.x.ai → API Keys  
2. Создайте ключ `xai-...`  
3. **Никому не показывайте** и не коммитьте в git  

### Шаг 2. Деплой API на Vercel

1. https://vercel.com → Import репозиторий `koreparts-site` (GitHub)  
2. Framework: **Next.js**  
3. Build: `npm run build` (не static)  
4. **Settings → Environment Variables:**

| Name | Value |
|------|--------|
| `XAI_API_KEY` | `xai-...` ваш ключ |
| `NEXT_PUBLIC_SITE_URL` | `https://koreparts.ru` |

5. **Deploy** → дождитесь URL вида:  
   `https://koreparts-site-xxxx.vercel.app`

6. Проверка в браузере:

```
https://koreparts-site-xxxx.vercel.app/api/chat
```

Должен быть JSON вроде: `{"ok":true,"hasXaiKey":true,...}`

### Шаг 3. Подключить сайт на reg.ru к этому API

При **сборке static** для reg.ru задайте:

```powershell
cd C:\Users\Windows\koreparts-site

$env:NEXT_PUBLIC_SITE_URL = "https://koreparts.ru"
$env:NEXT_PUBLIC_CHAT_API_URL = "https://koreparts-site-xxxx.vercel.app/api/chat"
$env:NEXT_PUBLIC_YANDEX_CLIENT_ID = "d6b57abe6ad746f8945f188a4b251c2c"

npm run build:static
```

Залейте **`dist/`** (или zip) на reg.ru в корень сайта.

> URL Vercel подставьте **свой** из шага 2.

### Шаг 4. Проверка

1. https://koreparts.ru → кнопка **Помощник**  
2. Напишите: «Колодки на Creta»  
3. Должен прийти ответ ИИ  

---

## Способ 2: VPS reg.ru с Node.js (всё на одном сервере)

Если купили **VPS / Cloud** с Node:

```bash
# на сервере
git clone https://github.com/rUFUS1990000/koreparts-site.git
cd koreparts-site
npm install

# env
export XAI_API_KEY="xai-..."
export NEXT_PUBLIC_SITE_URL="https://koreparts.ru"

npm run build
npm run start
# слушает порт 3000 — в nginx/proxy пропишите домен → 3000
```

Или PM2:

```bash
npm i -g pm2
pm2 start npm --name koreparts -- start
pm2 save
```

**Не** используйте `build:static` — нужен обычный `npm run build` + `start`.

В панели VPS: firewall, SSL (Let's Encrypt), reverse proxy nginx.

---

## Способ 3: только Telegram

Если Vercel/VPS не хотите — ИИ можно не подключать.  
Виджет напишет «недоступен» и предложит **@KorePartsBot** / заявку.  
Заявки на email уже работают через Web3Forms.

---

## Переменные (шпаргалка)

| Переменная | Где | Зачем |
|------------|-----|--------|
| `XAI_API_KEY` | **только** Vercel / VPS (сервер) | Ключ Grok, секретный |
| `NEXT_PUBLIC_CHAT_API_URL` | Сборка static для reg.ru | Полный URL API на Vercel |
| `NEXT_PUBLIC_SITE_URL` | Везде | `https://koreparts.ru` |

---

## Проблемы

| Симптом | Решение |
|---------|---------|
| «ИИ недоступен на этом хостинге» | Нет API: соберите static с `NEXT_PUBLIC_CHAT_API_URL` или поднимите Node |
| `hasXaiKey: false` | Нет `XAI_API_KEY` на Vercel → добавьте + Redeploy |
| CORS / blocked | Обновите код API (CORS для koreparts.ru уже в репозитории) |
| Ответ долгий / ошибка | Проверьте баланс/лимит на console.x.ai |

---

## Мини-чеклист «ИИ на koreparts.ru»

- [ ] Ключ xAI создан  
- [ ] Проект на Vercel, `XAI_API_KEY` задан, Redeploy  
- [ ] `/api/chat` на Vercel отдаёт `hasXaiKey: true`  
- [ ] Static-сборка с `NEXT_PUBLIC_CHAT_API_URL=https://….vercel.app/api/chat`  
- [ ] `dist/` залит на reg.ru  
- [ ] Помощник на сайте отвечает  
