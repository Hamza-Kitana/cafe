import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion";
import { useI18n } from "@/i18n";

type Mode = "dot" | "label" | "aim";

/**
 * Context-aware cursor. Elements opt in with data-cursor="Label" or data-cursor-mode="aim";
 * links and buttons without a label fall back to "Go". Disabled on touch devices.
 */
export function Cursor() {
  const { t } = useI18n();
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<Mode>("dot");
  const [enabled, setEnabled] = useState(false);
  const go = useRef(t.cursor.go);
  go.current = t.cursor.go;

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current) return;
    document.body.classList.add("has-cursor");
    const xTo = gsap.quickTo(dot.current, "x", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(dot.current, "y", { duration: 0.3, ease: "power3" });
    let seen = false;
    const move = (e: PointerEvent) => {
      if (!seen) {
        seen = true;
        gsap.set(dot.current, { x: e.clientX, y: e.clientY });
        gsap.to(dot.current, { opacity: 1, duration: 0.2 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
      const target = e.target as HTMLElement | null;
      const aim = target?.closest?.("[data-cursor-mode='aim']");
      if (aim) {
        setMode("aim");
        setLabel("");
        return;
      }
      const el = target?.closest?.("[data-cursor]") as HTMLElement | null;
      const interactive = target?.closest?.("a, button, [role='tab'], label") ?? null;
      let text = "";
      if (el && (!interactive || el === interactive || interactive.contains(el)))
        text = el.dataset["cursor"] ?? "";
      else if (interactive) text = go.current;
      setLabel(text);
      setMode(text ? "label" : "dot");
    };
    const leave = () => gsap.to(dot.current, { opacity: 0, duration: 0.2 });
    const enter = () => seen && gsap.to(dot.current, { opacity: 1, duration: 0.2 });
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
      document.body.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[95] opacity-0" aria-hidden>
      <div className={`cursor-shape cursor-${mode}`}>
        {mode === "aim" ? (
          <svg viewBox="0 0 48 48" className="h-full w-full">
            <circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M24 2v12M24 34v12M2 24h12M34 24h12" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="1.8" fill="currentColor" />
          </svg>
        ) : (
          <span
            className={`text-[0.62rem] font-bold uppercase tracking-widest transition-opacity duration-200 ${mode === "label" ? "opacity-100" : "opacity-0"}`}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
