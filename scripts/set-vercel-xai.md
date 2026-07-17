# Поставить ключ ИИ на Vercel (обязательно для koreparts.ru)

Сайт https://koreparts.ru уже ходит на:

```
https://koreparts-site.vercel.app/api/chat
```

Сейчас там **нет** `XAI_API_KEY` → помощник не отвечает.

## 2 минуты вручную

1. Откройте: https://vercel.com  
2. Проект **koreparts-site** (или ваш Next-проект)  
3. **Settings** → **Environment Variables**  
4. Add:

| Key | Value | Environments |
|-----|--------|----------------|
| `XAI_API_KEY` | ваш ключ `xai-...` | Production, Preview, Development |

5. **Save**  
6. **Deployments** → ⋮ на последнем → **Redeploy** (важно!)  
7. Проверка в браузере:

```
https://koreparts-site.vercel.app/api/chat
```

Должно быть: `"hasXaiKey": true`

8. Обновите https://koreparts.ru (Ctrl+F5) → Помощник → «Колодки Creta»

## CLI (если есть `vercel login`)

```powershell
cd C:\Users\Windows\koreparts-site
npx vercel login
npx vercel link
# вставьте ключ один раз:
echo xai-ВАШ_КЛЮЧ | npx vercel env add XAI_API_KEY production
echo xai-ВАШ_КЛЮЧ | npx vercel env add XAI_API_KEY preview
npx vercel --prod
```
