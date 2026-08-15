import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const SRC_ROOT = "/Users/mikaklinke/Downloads/archive 2";
const OUT_ROOT = path.resolve("public/media");
const DATA_OUT = path.resolve("src/data/manifest.json");

const manifest = JSON.parse(readFileSync(path.resolve("scripts/manifest-source.json"), "utf-8"));

mkdirSync(path.join(OUT_ROOT, "images"), { recursive: true });
mkdirSync(path.join(OUT_ROOT, "video"), { recursive: true });
mkdirSync(path.join(OUT_ROOT, "posters"), { recursive: true });

function sh(cmd, args) {
  execFileSync(cmd, args, { stdio: "inherit" });
}

function probeDuration(file) {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file,
  ]).toString().trim();
  return parseFloat(out);
}

function probeDims(file) {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file]).toString();
  const w = /pixelWidth: (\d+)/.exec(out)?.[1];
  const h = /pixelHeight: (\d+)/.exec(out)?.[1];
  return { width: Number(w), height: Number(h) };
}

const outAssets = [];

for (const chapter of manifest.chapters) {
  const srcDir = path.join(SRC_ROOT, chapter.sourceDir);
  for (const asset of chapter.assets) {
    const srcFile = path.join(srcDir, asset.file);
    if (!existsSync(srcFile)) {
      console.error("MISSING SOURCE:", srcFile);
      process.exit(1);
    }

    const outAsset = {
      id: asset.id,
      chapter: chapter.slug,
      order: chapter.order,
      type: asset.type,
      role: asset.role,
      note: asset.note ?? null,
      originalFilename: asset.file,
      originalFolder: chapter.sourceDir,
    };

    if (asset.type === "image") {
      const isHeic = srcFile.toLowerCase().endsWith(".heic");
      const workJpg = path.join(OUT_ROOT, "images", `${asset.id}__work.jpg`);

      // Only HEIC needs sips (ImageMagick has no HEIC delegate here). Running
      // sips over JPEGs drops the EXIF orientation tag without rotating the
      // pixels, which would leave -auto-orient nothing to act on.
      if (isHeic) {
        sh("sips", ["-s", "format", "jpeg", srcFile, "--out", workJpg]);
      } else {
        sh("cp", [srcFile, workJpg]);
      }

      const maxW = asset.role === "hero" ? 1920 : asset.role === "main" ? 1400 : 1000;

      const jpgOut = path.join(OUT_ROOT, "images", `${asset.id}.jpg`);
      const webpOut = path.join(OUT_ROOT, "images", `${asset.id}.webp`);

      // Some Snapchat exports carry no EXIF orientation at all and are stored
      // rotated, so those carry an explicit rotate value in the source manifest.
      const rotate = asset.rotate ? ["-rotate", String(asset.rotate)] : [];

      sh("magick", [workJpg, "-auto-orient", ...rotate, "-resize", `${maxW}x${maxW}>`, "-quality", "82", jpgOut]);
      sh("magick", [workJpg, "-auto-orient", ...rotate, "-resize", `${maxW}x${maxW}>`, "-quality", "80", webpOut]);

      execFileSync("rm", [workJpg]);

      const finalDims = probeDims(jpgOut);

      outAsset.src = `media/images/${asset.id}.jpg`;
      outAsset.srcWebp = `media/images/${asset.id}.webp`;
      outAsset.width = finalDims.width;
      outAsset.height = finalDims.height;
      outAsset.orientation = finalDims.width >= finalDims.height ? "landscape" : "portrait";
    } else {
      const duration = probeDuration(srcFile);
      const maxW = asset.role === "hero" ? 960 : 720;
      const mp4Out = path.join(OUT_ROOT, "video", `${asset.id}.mp4`);
      const posterOut = path.join(OUT_ROOT, "posters", `${asset.id}.jpg`);

      sh("ffmpeg", [
        "-y", "-v", "error", "-i", srcFile,
        "-vf", `scale='min(${maxW},iw)':-2`,
        "-c:v", "libx264", "-preset", "veryslow", "-crf", "26",
        "-c:a", "aac", "-b:a", "96k",
        "-movflags", "+faststart",
        mp4Out,
      ]);

      const posterTs = Math.min(0.4, Math.max(0.1, duration * 0.15));
      sh("ffmpeg", [
        "-y", "-v", "error", "-ss", String(posterTs), "-i", srcFile,
        "-frames:v", "1", "-vf", `scale='min(${maxW},iw)':-2`, "-q:v", "3",
        posterOut,
      ]);

      outAsset.src = `media/video/${asset.id}.mp4`;
      outAsset.poster = `media/posters/${asset.id}.jpg`;
      outAsset.duration = Math.round(duration * 10) / 10;
    }

    outAssets.push(outAsset);
    console.log("OK", asset.id, asset.type, asset.role);
  }
}

mkdirSync(path.dirname(DATA_OUT), { recursive: true });
writeFileSync(DATA_OUT, JSON.stringify({ assets: outAssets }, null, 2));
console.log(`\nDone. ${outAssets.length} assets processed.`);
