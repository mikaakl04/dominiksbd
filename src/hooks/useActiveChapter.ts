import { useEffect, useState } from "react";
import { chapters } from "../data/content";

/** Slug of the chapter currently filling the middle of the viewport. */
export function useActiveChapter(): string {
  const [active, setActive] = useState<string>(chapters[0].slug);

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(`chapter-${c.slug}`))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id.replace("chapter-", ""));
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return active;
}
