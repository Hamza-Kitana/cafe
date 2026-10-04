import { useEffect, useRef, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { I18nProvider } from "@/i18n";
import { UIProvider } from "@/lib/ui";
import { ScrollTrigger, lenisRef } from "@/lib/motion";
import { SmoothScroll } from "./SmoothScroll";
import { Cursor } from "./Cursor";
import { Nav } from "./Nav";
import { PauseOffscreen } from "./PauseOffscreen";
import { ReserveDrawer } from "./ReserveDrawer";
import { Footer } from "@/sections/Footer";

/** Every page starts at the top; Lenis must agree with the native position or it snaps back. */
function RouteScroll() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.location.hash) return;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [path]);
  return null;
}

/** Chrome shared by every page: language, smooth scroll, cursor, navigation, footer, booking. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <UIProvider>
        <div className="grain">
          <SmoothScroll />
          <RouteScroll />
          <PauseOffscreen />
          <Cursor />
          <Nav />
          {children}
          <Footer />
          <div
            className="h-[calc(5.5rem+env(safe-area-inset-bottom))] bg-ink md:hidden"
            aria-hidden
          />
          <ReserveDrawer />
        </div>
      </UIProvider>
    </I18nProvider>
  );
}
