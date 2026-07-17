/**
 * Копирует статическую сборку Next (out/) → dist/
 * Обычно вызывается из: npm run build:static
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
      "Соберите: npm run build:static",
  );
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });

// .htaccess: Next иногда не копирует dotfiles — подстрахуемся
const htSrc = path.join(root, "public", ".htaccess");
const htDest = path.join(dest, ".htaccess");
if (fs.existsSync(htSrc) && !fs.existsSync(htDest)) {
  fs.copyFileSync(htSrc, htDest);
  console.log("  + скопирован .htaccess");
}

// PHP AI proxy + local key (reg.ru)
const apiPhp = path.join(root, "public", "api");
const apiDest = path.join(dest, "api");
if (fs.existsSync(apiPhp)) {
  fs.mkdirSync(apiDest, { recursive: true });
  for (const name of ["chat.php", "config.sample.php", "config.local.php"]) {
    const from = path.join(apiPhp, name);
    if (fs.existsSync(from)) {
      fs.copyFileSync(from, path.join(apiDest, name));
      console.log(`  + api/${name}`);
    }
  }
}

// Подсчёт
function countFiles(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) n += countFiles(p);
    else n += 1;
  }
  return n;
}

const files = countFiles(dest);
console.log(`✅ Готово: dist/ (${files} файлов, static export)`);

