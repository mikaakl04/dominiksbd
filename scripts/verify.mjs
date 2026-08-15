import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const SRC_ROOT = "/Users/mikaklinke/Downloads/archive 2";
const manifest = JSON.parse(readFileSync(path.resolve("src/data/manifest.json"), "utf-8"));
const content = readFileSync(path.resolve("src/data/content.ts"), "utf-8");
const dist = path.resolve("dist");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === ".DS_Store") continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const sourceFiles = walk(SRC_ROOT);
const sourceImages = sourceFiles.filter((f) => /\.(jpe?g|heic|png)$/i.test(f));
const sourceVideos = sourceFiles.filter((f) => /\.(mp4|mov)$/i.test(f));

const assets = manifest.assets;
const manifestImages = assets.filter((a) => a.type === "image");
const manifestVideos = assets.filter((a) => a.type === "video");

let errors = 0;
const fail = (msg) => {
  console.error("  ✗ " + msg);
  errors++;
};

console.log("=== Quelle (ZIP-Archiv) ===");
console.log(`Bilder in Archiv:    ${sourceImages.length}`);
console.log(`Videos in Archiv:    ${sourceVideos.length}`);
console.log(`Medien insgesamt:    ${sourceImages.length + sourceVideos.length}`);

console.log("\n=== Manifest ===");
console.log(`Bilder im Manifest:  ${manifestImages.length}`);
console.log(`Videos im Manifest:  ${manifestVideos.length}`);
console.log(`Gesamt im Manifest:  ${assets.length}`);

if (manifestImages.length !== sourceImages.length) fail("Bildanzahl weicht vom Archiv ab");
if (manifestVideos.length !== sourceVideos.length) fail("Videoanzahl weicht vom Archiv ab");

// macOS reports filenames in NFD, JSON strings arrive as NFC — compare normalized.
const norm = (s) => s.normalize("NFC");

// Every source file must be referenced exactly once.
const referenced = new Set(assets.map((a) => norm(`${a.originalFolder}/${a.originalFilename}`)));
for (const f of [...sourceImages, ...sourceVideos]) {
  const rel = norm(path.relative(SRC_ROOT, f));
  if (!referenced.has(rel)) fail(`Quelldatei nicht im Manifest: ${rel}`);
}

const seen = new Map();
for (const a of assets) {
  const key = norm(`${a.originalFolder}/${a.originalFilename}`);
  if (seen.has(key)) fail(`Quelldatei doppelt referenziert: ${key}`);
  seen.set(key, a.id);
}

console.log("\n=== Erzeugte Dateien (public/) ===");
let missing = 0;
for (const a of assets) {
  for (const p of [a.src, a.srcWebp, a.poster].filter(Boolean)) {
    if (!existsSync(path.resolve("public", p))) {
      fail(`Datei fehlt in public/: ${p}`);
      missing++;
    }
  }
  if (!a.width || !a.height) fail(`Keine Dimensionen für ${a.id}`);
}
console.log(missing === 0 ? "  Alle Medien-Dateien vorhanden" : `  ${missing} Dateien fehlen`);

console.log("\n=== Auf der Website verwendet ===");
// Chapter slugs actually rendered by the app.
const renderedChapters = new Set([...content.matchAll(/slug:\s*"([a-z]+)"/g)].map((m) => m[1]));
const unusedAssets = assets.filter((a) => !renderedChapters.has(a.chapter));
console.log(`Kapitel im Story-Flow: ${renderedChapters.size}`);
console.log(`Assets in diesen Kapiteln: ${assets.length - unusedAssets.length} / ${assets.length}`);
if (unusedAssets.length) {
  for (const a of unusedAssets) fail(`Asset in keinem gerenderten Kapitel: ${a.id} (${a.chapter})`);
}

if (existsSync(dist)) {
  console.log("\n=== Production Build (dist/) ===");
  let distMissing = 0;
  for (const a of assets) {
    for (const p of [a.src, a.srcWebp, a.poster].filter(Boolean)) {
      if (!existsSync(path.join(dist, p))) {
        fail(`Fehlt im Build: ${p}`);
        distMissing++;
      }
    }
  }
  console.log(distMissing === 0 ? "  Alle Medien im Build enthalten" : `  ${distMissing} fehlen`);

  const html = readFileSync(path.join(dist, "index.html"), "utf-8");
  if (/(src|href)="\//.test(html)) fail("Absolute Pfade in index.html — bricht auf GitHub Pages unter /repo/");
  else console.log("  Asset-Pfade sind relativ (GitHub-Pages-tauglich)");
} else {
  console.log("\n(dist/ nicht vorhanden — 'npm run build' für Build-Prüfung ausführen)");
}

console.log("\n" + "=".repeat(46));
if (errors === 0) {
  console.log("✓ Alles vollständig. Unbeabsichtigt ungenutzt: 0");
  process.exit(0);
} else {
  console.log(`✗ ${errors} Problem(e) gefunden`);
  process.exit(1);
}
