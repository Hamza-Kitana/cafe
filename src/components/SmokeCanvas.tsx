import { useEffect, useRef, type RefObject } from "react";
import { isMobile, reducedMotion } from "@/lib/motion";

export type SmokeState = { density: number; cover: number };

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  max: number;
  a: number;
};

/**
 * Lightweight 2D smoke: soft sprites rendered at half resolution (the blur hides it),
 * paused off-screen, fewer particles on mobile, static under reduced motion.
 * `state` is mutated by GSAP from the parent scene.
 */
export function SmokeCanvas({
  state,
  source,
  spread = 0,
  className = "",
}: {
  state: SmokeState;
  source: RefObject<HTMLElement | null>;
  /** Fraction of the source width that emits (0 = a point). */
  spread?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const SCALE = 0.5;
    const max = isMobile() ? 70 : 170;
    let w = 0;
    let h = 0;
    let visible = false;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };
    const particles: Particle[] = [];

    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 128;
    const sctx = sprite.getContext("2d")!;
    const g = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(240,230,215,0.55)");
    g.addColorStop(0.45, "rgba(225,215,200,0.22)");
    g.addColorStop(1, "rgba(220,210,195,0)");
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 128, 128);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = canvas.width = Math.max(1, Math.round(r.width * SCALE));
      h = canvas.height = Math.max(1, Math.round(r.height * SCALE));
    };
    resize();

    let rects: { c: DOMRect; s: DOMRect } | null = null;
    const sourcePoint = () => {
      const el = source.current;
      if (!el) return { x: w / 2, y: h * 0.4 };
      rects ??= { c: canvas.getBoundingClientRect(), s: el.getBoundingClientRect() };
      const { c, s } = rects;
      const jitter = (Math.random() - 0.5) * s.width * spread;
      return { x: (s.left + s.width / 2 + jitter - c.left) * SCALE, y: (s.top - c.top) * SCALE };
    };

    const spawn = (cover: boolean) => {
      if (particles.length >= max * (cover ? 1.6 : 1)) return;
      if (cover) {
        particles.push({
          x: Math.random() * w,
          y: h * (0.3 + Math.random() * 0.8),
          vx: (Math.random() - 0.5) * 0.6,
          vy: -0.2 - Math.random() * 0.4,
          r: 30 + Math.random() * 50,
          life: 0,
          max: 220 + Math.random() * 160,
          a: 0.9,
        });
      } else {
        const s = sourcePoint();
        particles.push({
          x: s.x + (Math.random() - 0.5) * 6,
          y: s.y,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.45 - Math.random() * 0.5,
          r: 6 + Math.random() * 6,
          life: 0,
          max: 260 + Math.random() * 200,
          a: 0.75,
        });
      }
    };

    const step = (t: number) => {
      rects = null;
      const spawnSource = state.density * 1.4;
      for (let i = 0; i < Math.floor(spawnSource + Math.random()); i++) spawn(false);
      for (let i = 0; i < Math.floor(state.cover * 5 + Math.random() * state.cover); i++)
        spawn(true);
      ctx.clearRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        p.life++;
        if (p.life > p.max) {
          particles.splice(i, 1);
          continue;
        }
        p.vx += Math.sin(t * 0.0006 + p.y * 0.02) * 0.012;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 3600) {
          const f = (1 - d2 / 3600) * 0.25;
          p.vx += (dx / 60) * f;
          p.vy += (dy / 60) * f;
        }
        p.vx *= 0.985;
        p.vy *= 0.992;
        p.x += p.vx;
        p.y += p.vy;
        p.r += 0.12 + state.cover * 0.2;
        const k = p.life / p.max;
        ctx.globalAlpha = Math.sin(Math.PI * k) * p.a * (0.5 + state.cover * 0.5);
        ctx.drawImage(sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (visible) step(t);
    };

    if (reducedMotion()) {
      for (let i = 0; i < 400; i++) step(i * 16);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    io.observe(canvas);
    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) * SCALE;
      mouse.y = (e.clientY - r.top) * SCALE;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [state, source, spread]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
