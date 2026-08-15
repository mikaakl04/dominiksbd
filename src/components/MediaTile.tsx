import { useState } from "react";
import type { MediaAsset } from "../lib/assets";
import { withBase } from "../lib/assets";
import { useReveal } from "../hooks/useReveal";

interface Props {
  asset: MediaAsset;
  caption?: string;
  variant?: "hero" | "main" | "supporting";
  eager?: boolean;
  onOpen?: () => void;
}

export default function MediaTile({ asset, caption, variant = "main", eager = false, onOpen }: Props) {
  const { ref, visible } = useReveal<HTMLElement>();
  const [loaded, setLoaded] = useState(false);

  const w = asset.width ?? 3;
  const h = asset.height ?? 4;
  const portrait = h > w;
  const glowSrc = withBase(asset.type === "video" ? (asset.poster ?? asset.src) : (asset.srcWebp ?? asset.src));

  return (
    <figure
      ref={ref}
      className={`media-tile media-tile--${variant} ${portrait ? "is-portrait" : "is-landscape"} ${visible ? "is-visible" : ""} ${loaded ? "is-loaded" : ""}`}
    >
      <div className="media-tile__glow" style={{ backgroundImage: `url(${glowSrc})` }} aria-hidden="true" />
      <div className="media-tile__inner" style={{ aspectRatio: `${w} / ${h}` }}>
        {asset.type === "image" ? (
          <picture>
            {asset.srcWebp && <source srcSet={withBase(asset.srcWebp)} type="image/webp" />}
            <img
              src={withBase(asset.src)}
              alt={caption ?? ""}
              width={w}
              height={h}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              onLoad={() => setLoaded(true)}
              onClick={onOpen}
              data-clickable={onOpen ? "true" : undefined}
            />
          </picture>
        ) : (
          <>
            <video
              src={withBase(asset.src)}
              poster={asset.poster ? withBase(asset.poster) : undefined}
              width={w}
              height={h}
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onLoadedData={() => setLoaded(true)}
            />
            <span className="media-tile__videobadge" aria-hidden="true">
              ▶ Video
            </span>
          </>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
