import type { ThemeKey } from "../data/content";

export default function ChapterDecor({ slug }: { slug: ThemeKey }) {
  if (slug === "paris") {
    return (
      <div className="decor decor--paris" aria-hidden="true">
        <div className="decor-paris__flag">
          <span />
          <span />
          <span />
        </div>
        <svg className="decor-paris__map" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 6" />
          <circle cx="200" cy="200" r="105" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 6" />
          <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 6" />
          <path d="M20 200 H380 M200 20 V380" stroke="currentColor" strokeWidth="0.5" />
          <path d="M70 330 L200 200 L310 90" stroke="currentColor" strokeWidth="0.8" />
        </svg>
        <svg className="decor-paris__tower" viewBox="0 0 60 160" fill="none">
          <path d="M30 4 V26 M22 40 Q30 20 38 40 M16 76 Q30 40 44 76 M8 150 Q30 70 52 150" stroke="currentColor" strokeWidth="1.1" />
          <path d="M18 70 H42 M12 108 H48 M6 150 H54" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  if (slug === "italien") {
    return (
      <div className="decor decor--italien" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} className={`decor-lemon decor-lemon--${i}`} viewBox="0 0 60 44" fill="none">
            <ellipse cx="28" cy="24" rx="20" ry="14" fill="currentColor" opacity="0.85" />
            <path d="M46 14 q7 -6 11 -11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M44 12 q9 1 12 -4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
          </svg>
        ))}
        <svg className="decor-italien__volcano" viewBox="0 0 300 150" fill="none">
          <path d="M10 145 L110 45 Q150 20 190 45 L290 145 Z" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <path d="M130 42 q10 -22 20 -30 q8 16 20 28" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
        </svg>
        <ul className="decor-places">
          {["Sorrento", "Taormina", "Stromboli"].map((p, i) => (
            <li key={p} style={{ animationDelay: `${i * 0.5}s` }}>
              {p}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (slug === "winter") {
    return (
      <div className="decor decor--winter" aria-hidden="true">
        <div className="decor-frost" />
      </div>
    );
  }

  if (slug === "sommer") {
    return (
      <div className="decor decor--sommer" aria-hidden="true">
        <div className="decor-sun" />
      </div>
    );
  }

  if (slug === "silvester") {
    return (
      <div className="decor decor--silvester" aria-hidden="true">
        <div className="decor-firework decor-firework--1" />
        <div className="decor-firework decor-firework--2" />
        <div className="decor-firework decor-firework--3" />
      </div>
    );
  }

  return null;
}
