import { useEffect, type DependencyList, type RefObject } from "react";

/**
 * Adds `is-in` to every `.reveal` inside `scope` as it scrolls into view.
 * Re-scans when deps change so freshly rendered (e.g. filtered) elements animate too.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, deps: DependencyList = []) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        let delay = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.transitionDelay = `${delay}ms`;
          delay += 70;
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    root.querySelectorAll(".reveal:not(.is-in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
