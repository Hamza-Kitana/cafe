import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useGo } from "@/lib/nav";
import { useI18n } from "@/i18n";
import { useUI } from "@/lib/ui";
import { Emblem } from "@/components/brand/Logo";

const tap = () => navigator.vibrate?.(8);

const icon = "h-[22px] w-[22px] fill-none stroke-current stroke-[1.6]";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" className={icon} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V10a8 8 0 0 1 16 0v10" />
    <path d="M9.5 20v-5a2.5 2.5 0 0 1 5 0v5M2.5 20h19" />
  </svg>
);
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" className={icon} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 9h12v4a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6V9Z" />
    <path d="M17 10.5h1.2a2.3 2.3 0 0 1 0 4.6H16.4M8.5 3.5c-.8 1 .8 2 0 3M12 3.5c-.8 1 .8 2 0 3" />
  </svg>
);
const ContactIcon = () => (
  <svg viewBox="0 0 24 24" className={icon} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
const MoreIcon = () => (
  <svg viewBox="0 0 24 24" className={icon} strokeLinecap="round">
    <path d="M4 7h16M4 12h11M4 17h16" />
  </svg>
);

function Tab({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={() => {
        tap();
        onClick();
      }}
      aria-current={active ? "page" : undefined}
      className={`tab-item relative flex flex-1 flex-col items-center justify-center gap-1 pb-1 pt-2 text-[0.62rem] font-semibold transition-colors duration-300 ${
        active ? "text-amber" : "text-cream/55"
      }`}
    >
      <span
        className={`absolute top-0 h-[3px] w-6 rounded-b-full bg-amber shadow-[0_0_12px_var(--amber)] transition-all duration-500 ${
          active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
        aria-hidden
      />
      <span className={`transition-transform duration-300 ${active ? "-translate-y-0.5" : ""}`}>
        {children}
      </span>
      <span className="leading-none">{label}</span>
    </button>
  );
}

/* Phone-only app chrome: a native-feeling tab bar resting on the home indicator. */
export function TabBar({ menuOpen, onMenu }: { menuOpen: boolean; onMenu: () => void }) {
  const { t } = useI18n();
  const { reserveOpen, setReserveOpen } = useUI();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const go = useGo();
  const hidden = menuOpen || reserveOpen;

  return (
    <nav
      aria-label={t.pages.label}
      className={`tab-bar fixed inset-x-3 bottom-[calc(0.6rem+env(safe-area-inset-bottom))] z-[65] transition-[transform,opacity] duration-500 ease-[cubic-bezier(.7,0,.2,1)] md:hidden ${
        hidden ? "pointer-events-none translate-y-[140%] opacity-0" : ""
      }`}
    >
      <div className="relative flex h-[4.1rem] items-stretch rounded-[1.6rem] px-1">
        <Tab label={t.pages["/"]} active={path === "/"} onClick={() => go("entrance")}>
          <HomeIcon />
        </Tab>
        <Tab label={t.pages["/menu"]} active={path === "/menu"} onClick={() => go("/menu")}>
          <MenuIcon />
        </Tab>
        <div className="flex flex-1 justify-center">
          <button
            onClick={() => {
              tap();
              setReserveOpen(true);
            }}
            className="tab-fab group relative -mt-6 flex h-[3.9rem] w-[3.9rem] flex-col items-center justify-center rounded-full text-ink"
            aria-label={t.nav.reserve}
          >
            <span className="tab-fab__ring absolute -inset-[5px] rounded-full" aria-hidden />
            <Emblem mono className="relative h-6 w-auto" />
            <span className="relative mt-0.5 text-[0.55rem] font-extrabold leading-none">
              {t.nav.reserve}
            </span>
          </button>
        </div>
        <Tab
          label={t.pages["/contact"]}
          active={path === "/contact"}
          onClick={() => go("/contact")}
        >
          <ContactIcon />
        </Tab>
        <Tab label={t.nav.more} active={menuOpen} onClick={onMenu}>
          <MoreIcon />
        </Tab>
      </div>
    </nav>
  );
}
