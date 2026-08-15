import manifestRaw from "../data/manifest.json";

export type Role = "hero" | "main" | "supporting" | "archive";
export type MediaType = "image" | "video";

export interface MediaAsset {
  id: string;
  chapter: string;
  order: number;
  type: MediaType;
  role: Role;
  note: string | null;
  originalFilename: string;
  originalFolder: string;
  src: string;
  srcWebp?: string;
  poster?: string;
  width?: number;
  height?: number;
  orientation?: "landscape" | "portrait";
  duration?: number;
}

const manifest = manifestRaw as unknown as { assets: MediaAsset[] };

export function withBase(relPath: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  return base.replace(/\/$/, "") + "/" + relPath.replace(/^\//, "");
}

export function assetsForChapter(chapter: string): MediaAsset[] {
  return manifest.assets
    .filter((a) => a.chapter === chapter)
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function assetsByRole(chapter: string, role: Role): MediaAsset[] {
  return assetsForChapter(chapter).filter((a) => a.role === role);
}

export const allAssets = manifest.assets;

export function totalCounts() {
  const images = manifest.assets.filter((a) => a.type === "image").length;
  const videos = manifest.assets.filter((a) => a.type === "video").length;
  return { images, videos, total: manifest.assets.length };
}
