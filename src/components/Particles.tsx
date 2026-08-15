import { useEffect, useRef } from "react";
import type { ParticleType } from "../data/themes";

interface Props {
  type: ParticleType;
  color: string;
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

    const counts: Record<ParticleType, number> = {
      dust: isMobile ? 18 : 34,
      sparks: isMobile ? 16 : 30,
      snow: isMobile ? 26 : 52,
      bokeh: isMobile ? 10 : 18,
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
