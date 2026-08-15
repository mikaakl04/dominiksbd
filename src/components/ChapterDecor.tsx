import type { ThemeKey } from "../data/content";

/** Hand-drawn-ish scenery per chapter. Purely decorative, never interactive. */
export default function ChapterDecor({ slug }: { slug: ThemeKey }) {
  if (slug === "paris") {
    return (
      <div className="decor decor--paris" aria-hidden="true">
        {/* Métro-style city map */}
        <svg className="decor-paris__map" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 6" />
          <circle cx="200" cy="200" r="105" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 6" />
          <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 6" />
          <path d="M20 200 H380 M200 20 V380" stroke="currentColor" strokeWidth="0.5" />
          <path d="M70 330 L200 200 L310 90" stroke="currentColor" strokeWidth="0.9" />
          <path d="M40 120 Q170 160 360 250" stroke="currentColor" strokeWidth="0.7" strokeDasharray="8 5" />
          {/* Seine */}
          <path d="M10 250 Q120 210 200 245 T390 220" stroke="currentColor" strokeWidth="2.4" opacity="0.45" />
          {[
            [200, 200],
            [310, 90],
            [70, 330],
            [120, 232],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="currentColor" opacity="0.55" />
          ))}
        </svg>

        <div className="decor-paris__flag">
          <span />
          <span />
          <span />
        </div>

        <svg className="decor-paris__tower" viewBox="0 0 60 160" fill="none">
          <path d="M30 4 V26 M22 40 Q30 20 38 40 M16 76 Q30 40 44 76 M8 150 Q30 70 52 150" stroke="currentColor" strokeWidth="1.1" />
          <path d="M18 70 H42 M12 108 H48 M6 150 H54" stroke="currentColor" strokeWidth="1" />
        </svg>

        {/* Croissant */}
        <svg className="decor-sticker decor-sticker--croissant" viewBox="0 0 100 64" fill="none">
          <path
            d="M12 44 Q6 30 18 24 Q34 15 50 15 Q66 15 82 24 Q94 30 88 44 Q80 38 70 40 Q60 30 50 30 Q40 30 30 40 Q20 38 12 44 Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path d="M32 38 Q40 26 50 26 Q60 26 68 38" stroke="#8a5a1e" strokeWidth="1.6" opacity="0.5" fill="none" />
        </svg>

        {/* Baguette */}
        <svg className="decor-sticker decor-sticker--baguette" viewBox="0 0 120 40" fill="none">
          <rect x="6" y="12" width="108" height="17" rx="8.5" fill="currentColor" opacity="0.9" />
          {[26, 44, 62, 80, 96].map((x) => (
            <path key={x} d={`M${x} 15 l7 5 l-7 5`} stroke="#8a5a1e" strokeWidth="1.5" opacity="0.5" fill="none" />
          ))}
        </svg>

        {/* Wine glass */}
        <svg className="decor-sticker decor-sticker--wine" viewBox="0 0 48 76" fill="none">
          <path d="M13 6 H35 L32 30 Q24 40 16 30 Z" fill="currentColor" opacity="0.85" />
          <path d="M24 40 V62 M14 66 H34" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (slug === "italien") {
    return (
      <div className="decor decor--italien" aria-hidden="true">
        <div className="decor-italien__flag">
          <span />
          <span />
          <span />
        </div>

        {/* Amalfi lemons, leaf and all */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <svg key={i} className={`decor-lemon decor-lemon--${i}`} viewBox="0 0 72 56" fill="none">
            <ellipse cx="32" cy="32" rx="22" ry="16" fill="currentColor" />
            <ellipse cx="25" cy="26" rx="7" ry="4" fill="#fff8d6" opacity="0.5" />
            <path d="M52 22 q8 -7 13 -13" stroke="#4c8a3a" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M50 20 q11 -4 15 -12 q-11 -1 -15 12 Z" fill="#57a043" opacity="0.95" />
          </svg>
        ))}

        {/* Stromboli, still smoking */}
        <svg className="decor-italien__volcano" viewBox="0 0 300 150" fill="none">
          <path d="M10 145 L110 45 Q150 20 190 45 L290 145 Z" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <path d="M130 42 q10 -22 20 -30 q8 16 20 28" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
          <path className="decor-smoke" d="M150 12 q-10 -18 4 -30 q14 -12 4 -28" stroke="currentColor" strokeWidth="1.4" opacity="0.4" strokeLinecap="round" />
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
        {[0, 1, 2].map((i) => (
          <svg key={i} className={`decor-flake decor-flake--${i}`} viewBox="0 0 40 40" fill="none">
            {[0, 60, 120].map((rot) => (
              <g key={rot} transform={`rotate(${rot} 20 20)`}>
                <path d="M20 3 V37" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M20 9 l5 5 M20 9 l-5 5 M20 31 l5 -5 M20 31 l-5 -5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </g>
            ))}
          </svg>
        ))}
      </div>
    );
  }

  if (slug === "sommer") {
    return (
      <div className="decor decor--sommer" aria-hidden="true">
        <div className="decor-sun" />
        <div className="decor-heat" />
      </div>
    );
  }

  if (slug === "sidequest") {
    return (
      <div className="decor decor--sidequest" aria-hidden="true">
        <div className="decor-spray decor-spray--1" />
        <div className="decor-spray decor-spray--2" />
        <div className="decor-grid" />
      </div>
    );
  }

  if (slug === "schule") {
    return (
      <div className="decor decor--schule" aria-hidden="true">
        <div className="decor-ruled" />
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
