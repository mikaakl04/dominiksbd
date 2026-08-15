import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const DATA = path.resolve("src/data/manifest.json");
const manifest = JSON.parse(readFileSync(DATA, "utf-8"));

for (const a of manifest.assets) {
  if (a.type !== "video") continue;
  const file = path.resolve("public", a.src);
  const out = execFileSync("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-of", "csv=p=0:s=x",
    file,
  ]).toString().trim();
  const [w, h] = out.split("x").map(Number);
  a.width = w;
  a.height = h;
  a.orientation = w >= h ? "landscape" : "portrait";
  console.log(a.id, w, h, a.orientation);
}

writeFileSync(DATA, JSON.stringify(manifest, null, 2));
console.log("done");
