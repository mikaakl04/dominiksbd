import { useEffect, useRef } from "react";
import type { ParticleType } from "../data/themes";

interface Props {
  type: ParticleType;
  color: string;
}

interface Trail {
  x: number;
  y: number;
}

interface Rocket {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  hue: string;
  trail: Trail[];
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: string;
  life: number;
  maxLife: number;
}

const FIREWORK_COLORS = ["247, 201, 72", "255, 157, 92", "255, 244, 224", "255, 111, 140", "138, 210, 255"];

/**
 * Rockets that climb, burst, and drift down as embers.
 *
 * Kept deliberately cheap so it never drops frames: no shadowBlur (the usual
 * culprit), additive blending for the glow, and a translucent wipe instead of
 * clearRect so trails come for free. It also idles whenever the chapter is off
 * screen, so scrolling past costs nothing.
 */
function runFireworks(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  dpr: number,
  isMobile: boolean,
): () => void {
  let w = 0;
  let h = 0;
  // The canvas spans the whole (very tall) chapter, but the display should sit
  // in the band the reader actually sees when the chapter comes up.
  let band = 0;
  let rockets: Rocket[] = [];
  let sparks: Spark[] = [];
  let raf = 0;
  let running = false;
  let sinceLaunch = 0;

  const MAX_SPARKS = isMobile ? 170 : 330;
  const SPARKS_PER_BURST = isMobile ? 30 : 44;
  const LAUNCH_EVERY = isMobile ? 84 : 60;
  const GRAVITY = 0.045;
  const DRAG = 0.985;

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    band = Math.min(h, window.innerHeight);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function launch() {
    rockets.push({
      x: w * (0.15 + Math.random() * 0.7),
      y: band,
      // Fast enough to actually reach targetY before gravity stalls the climb.
      vy: -(5.4 + Math.random() * 1.3),
      targetY: band * (0.12 + Math.random() * 0.3),
      hue: FIREWORK_COLORS[(Math.random() * FIREWORK_COLORS.length) | 0],
      trail: [],
    });
  }

  function burst(x: number, y: number, hue: string) {
    if (sparks.length > MAX_SPARKS) return;
    for (let i = 0; i < SPARKS_PER_BURST; i++) {
      const angle = (Math.PI * 2 * i) / SPARKS_PER_BURST + Math.random() * 0.2;
      const speed = 0.8 + Math.random() * 1.5;
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        hue,
        life: 0,
        maxLife: 46 + Math.random() * 34,
      });
    }
  }

  function tick() {
    // Fade what's already drawn toward transparent rather than painting over it,
    // so the chapter's own background stays visible behind the display.
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.11)";
    ctx.fillRect(0, 0, w, band + 40);
    ctx.globalCompositeOperation = "lighter";

    if (++sinceLaunch >= LAUNCH_EVERY) {
      sinceLaunch = 0;
      if (rockets.length < (isMobile ? 2 : 3)) launch();
    }

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.y += r.vy;
      r.vy += GRAVITY * 0.5;

      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > 9) r.trail.shift();

      for (let t = 0; t < r.trail.length; t++) {
        const p = r.trail[t];
        const k = t / r.trail.length;
        ctx.fillStyle = `rgba(${r.hue}, ${k * 0.85})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2 * k + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (r.y <= r.targetY || r.vy >= 0) {
        // Flash at the moment of the burst.
        ctx.fillStyle = `rgba(${r.hue}, 0.5)`;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 16, 0, Math.PI * 2);
        ctx.fill();

        burst(r.x, r.y, r.hue);
        rockets.splice(i, 1);
      }
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= DRAG;
      s.vy = s.vy * DRAG + GRAVITY;
      s.life++;

      if (s.life >= s.maxLife) {
        sparks.splice(i, 1);
        continue;
      }

      const fade = 1 - s.life / s.maxLife;
      // Soft halo under a bright core reads as a glow without costing shadowBlur.
      ctx.fillStyle = `rgba(${s.hue}, ${fade * 0.22})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 5.5 * fade + 1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(${s.hue}, ${fade})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.1 * fade + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    sinceLaunch = LAUNCH_EVERY;
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  resize();

  // Only burn frames while the chapter is actually on screen.
  const io =
    typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) start();
            else {
              stop();
              rockets = [];
              sparks = [];
              ctx.globalCompositeOperation = "source-over";
              ctx.clearRect(0, 0, w, h);
            }
          },
          { rootMargin: "120px" },
        )
      : null;

  if (io) io.observe(canvas);
  else start();

  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  return () => {
    stop();
    io?.disconnect();
    window.removeEventListener("resize", onResize);
  };
}

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  life: number;
  maxLife: number;
}

export default function Particles({ type, color }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (type === "none") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isMobile = window.innerWidth < 720;

    if (type === "fireworks") {
      const cleanup = runFireworks(canvas, ctx, dpr, isMobile);
      return cleanup;
    }

    const counts: Record<ParticleType, number> = {
      dust: isMobile ? 18 : 34,
      sparks: isMobile ? 16 : 30,
      snow: isMobile ? 26 : 52,
      bokeh: isMobile ? 10 : 18,
      fireworks: 0,
      none: 0,
    };

    let particles: Particle[] = [];

    function resize() {
      const c = ref.current;
      if (!c) return;
      width = c.clientWidth;
      height = c.clientHeight;
      c.width = width * dpr;
      c.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(): Particle {
      if (type === "sparks") {
        return {
          x: width * (0.3 + Math.random() * 0.4),
          y: height * (0.4 + Math.random() * 0.4),
          r: Math.random() * 1.6 + 0.4,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -Math.random() * 0.6 - 0.15,
          a: Math.random() * 0.6 + 0.4,
          life: 0,
          maxLife: Math.random() * 200 + 120,
        };
      }
      if (type === "snow") {
        return {
          x: Math.random() * width,
          y: -10,
          r: Math.random() * 2.2 + 0.8,
          vx: (Math.random() - 0.5) * 0.3,
          vy: Math.random() * 0.5 + 0.25,
          a: Math.random() * 0.5 + 0.3,
          life: 0,
          maxLife: 99999,
        };
      }
      if (type === "bokeh") {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 40 + 20,
          vx: (Math.random() - 0.5) * 0.06,
          vy: (Math.random() - 0.5) * 0.06,
          a: Math.random() * 0.12 + 0.04,
          life: 0,
          maxLife: 99999,
        };
      }
      // dust
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.3,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -Math.random() * 0.08 - 0.02,
        a: Math.random() * 0.4 + 0.15,
        life: 0,
        maxLife: 99999,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: counts[type] }, spawn);
    }

    let raf = 0;
    function tick() {
      ctx!.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (type === "snow" && p.y > height + 10) {
          particles[i] = spawn();
          particles[i].y = -10;
          continue;
        }
        if (type === "sparks" && p.life > p.maxLife) {
          particles[i] = spawn();
          continue;
        }
        if ((type === "dust" || type === "bokeh") && (p.y < -50 || p.x < -50 || p.x > width + 50)) {
          particles[i] = spawn();
          continue;
        }

        let alpha = p.a;
        if (type === "sparks") {
          alpha = p.a * (1 - p.life / p.maxLife);
        }

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${color}, ${Math.max(alpha, 0)})`;
        if (type === "bokeh") {
          const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          grad.addColorStop(0, `rgba(${color}, ${alpha})`);
          grad.addColorStop(1, `rgba(${color}, 0)`);
          ctx!.fillStyle = grad;
        }
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    init();
    tick();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [type, color]);

  if (type === "none") return null;

  return <canvas ref={ref} className="particles-canvas" aria-hidden="true" />;
}
