import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, isScrollLocked, lenisRef, reducedMotion } from "@/lib/motion";

export function SmoothScroll() {
  useEffect(() => {
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());
    if (reducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    if (isScrollLocked()) lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);
  return null;
}
