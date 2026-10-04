import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ScrollTrigger, lockScroll } from "@/lib/motion";
import { isPage, useGo } from "@/lib/nav";
import { useI18n } from "@/i18n";
import { useUI } from "@/lib/ui";
import { useSound } from "@/hooks/use-sound";
import { OpenStatus } from "@/components/OpenStatus";
import { images, type ImageKey } from "@/data/images";
import { cafe, digits, type NavTarget } from "@/data/cafe";
import { Photo } from "@/components/Photo";
import { Logo } from "@/components/brand/Logo";
import { TabBar } from "./TabBar";

const PREVIEW: Partial<Record<NavTarget, ImageKey>> = {
  inside: "indoor",
  drinks: "drinks",
  shisha: "lounge",
  billiards: "billiards",
  cards: "friends",
  seating: "outdoor",
  week: "friends",
  "/menu": "coffee",
  "/contact": "facade",
};

export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      dir="ltr"
      className={`relative flex items-center rounded-full border border-border p-1 text-xs font-semibold ${className}`}
      role="group"
      aria-label="Language / اللغة"
    >
      <span
        className="absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full bg-amber transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)]"
        style={{ transform: lang === "ar" ? "translateX(0)" : "translateX(100%)" }}
        aria-hidden
      />
      <button
        onClick={() => setLang("ar")}
        aria-pressed={lang === "ar"}
        lang="ar"
        className={`relative z-10 w-10 py-1 transition-colors ${lang === "ar" ? "text-ink" : "text-cream"}`}
        data-cursor="ع"
      >
        AR
      </button>
      <button
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        lang="en"
        className={`relative z-10 w-10 py-1 transition-colors ${lang === "en" ? "text-ink" : "text-cream"}`}
        data-cursor="EN"
      >
        EN
      </button>
      <span className="sr-only">{t.brand}</span>
    </div>
  );
}

function SoundToggle() {
  const { enabled, toggle } = useSound();
  const { t } = useI18n();
  return (
    <button
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? t.nav.soundOff : t.nav.soundOn}
      className="group flex h-9 items-center gap-2 rounded-full border border-border px-3 text-[0.6rem] font-semibold uppercase tracking-widest"
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[2px] rounded-full bg-cream ${enabled ? "eq-bar" : "h-[3px]"}`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
      <span className="hidden lg:inline">{enabled ? "ON" : "OFF"}</span>
    </button>
  );
}

export function Nav() {
  const { t, lang } = useI18n();
  const { setReserveOpen } = useUI();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<NavTarget>("inside");
  const go = useGo();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const bar = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (s) => {
        if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!open) return;
    const trigger = menuBtn.current;
    lockScroll(true);
    const id = window.setTimeout(() => {
      if (!window.matchMedia("(pointer: coarse)").matches) firstLink.current?.focus();
    }, 300);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      trigger?.focus();
    };
  }, [open]);

  const navigate = (target: NavTarget) => {
    setOpen(false);
    window.setTimeout(() => go(target), 350);
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[2px]" aria-hidden>
        <div
          ref={bar}
          className="h-full origin-[0_50%] bg-amber rtl:origin-[100%_50%]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] md:px-8 md:pt-4">
        <button
          onClick={() => go("entrance")}
          className="nav-pill group flex min-w-0 items-center py-1.5 pe-5 ps-3"
          data-cursor={t.brand}
          aria-label={t.brand}
        >
          <Logo size="sm" />
        </button>
        <div className="nav-pill flex shrink-0 items-center gap-2 p-1.5">
          <SoundToggle />
          <LangSwitch />
          <nav aria-label={t.pages.label} className="hidden items-center gap-1 px-1 lg:flex">
            {(["/", "/menu", "/contact"] as const).map((to) => (
              <Link
                key={to}
                to={to}
                className={`relative rounded-full px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-widest transition-colors ${
                  path === to ? "bg-cream/10 text-amber" : "text-cream/70 hover:text-cream"
                }`}
              >
                {t.pages[to]}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setReserveOpen(true)}
            className="fill-btn fill-btn--solid hidden !px-4 !py-2 !text-[0.65rem] sm:inline-flex"
          >
            <span className="fill-btn__bg" aria-hidden />
            <span className="relative z-10">{t.nav.reserve}</span>
          </button>
          <button
            ref={menuBtn}
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="hidden h-9 items-center gap-2 rounded-full px-3 text-[0.65rem] font-semibold uppercase tracking-widest md:flex"
            data-cursor={t.cursor.open}
          >
            <span className="flex w-4 flex-col gap-[3px]" aria-hidden>
              <span className="h-px w-full bg-cream" />
              <span className="h-px w-2/3 bg-cream" />
            </span>
            {t.nav.menu}
          </button>
        </div>
      </header>

      <TabBar menuOpen={open} onMenu={() => setOpen(true)} />

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        inert={!open}
        className={`fixed inset-0 z-[70] bg-ink transition-[clip-path] duration-[900ms] ease-[cubic-bezier(.7,0,.2,1)] ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 pb-5 pt-[calc(1.25rem+env(safe-area-inset-top))] md:px-10 md:pt-5">
            <Logo size="sm" />
            <div className="flex items-center gap-2">
              <LangSwitch />
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-cream hover:text-ink"
              >
                {t.nav.close}
              </button>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 px-5 md:grid-cols-[1.3fr_1fr] md:px-10">
            <nav
              aria-label={t.nav.menu}
              className="flex min-h-0 flex-col justify-center overflow-y-auto"
            >
              {t.nav.links.map(([id, label], i) => (
                <button
                  key={id}
                  ref={i === 0 ? firstLink : undefined}
                  onClick={() => navigate(id)}
                  onPointerEnter={() => setHover(id)}
                  onFocus={() => setHover(id)}
                  aria-current={id === path ? "page" : undefined}
                  className={`menu-link group flex items-baseline gap-4 py-1.5 text-start md:py-2 ${open ? "menu-link--in" : ""}`}
                  style={{ transitionDelay: open ? `${200 + i * 45}ms` : "0ms" }}
                  data-cursor={t.cursor.go}
                >
                  <span className="w-7 shrink-0 text-xs tabular-nums text-amber">
                    {digits(String(i + 1).padStart(2, "0"), lang)}
                  </span>
                  <span
                    className={`menu-link__text display text-4xl sm:text-5xl md:text-6xl xl:text-7xl ${id === path ? "text-amber" : ""}`}
                  >
                    {label}
                  </span>
                  {isPage(id) && (
                    <span
                      className="self-center rounded-full border border-amber/50 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-widest text-amber"
                      aria-hidden
                    >
                      {t.nav.page}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="relative hidden items-center md:flex" aria-hidden>
              <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-full">
                {(Object.entries(PREVIEW) as [NavTarget, ImageKey][]).map(([id, key]) => (
                  <Photo
                    key={id}
                    img={images[key]}
                    alt=""
                    sizes="30vw"
                    className={`absolute inset-0 h-full w-full object-cover transition-[clip-path,transform] duration-700 ease-[cubic-bezier(.7,0,.2,1)] ${
                      hover === id
                        ? "scale-100 [clip-path:inset(0_0_0_0)]"
                        : "scale-110 [clip-path:inset(100%_0_0_0)]"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-10">
            <span>{cafe.address[lang]}</span>
            <span className="flex flex-wrap items-center gap-3">
              {open && <OpenStatus />}
              {cafe.hours[lang]}
            </span>
            <div className="flex items-center gap-4">
              <a
                href={cafe.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-cream"
              >
                Instagram
              </a>
              <button
                onClick={() => {
                  setOpen(false);
                  setReserveOpen(true);
                }}
                className="link-underline text-amber sm:hidden"
              >
                {t.nav.reserve}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
