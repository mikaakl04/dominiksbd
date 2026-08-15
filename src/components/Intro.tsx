import { useEffect, useRef, useState } from "react";
import { introContent } from "../data/content";

interface Props {
  onEnter: () => void;
}

export default function Intro({ onEnter }: Props) {
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timers: number[] = [];
    introContent.lines.forEach((_, i) => {
      timers.push(window.setTimeout(() => setPhase(i + 1), 900 + i * 1500));
    });
    timers.push(window.setTimeout(() => setPhase(introContent.lines.length + 1), 900 + introContent.lines.length * 1500 + 700));
    return () => timers.forEach(clearTimeout);
  }, []);

  function handleEnter() {
    setExiting(true);
    window.setTimeout(onEnter, 1100);
  }

  return (
    <div ref={rootRef} className={`intro ${exiting ? "intro--exiting" : ""}`}>
      <div className="intro__grain" aria-hidden="true" />
      <div className="intro__vignette" aria-hidden="true" />
      <div className="intro__lines">
        {introContent.lines.map((line, i) => (
          <p key={i} className={`intro__line ${phase > i ? "is-visible" : ""} ${phase > i + 1 ? "is-past" : ""}`}>
            {line}
          </p>
        ))}
      </div>

      <div className={`intro__title-block ${phase > introContent.lines.length ? "is-visible" : ""}`}>
        <h1 className="intro__name">{introContent.name}</h1>
        <p className="intro__subtitle">{introContent.subtitle}</p>
        <button className="intro__cta" onClick={handleEnter}>
          <span>{introContent.cta}</span>
        </button>
      </div>
    </div>
  );
}
