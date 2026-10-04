import { useEffect, useLayoutEffect, type DependencyList, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import { sound, type SoundName } from "./sound";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
export const isTouch = () => window.matchMedia("(pointer: coarse)").matches;
export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scenes rebuild independently (e.g. on language change), so triggers must refresh in
 * document order or pinned sections further down get the wrong offsets.
 */
function sortTriggers() {
  ScrollTrigger.sort((a: ScrollTrigger, b: ScrollTrigger) => {
    const ta = a.trigger instanceof Element ? a.trigger : null;
    const tb = b.trigger instanceof Element ? b.trigger : null;
    if (!ta || !tb) return ta ? -1 : tb ? 1 : 0;
    if (ta === tb) return 0;
    if (ta.contains(tb)) return -1;
    if (tb.contains(ta)) return 1;
    return ta.compareDocumentPosition(tb) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
}

let refreshQueued = false;
function queueRefresh() {
  if (refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    sortTriggers();
    ScrollTrigger.refresh();
  });
}

/** Scoped GSAP setup; reverted and rebuilt whenever deps change. */
export function useScene(
  scope: RefObject<HTMLElement | null>,
  fn: () => void,
  deps: DependencyList = [],
) {
  useIso(() => {
    if (!scope.current) return;
    const ctx = gsap.context(fn, scope);
    queueRefresh();
    return () => ctx.revert();
  }, deps);
}

/** Plays a sound when a scrubbed timeline passes `position` while scrolling forward. */
export function cue(tl: gsap.core.Timeline, name: SoundName, position: number | string) {
  tl.call(
    () => {
      if ((tl.scrollTrigger?.direction ?? 1) > 0) sound.play(name);
    },
    undefined,
    position,
  );
}

export const lenisRef: { current: Lenis | null } = { current: null };

export function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 1.8 });
  else el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
}

let lockCount = 0;
export const isScrollLocked = () => lockCount > 0;

/** Ref-counted so overlapping overlays (loader, menu, drawers) don't unlock each other. */
export function lockScroll(lock: boolean) {
  lockCount = Math.max(0, lockCount + (lock ? 1 : -1));
  const locked = lockCount > 0;
  if (lenisRef.current) {
    if (locked) lenisRef.current.stop();
    else lenisRef.current.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
