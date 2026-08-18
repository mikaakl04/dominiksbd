import { useEffect, useRef, useState } from "react";
import type { MediaAsset } from "../lib/assets";
import { withBase } from "../lib/assets";
import { useReveal } from "../hooks/useReveal";

/**
 * Phones can only decode a handful of videos at once — leaving every clip on
 * autoplay is what takes the tab down. Play only what's on screen, and drop the
 * decoder for anything far away.
 */
function useVideoInView(src: string) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute("src", src);
      return;
    }

    // Near: play what the reader can see, pause the rest.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.getAttribute("src")) el.setAttribute("src", src);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "150px" },
    );

    // Far: once well off screen, drop the source so the decoder is released.
    // A separate observer is needed because the near one only fires as the
    // element crosses the edge, when it is still close by.
    const far = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && el.getAttribute("src")) {
          el.pause();
          el.removeAttribute("src");
          el.load(); // frees the buffered data; the poster stays on screen
        }
      },
      { rootMargin: "1200px" },
    );

    near.observe(el);
    far.observe(el);
    return () => {
      near.disconnect();
      far.disconnect();
    };
  }, [src]);

  return ref;
}

interface Props {
  asset: MediaAsset;
  caption?: string;
  variant?: "hero" | "main" | "supporting";
  eager?: boolean;
  onOpen?: () => void;
}

export default function MediaTile({ asset, caption, variant = "main", eager = false, onOpen }: Props) {
  const { ref, visible } = useReveal<HTMLElement>();
  // Videos carry a poster, so they can show immediately; images fade in on load.
  const [loaded, setLoaded] = useState(asset.type === "video");
  const videoRef = useVideoInView(withBase(asset.src));

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
              ref={videoRef}
              poster={asset.poster ? withBase(asset.poster) : undefined}
              width={w}
              height={h}
              controls
              muted
              loop
              playsInline
              preload="none"
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
