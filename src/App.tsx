import { useEffect, useState } from "react";
import Intro from "./components/Intro";
import Chapter from "./components/Chapter";
import Finale from "./components/Finale";
import ProgressRail from "./components/ProgressRail";
import Lightbox from "./components/Lightbox";
import { ChapterParticles } from "./components/Particles";
import { useActiveChapter } from "./hooks/useActiveChapter";
import { chapters } from "./data/content";

/** A shared link like /#chapter-italien jumps straight to that chapter. */
function hasDeepLink() {
  if (typeof window === "undefined") return false;
  const h = window.location.hash;
  return h.startsWith("#chapter-") || h === "#finale";
}

export default function App() {
  const [entered, setEntered] = useState(hasDeepLink);
  const [lightbox, setLightbox] = useState<{ chapter: string; asset: string } | null>(null);
  const activeChapter = useActiveChapter();

  // The browser resolves the hash before React has rendered the chapters,
  // so a shared link would otherwise always land at the top of the page.
  useEffect(() => {
    if (!hasDeepLink()) return;
    const id = window.location.hash.slice(1);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView();
    });
  }, []);

  function handleRewind() {
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEntered(false);
  }

  return (
    <>
      <div className="grain" aria-hidden="true" />

      {!entered && (
        <Intro
          onEnter={() => {
            setEntered(true);
            requestAnimationFrame(() => {
              document.getElementById("chapter-silvester")?.scrollIntoView({ behavior: "smooth" });
            });
          }}
        />
      )}

      <main className={`main ${entered ? "main--visible" : "main--hidden"}`} aria-hidden={!entered}>
        {entered && <ChapterParticles slug={activeChapter} />}
        <ProgressRail />
        {chapters.map((c) => (
          <Chapter key={c.slug} content={c} onOpenLightbox={(chapter, asset) => setLightbox({ chapter, asset })} />
        ))}
        <Finale onRewind={handleRewind} />
      </main>

      {lightbox && (
        <Lightbox chapterSlug={lightbox.chapter} assetId={lightbox.asset} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}
