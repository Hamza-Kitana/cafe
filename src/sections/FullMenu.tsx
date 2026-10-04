import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { Link } from "@tanstack/react-router";
import { gsap, ScrollTrigger } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { menu } from "@/data/menu";
import { digits } from "@/data/cafe";
import { images } from "@/data/images";
import { Photo } from "@/components/Photo";
import { MenuList } from "@/components/MenuList";
import { Chapter } from "@/components/Chapter";

/* Editorial, magazine-style menu. Not pinned: the page breathes again. */
export function FullMenu() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [idx, setIdx] = useState(0);
  const busy = useRef(false);
  const seen = useRef(false);
  const cat = menu[idx]!;

  const animateIn = useCallback(() => {
    const q = gsap.utils.selector(root);
    gsap.fromTo(
      q(".mn-row"),
      { clipPath: "inset(0 0 100% 0)", y: 28, opacity: 1 },
      {
        clipPath: "inset(0 0 0% 0)",
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.07,
        ease: "power3.out",
      },
    );
    gsap.fromTo(
      q(".mn-title"),
      { yPercent: 105, opacity: 1 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: "power4.out" },
    );
    gsap.fromTo(
      q(".mn-img"),
      { clipPath: "inset(100% 0 0 0)", scale: 1.25, opacity: 1 },
      { clipPath: "inset(0% 0 0 0)", scale: 1, opacity: 1, duration: 1.1, ease: "power3.inOut" },
    );
    gsap.fromTo(
      q(".mn-tag"),
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.6, delay: 0.3 },
    );
  }, []);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top 70%",
      once: true,
      onEnter: () => {
        seen.current = true;
        animateIn();
      },
    });
    return () => st.kill();
  }, [animateIn]);

  useEffect(() => {
    if (seen.current) animateIn();
  }, [idx, lang, animateIn]);

  const switchTo = (i: number) => {
    if (i === idx || busy.current) return;
    busy.current = true;
    const q = gsap.utils.selector(root);
    gsap.to(q(".mn-row, .mn-title, .mn-img, .mn-tag"), {
      opacity: 0,
      y: -14,
      duration: 0.25,
      stagger: 0.01,
      onComplete: () => {
        busy.current = false;
        setIdx(i);
      },
    });
  };

  const onKey = (e: KeyboardEvent) => {
    const next = {
      ArrowDown: 1,
      ArrowRight: lang === "ar" ? -1 : 1,
      ArrowUp: -1,
      ArrowLeft: lang === "ar" ? 1 : -1,
    }[e.key];
    if (!next) return;
    e.preventDefault();
    const i = (idx + next + menu.length) % menu.length;
    tabs.current[i]?.focus();
    switchTo(i);
  };

  return (
    <section
      ref={root}
      id="menu"
      aria-label={t.menu.title}
      className="relative min-h-screen overflow-hidden py-24 transition-[background-color] duration-700 md:py-32"
      style={
        { backgroundColor: cat.background, ["--accent" as string]: cat.accent } as CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {menu.map((c, i) => (
          <Photo
            key={c.id}
            img={images[c.image]}
            alt=""
            sizes="60vw"
            className={`absolute inset-0 h-full w-full object-cover blur-2xl transition-opacity duration-1000 ${i === idx ? "opacity-[0.14]" : "opacity-0"}`}
            style={{ objectPosition: c.imagePosition }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
      </div>
      <div
        className="outline-text pointer-events-none absolute -bottom-[0.18em] end-[-0.04em] select-none font-latin text-[38vw] font-semibold leading-none md:text-[26vw]"
        aria-hidden
      >
        {String(idx + 1).padStart(2, "0")}
      </div>

      <div className="relative mx-auto max-w-[90rem] px-6 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Chapter id="menu" label={t.menu.kicker} accent={cat.accent} />
            <div className="overflow-hidden pb-2">
              <h2 className={`mn-title display mt-3 text-6xl md:text-[9rem] type-${cat.type}`}>
                {cat.title[lang]}
              </h2>
            </div>
          </div>
          <p className="mn-tag max-w-xs text-sm text-cream/70">{cat.tagline[lang]}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-[13rem_minmax(0,1fr)_minmax(0,22rem)] md:gap-14">
          <div
            role="tablist"
            aria-label={t.menu.title}
            aria-orientation="vertical"
            onKeyDown={onKey}
            className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:flex-col md:gap-1 md:overflow-visible md:px-0"
          >
            {menu.map((c, i) => (
              <button
                key={c.id}
                ref={(el) => void (tabs.current[i] = el)}
                role="tab"
                id={`menu-tab-${c.id}`}
                aria-selected={i === idx}
                aria-controls="menu-panel"
                tabIndex={i === idx ? 0 : -1}
                onClick={() => switchTo(i)}
                className={`menu-tab group flex shrink-0 items-baseline gap-3 whitespace-nowrap rounded-full border px-4 py-2 text-start transition-colors md:rounded-none md:border-0 md:px-0 md:py-2.5 ${
                  i === idx
                    ? "border-[var(--accent)] text-cream"
                    : "border-border text-cream/45 hover:text-cream"
                }`}
              >
                <span
                  className="hidden text-[0.65rem] tabular-nums md:inline"
                  style={{ color: i === idx ? cat.accent : undefined }}
                >
                  {digits(String(i + 1).padStart(2, "0"), lang)}
                </span>
                <span className="relative text-sm font-semibold uppercase tracking-[0.18em] md:text-base">
                  {c.title[lang]}
                  <span
                    className={`absolute -bottom-1 start-0 hidden h-px bg-[var(--accent)] transition-[width] duration-500 md:block ${i === idx ? "w-full" : "w-0 group-hover:w-1/2"}`}
                  />
                </span>
              </button>
            ))}
          </div>

          <div id="menu-panel" role="tabpanel" aria-labelledby={`menu-tab-${cat.id}`}>
            <MenuList key={`${cat.id}-${lang}`} items={cat.items} rowClass="mn-row" />
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-cream/45">{t.menu.note}</p>
              <Link
                to="/menu"
                data-cursor={t.cursor.open}
                className="fill-btn fill-btn--solid"
                style={{ background: cat.accent, borderColor: cat.accent }}
              >
                <span className="fill-btn__bg" aria-hidden />
                <span className="relative z-10">{t.menu.cta} →</span>
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="sticky top-28">
              <div className="mn-img relative aspect-[3/4] overflow-hidden rounded-t-full">
                <Photo
                  key={cat.id}
                  img={images[cat.image]}
                  alt=""
                  sizes="22rem"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: cat.imagePosition }}
                />
                <div
                  className="absolute inset-0 mix-blend-color"
                  style={{ backgroundColor: cat.accent, opacity: 0.12 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
