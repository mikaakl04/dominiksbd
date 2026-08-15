import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll that fails safe: if IntersectionObserver is unavailable,
 * the viewport reports no height, or the element already sits in view,
 * the content is shown immediately rather than staying invisible.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const viewportH = window.innerHeight || document.documentElement.clientHeight || 0;

    if (typeof IntersectionObserver === "undefined" || viewportH === 0) {
      setVisible(true);
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.top < viewportH && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, visible };
}
