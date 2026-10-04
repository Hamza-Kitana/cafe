import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/motion";

type Props = {
  children: ReactNode;
  /** Pixels per second at rest. */
  speed?: number;
  reverse?: boolean;
  /** Skew and speed up with scroll velocity. */
  reactive?: boolean;
  pauseOnHover?: boolean;
  className?: string;
};

/**
 * Endless strip that drifts on its own, follows the scroll direction and leans into fast scrolls.
 * Content is rendered twice so the loop never shows a seam.
 */
export function Marquee({
  children,
  speed = 50,
  reverse = false,
  reactive = true,
  pauseOnHover = false,
  className = "",
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  useEffect(() => {
    const el = track.current;
    if (!el || !root.current || reducedMotion()) return;
    let x = 0;
    let boost = 0;
    let heading = 1;
    let visible = false;
    const skew = gsap.quickTo(el, "skewX", { duration: 0.5, ease: "power3" });
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      onToggle: (s) => (visible = s.isActive),
      onUpdate: (s) => {
        if (!reactive) return;
        const v = s.getVelocity();
        boost = gsap.utils.clamp(-10, 10, v / 250);
        if (Math.abs(v) > 20) heading = v > 0 ? 1 : -1;
      },
    });
    const tick = (_t: number, dt: number) => {
      if (!visible) return;
      const half = el.scrollWidth / 2;
      if (!half) return;
      const rate = pausedRef.current ? 0 : speed * (1 + Math.abs(boost));
      x += (reverse ? 1 : -1) * heading * rate * (dt / 1000);
      x = gsap.utils.wrap(-half, 0, x);
      gsap.set(el, { x });
      if (reactive) skew(-boost * 0.9);
      boost *= 0.9;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, [speed, reverse, reactive]);

  return (
    <div
      ref={root}
      dir="ltr"
      className={`overflow-hidden ${className}`}
      onPointerEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onPointerLeave={pauseOnHover ? () => setPaused(false) : undefined}
    >
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  );
}
