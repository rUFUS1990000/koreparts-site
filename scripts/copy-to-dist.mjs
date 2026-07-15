/**
 * Копирует статическую сборку Next (out/) → dist/
 * Запуск: STATIC_EXPORT=1 next build && node scripts/copy-to-dist.mjs
 * Для Vercel этот скрипт НЕ нужен.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "out");
const dest = path.join(root, "dist");

if (!fs.existsSync(src)) {
  console.error(
    "Папка out/ не найдена.\n" +
      "Соберите так: set STATIC_EXPORT=1 && npx next build && node scripts/copy-to-dist.mjs",
  );
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });

console.log("✅ Готово: dist/ (static export)");

