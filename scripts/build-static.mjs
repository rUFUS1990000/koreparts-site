/**
 * Статическая сборка для reg.ru / shared hosting (без Node.js).
 *
 * Результат:
 *   dist/              — залить на хостинг
 *   koreparts-regru.zip — архив для загрузки одним файлом
 *
 * API /api/chat на static-хостинге недоступен — на время сборки
 * папка app/api временно убирается, затем возвращается.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.join(root, "app", "api");
const apiBackup = path.join(root, ".api-backup-static");

function run(cmd, args, env = {}) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: "inherit",
    shell: true,
  });
  if (r.status !== 0) {
    throw new Error(`Команда завершилась с кодом ${r.status}: ${cmd} ${args.join(" ")}`);
  }
}

function moveApiAside() {
  if (!fs.existsSync(apiDir)) return false;
  if (fs.existsSync(apiBackup)) {
    fs.rmSync(apiBackup, { recursive: true, force: true });
  }
  fs.renameSync(apiDir, apiBackup);
  console.log("→ app/api временно убран (static export не поддерживает API routes)");
  return true;
}

function restoreApi(moved) {
  if (!moved) return;
  if (fs.existsSync(apiDir)) {
    fs.rmSync(apiDir, { recursive: true, force: true });
  }
  if (fs.existsSync(apiBackup)) {
    fs.renameSync(apiBackup, apiDir);
    console.log("→ app/api восстановлен");
  }
}

async function zipDist() {
  const dist = path.join(root, "dist");
  const zipPath = path.join(root, "koreparts-regru.zip");
  if (!fs.existsSync(dist)) return;

  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  // PowerShell Compress-Archive — надёжно на Windows
  const ps = spawnSync(
    "powershell",
    [
      "-NoProfile",
      "-Command",
      `Compress-Archive -Path (Join-Path '${dist.replace(/'/g, "''")}' '*') -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force`,
    ],
    { cwd: root, stdio: "inherit", shell: false },
  );

  if (ps.status === 0 && fs.existsSync(zipPath)) {
    const mb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(1);
    console.log(`✅ Архив: koreparts-regru.zip (${mb} MB)`);
    return;
  }

  // fallback: без zip — не критично
  console.warn("⚠ Не удалось создать zip (можно залить папку dist/ вручную)");
}

let movedApi = false;

try {
  console.log("═══════════════════════════════════════");
  console.log("  KoreParts → static build (reg.ru)");
  console.log("═══════════════════════════════════════");

  movedApi = moveApiAside();

  // Сброс кэша типов Next — иначе ссылается на удалённый app/api
  const nextCache = path.join(root, ".next");
  if (fs.existsSync(nextCache)) {
    fs.rmSync(nextCache, { recursive: true, force: true });
    console.log("→ очищен .next/");
  }

  console.log("→ next build (STATIC_EXPORT=1)…");
  run("npx", ["next", "build"], { STATIC_EXPORT: "1" });

  console.log("→ copy out/ → dist/…");
  run("node", ["scripts/copy-to-dist.mjs"]);

  // Убедимся, что .htaccess и логотипы на месте
  const dist = path.join(root, "dist");
  for (const f of [".htaccess", "logo.png", "logo-header.png", "sw.js", "favicon.svg"]) {
    const p = path.join(dist, f);
    if (fs.existsSync(p)) {
      console.log(`  ✓ ${f}`);
    } else {
      console.warn(`  ⚠ нет файла: ${f}`);
    }
  }

  console.log("→ упаковка koreparts-regru.zip…");
  await zipDist();

  console.log("");
  console.log("═══════════════════════════════════════");
  console.log("  ГОТОВО к выкладке на reg.ru");
  console.log("═══════════════════════════════════════");
  console.log("  1) Папка:  dist/");
  console.log("  2) Архив:  koreparts-regru.zip");
  console.log("");
  console.log("  Залейте СОДЕРЖИМОЕ dist/ (или распакуйте zip)");
  console.log("  в корень сайта: public_html / www");
  console.log("");
  console.log("  ИИ-чат на shared-хостинге не работает —");
  console.log("  виджет предложит Telegram. Подробнее: DEPLOY_REGRU.md");
  console.log("═══════════════════════════════════════");
} catch (e) {
  console.error(e.message || e);
  process.exitCode = 1;
} finally {
  restoreApi(movedApi);
}
