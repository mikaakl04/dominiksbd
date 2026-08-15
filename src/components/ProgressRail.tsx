import { useEffect, useState } from "react";
import { chapters } from "../data/content";
import { themes } from "../data/themes";

export default function ProgressRail() {
  const [active, setActive] = useState<string>(chapters[0].slug);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sections = chapters.map((c) => document.getElementById(`chapter-${c.slug}`)).filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const slug = entry.target.id.replace("chapter-", "");
            setActive(slug);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));

    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav className={`progress-rail ${show ? "is-visible" : ""}`} aria-label="Kapitel-Navigation">
      {chapters.map((c) => {
        const theme = themes[c.slug];
        const isActive = active === c.slug;
        return (
          <a
            key={c.slug}
            href={`#chapter-${c.slug}`}
            className={`progress-rail__dot ${isActive ? "is-active" : ""}`}
            style={{ "--dot-color": theme.accent } as React.CSSProperties}
            title={c.title}
          >
            <span className="progress-rail__number">{String(c.order).padStart(2, "0")}</span>
            <span className="progress-rail__label">{c.title}</span>
          </a>
        );
      })}
    </nav>
  );
}
