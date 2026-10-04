import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { lockScroll } from "@/lib/motion";
import { useI18n } from "@/i18n";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  kicker?: string;
  accent?: string;
  children: ReactNode;
};

/** Side drawer that slides in from the end edge (right in English, left in Arabic). */
export function Drawer({ open, onClose, title, kicker, accent = "var(--amber)", children }: Props) {
  const { t } = useI18n();
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    lockScroll(true);
    const id = window.setTimeout(() => {
      if (window.matchMedia("(pointer: coarse)").matches) panel.current?.focus();
      else closeBtn.current?.focus();
    }, 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const focusables = panel.current.querySelectorAll<HTMLElement>(
        "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      prev?.focus();
    };
  }, [open, onClose]);

  /** Phone bottom sheet: drag it down past a threshold to dismiss. */
  const startDrag = (e: ReactPointerEvent) => {
    const el = panel.current;
    if (!el || e.pointerType === "mouse" || window.matchMedia("(min-width: 768px)").matches) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const y0 = e.clientY;
    let dy = 0;
    el.style.transition = "none";
    const move = (ev: PointerEvent) => {
      dy = Math.max(0, ev.clientY - y0);
      el.style.transform = `translateY(${dy}px)`;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      el.style.transition = "transform 0.4s cubic-bezier(.2,.8,.2,1)";
      el.style.transform = "";
      if (dy > 110) onClose();
      window.setTimeout(() => {
        el.style.transition = "";
      }, 400);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Portaled so pinned (transformed) sections can't trap it under the header.
  return createPortal(
    <div className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <div
        className={`absolute inset-0 bg-ink/70 backdrop-blur-[3px] transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-lenis-prevent
        tabIndex={-1}
        className={`absolute inset-x-0 bottom-0 flex outline-none max-h-[92svh] w-full flex-col overflow-hidden rounded-t-[1.75rem] bg-charcoal shadow-[0_0_80px_-10px_black] transition-[translate] duration-700 ease-[cubic-bezier(.7,0,.2,1)] md:inset-x-auto md:inset-y-0 md:end-0 md:max-h-none md:max-w-xl md:rounded-none ${
          open
            ? "translate-x-0 translate-y-0"
            : "translate-y-full md:translate-y-0 md:ltr:translate-x-full md:rtl:-translate-x-full"
        }`}
        style={{ ["--accent" as string]: accent }}
      >
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
        <div
          className="flex touch-none justify-center pb-1 pt-3 md:hidden"
          onPointerDown={startDrag}
          aria-hidden
        >
          <span className="h-1.5 w-11 rounded-full bg-cream/25" />
        </div>
        <div
          className="flex items-start justify-between gap-6 px-6 pb-4 pt-3 md:px-10 md:pt-8"
          onPointerDown={startDrag}
        >
          <div>
            {kicker && (
              <div className="kicker" style={{ color: accent }}>
                {kicker}
              </div>
            )}
            <h2 className="display mt-2 text-4xl md:text-5xl">{title}</h2>
          </div>
          <button
            ref={closeBtn}
            onClick={onClose}
            className="mt-1 shrink-0 rounded-full border border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-cream hover:text-ink"
          >
            {t.nav.close}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] md:px-10">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
