/**
 * Статическая сборка для reg.ru / shared hosting.
 * Результат: папка dist/ (копия out/)
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const cwd = path.join(root, "..");

const env = { ...process.env, STATIC_EXPORT: "1" };

console.log("→ next build (STATIC_EXPORT=1)…");
const build = spawnSync("npx", ["next", "build"], {
  cwd,
  env,
  stdio: "inherit",
  shell: true,
});
if (build.status !== 0) process.exit(build.status ?? 1);

console.log("→ copy out/ → dist/…");
const copy = spawnSync("node", ["scripts/copy-to-dist.mjs"], {
  cwd,
  env,
  stdio: "inherit",
  shell: true,
});
process.exit(copy.status ?? 0);
