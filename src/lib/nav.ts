import { useCallback } from "react";
import { useRouter } from "@tanstack/react-router";
import type { NavTarget } from "@/data/cafe";
import { goTo, lenisRef, reducedMotion } from "./motion";

export const isPage = (target: NavTarget): target is "/menu" | "/contact" => target.startsWith("/");

/** Scrolls to a home scene when already home; otherwise routes there first. */
export function useGo() {
  const router = useRouter();
  return useCallback(
    (target: NavTarget) => {
      if (isPage(target)) {
        void router.navigate({ to: target });
      } else if (router.state.location.pathname === "/") {
        goTo(target);
      } else if (target === "entrance") {
        void router.navigate({ to: "/" });
      } else {
        void router.navigate({ to: "/", hash: target });
      }
    },
    [router],
  );
}

export function toTop() {
  if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.6 });
  else window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
}
