import { useEffect } from "react";
import { allAssets, withBase } from "../lib/assets";
import { chapters } from "../data/content";

interface Props {
  chapterSlug: string;
  assetId: string;
  onClose: () => void;
}

export default function Lightbox({ chapterSlug, assetId, onClose }: Props) {
  const asset = allAssets.find((a) => a.id === assetId);
  const chapter = chapters.find((c) => c.slug === chapterSlug);
  const caption = chapter?.captions[assetId];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!asset) return null;

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lightbox__close" onClick={onClose} aria-label="Schließen">
        &times;
      </button>
      <div className="lightbox__stage" onClick={(e) => e.stopPropagation()}>
        {asset.type === "image" ? (
          <picture>
            {asset.srcWebp && <source srcSet={withBase(asset.srcWebp)} type="image/webp" />}
            <img src={withBase(asset.src)} alt={caption ?? asset.originalFilename} />
          </picture>
        ) : (
          <video src={withBase(asset.src)} poster={asset.poster ? withBase(asset.poster) : undefined} controls autoPlay playsInline />
        )}
        {caption && <p className="lightbox__caption">{caption}</p>}
      </div>
    </div>
  );
}
