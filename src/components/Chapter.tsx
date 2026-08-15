import type { CSSProperties } from "react";
import type { ChapterContent } from "../data/content";
import { themes } from "../data/themes";
import { assetsForChapter } from "../lib/assets";
import MediaTile from "./MediaTile";
import Particles from "./Particles";
import ChapterDecor from "./ChapterDecor";

interface Props {
  content: ChapterContent;
  onOpenLightbox?: (chapterSlug: string, assetId: string) => void;
}

export default function Chapter({ content, onOpenLightbox }: Props) {
  const theme = themes[content.slug];
  const assets = assetsForChapter(content.slug);

  const style: CSSProperties & Record<string, string> = {
    "--chapter-bg-1": theme.bg1,
    "--chapter-bg-2": theme.bg2,
    "--chapter-accent": theme.accent,
    "--chapter-fg": theme.fg,
    "--chapter-fg-dim": theme.fgDim,
  };

  // Hero + videos get full width; remaining images pair up two-by-two.
  const blocks: Array<{ kind: "full"; ids: string[] } | { kind: "pair"; ids: string[] }> = [];
  let pairBuffer: string[] = [];

  for (const a of assets) {
    const wantsFull = a.role === "hero" || a.type === "video";
    if (wantsFull) {
      if (pairBuffer.length) {
        blocks.push({ kind: "pair", ids: pairBuffer });
        pairBuffer = [];
      }
      blocks.push({ kind: "full", ids: [a.id] });
    } else {
      pairBuffer.push(a.id);
      if (pairBuffer.length === 2) {
        blocks.push({ kind: "pair", ids: pairBuffer });
        pairBuffer = [];
      }
    }
  }
  if (pairBuffer.length) blocks.push({ kind: "pair", ids: pairBuffer });

  const byId = new Map(assets.map((a) => [a.id, a]));

  return (
    <section id={`chapter-${content.slug}`} className="chapter" data-theme={content.slug} style={style}>
      <Particles type={theme.particle} color={theme.particleColor} />
      {theme.vignette && theme.vignette !== "none" && (
        <div className={`chapter__vignette chapter__vignette--${theme.vignette}`} aria-hidden="true" />
      )}
      {theme.scanlines && <div className="chapter__scanlines" aria-hidden="true" />}
      <ChapterDecor slug={content.slug} />

      <div className="container chapter__content">
        <header className="chapter__header">
          <div className="chapter__kicker-row">
            <span className="kicker">{content.kicker}</span>
            <span className="era-tag">{content.era}</span>
          </div>
          <h2 className="chapter__title">{content.title}</h2>
          {content.subtitle && <p className="chapter__subtitle">{content.subtitle}</p>}
          {content.note && <p className="chapter__note">{content.note}</p>}
        </header>

        <div className="chapter__stack">
          {blocks.map((block, i) => {
            if (block.kind === "full") {
              const a = byId.get(block.ids[0])!;
              return (
                <MediaTile
                  key={a.id}
                  asset={a}
                  caption={content.captions[a.id]}
                  variant="hero"
                  eager={i === 0}
                  onOpen={onOpenLightbox ? () => onOpenLightbox(content.slug, a.id) : undefined}
                />
              );
            }
            return (
              <div className="chapter__pair" key={block.ids.join("-")}>
                {block.ids.map((id) => {
                  const a = byId.get(id)!;
                  return (
                    <MediaTile
                      key={a.id}
                      asset={a}
                      caption={content.captions[a.id]}
                      variant="main"
                      onOpen={onOpenLightbox ? () => onOpenLightbox(content.slug, a.id) : undefined}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
