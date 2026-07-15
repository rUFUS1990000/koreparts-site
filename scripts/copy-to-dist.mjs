import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "out");
const dest = path.join(root, "dist");

if (!fs.existsSync(src)) {
  console.error("Папка out/ не найдена. Сначала выполните next build.");
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });

console.log("✅ Готово: dist/ (статическая сборка из out/)");
