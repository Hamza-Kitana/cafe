import { useEffect, useRef, type ReactNode } from "react";
import { gsap, isTouch } from "@/lib/motion";

export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}

/** Pill button whose fill sweeps in from the reading direction on hover. */
export function FillButton({
  children,
  href,
  onClick,
  variant = "outline",
  className = "",
  external = false,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "outline" | "solid";
  className?: string;
  external?: boolean;
}) {
  const cls = `fill-btn ${variant === "solid" ? "fill-btn--solid" : ""} ${className}`;
  const inner = (
    <>
      <span className="fill-btn__bg" aria-hidden />
      <span className="relative z-10">{children}</span>
    </>
  );
  return (
    <Magnetic strength={0.25}>
      {href ? (
        <a
          href={href}
          className={cls}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={cls}>
          {inner}
        </button>
      )}
    </Magnetic>
  );
}
