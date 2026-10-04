import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/** Freezes looping CSS animations inside sections that are off screen, so only what's visible paints. */
export function PauseOffscreen() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.toggleAttribute("data-offscreen", !e.isIntersecting);
      },
      { rootMargin: "200px 0px" },
    );
    const id = requestAnimationFrame(() => {
      document.querySelectorAll("main section, footer").forEach((el) => io.observe(el));
    });
    return () => {
      cancelAnimationFrame(id);
      io.disconnect();
      document
        .querySelectorAll("[data-offscreen]")
        .forEach((el) => el.removeAttribute("data-offscreen"));
    };
  }, [path]);

  return null;
}
