import { useRef, useState, type CSSProperties } from "react";
import { gsap, useScene } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { useIsTouch } from "@/hooks/use-media";
import { category } from "@/data/menu";
import { fmtPrice } from "@/data/cafe";
import { Hookah } from "@/components/art/Hookah";
import { SmokeCanvas, type SmokeState } from "@/components/SmokeCanvas";
import { Chapter } from "@/components/Chapter";

/** Where each flavour floats, as % of the scene. Kept clear of the hookah in the middle. */
const SPOTS: [number, number][] = [
  [14, 27],
  [84, 25],
  [8, 49],
  [92, 46],
  [16, 71],
  [26, 89],
  [50, 20],
];

/* Smoke is the protagonist. ATMOSPHERIC. Ends with the room disappearing into smoke. */
export function ShishaLounge() {
  const { t, lang } = useI18n();
  const touch = useIsTouch();
  const root = useRef<HTMLElement>(null);
  const bowl = useRef<HTMLDivElement>(null);
  const smoke = useRef<SmokeState>({ density: 0.6, cover: 0 }).current;
  const flavors = category("shisha").items;
  const [active, setActive] = useState<number | null>(null);
  const current = active === null ? null : flavors[active]!;

  useScene(root, () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "+=420%",
        scrub: 1.2,
        pin: true,
      },
      defaults: { ease: "none" },
    });
    tl.from(".s-hookah", { yPercent: 18, opacity: 0, duration: 1, ease: "power2.out" }, 0)
      .to(smoke, { density: 1.4, duration: 1 }, 0)
      .fromTo(
        ".s-relax",
        { "--m": "0%", filter: "blur(24px)", opacity: 0 },
        { "--m": "120%", filter: "blur(0px)", opacity: 1, duration: 1.4 },
        0.6,
      )
      .to(".s-relax", { filter: "blur(30px)", opacity: 0, scale: 1.15, duration: 1 }, 2.6)
      .fromTo(
        ".s-flavor",
        { "--m": "0%", filter: "blur(18px)", opacity: 0 },
        { "--m": "120%", filter: "blur(0px)", opacity: 1, duration: 1.2 },
        3.2,
      )
      .to(".s-flavor", { opacity: 0.07, scale: 1.25, filter: "blur(2px)", duration: 0.8 }, 4.6)
      .fromTo(
        ".s-item",
        { opacity: 0, filter: "blur(16px)", scale: 0.8 },
        { opacity: 1, filter: "blur(0px)", scale: 1, stagger: 0.15, duration: 0.8 },
        4.6,
      )
      .fromTo(".s-hint", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 5.6)
      .to({}, { duration: 2.4 })
      // The room fills with smoke…
      .to(smoke, { cover: 1, density: 2.4, duration: 1.6 }, 8.2)
      .to(".s-item, .s-hint, .s-info", { opacity: 0, filter: "blur(10px)", duration: 0.8 }, 8.4)
      .to(".s-fog", { opacity: 1, duration: 1.4, ease: "power1.in" }, 8.6);
  });

  return (
    <section
      ref={root}
      id="shisha"
      aria-label={t.shisha.kicker}
      className="shisha relative h-screen overflow-hidden bg-[#0d0a09]"
      style={{ ["--amb" as string]: current?.color ?? "#e0a35a" } as CSSProperties}
    >
      <div
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#3a1f10] to-transparent opacity-60"
        aria-hidden
      />
      <div className="amb-glow pointer-events-none absolute inset-0" aria-hidden />
      <Chapter
        id="shisha"
        label={t.shisha.kicker}
        className="absolute start-6 top-24 z-30 md:start-12"
      />

      <div className="s-hookah absolute bottom-0 left-1/2 z-[5] h-[60vh] -translate-x-1/2 md:h-[66vh]">
        <div ref={bowl} className="absolute left-1/2 top-[3%] h-1 w-6 -translate-x-1/2" />
        <Hookah className="h-full w-auto drop-shadow-[0_0_60px_color-mix(in_oklab,var(--amb)_40%,transparent)]" />
      </div>

      <SmokeCanvas
        state={smoke}
        source={bowl}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      />

      <h2 className="s-relax smoke-mask display pointer-events-none absolute inset-x-0 top-[22%] z-20 -mt-[0.3em] py-[0.3em] text-center text-[24vw] leading-none opacity-0 md:top-[16%] md:text-[18vw]">
        {t.shisha.relax}
      </h2>
      <h2 className="s-flavor smoke-mask display pointer-events-none absolute inset-x-6 top-[30%] z-20 -mt-[0.25em] py-[0.25em] text-center text-6xl opacity-0 md:inset-x-auto md:start-12 md:top-[38%] md:max-w-[40vw] md:text-start md:text-8xl">
        {t.shisha.flavor}
      </h2>

      <ul
        className="absolute inset-x-0 bottom-[var(--tab)] top-0 z-20"
        aria-label={t.shisha.flavor}
      >
        {flavors.map((f, i) => {
          const [x, y] = SPOTS[i]!;
          return (
            <li
              key={f.id}
              className="s-item absolute opacity-0"
              style={{ left: `${x}%`, top: `${y}%`, translate: `-${x}% -50%` }}
            >
              <button
                className={`flavor-float display whitespace-nowrap text-2xl transition-[color,text-shadow,transform] duration-500 md:text-4xl ${active === i ? "scale-110 text-cream [text-shadow:0_0_24px_var(--amb)]" : "text-cream/55 hover:text-cream"}`}
                style={{ animationDelay: `${i * -1.3}s` }}
                onPointerEnter={() => !touch && setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                data-cursor={t.cursor.taste}
              >
                {f.name[lang]}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="s-hint absolute inset-x-0 bottom-[calc(1.5rem+var(--tab))] z-20 text-center text-[0.7rem] tracking-[0.25em] text-cream/50 opacity-0">
        {touch ? t.shisha.hintTouch : t.shisha.hint}
      </p>

      <div
        className="s-info absolute bottom-[calc(4rem+var(--tab))] end-6 z-20 w-60 text-end md:bottom-20 md:end-12 md:w-72"
        aria-live="polite"
      >
        {current && (
          <div key={current.id} className="animate-[rise_.6s_cubic-bezier(.2,.7,.2,1)]">
            <div className="h-px w-full bg-gradient-to-l from-[var(--amb)] to-transparent rtl:bg-gradient-to-r" />
            <div className="display mt-3 text-3xl">{current.name[lang]}</div>
            <p className="mt-2 text-sm text-cream/70">{current.desc[lang]}</p>
            <div className="mt-2 text-sm text-gold">
              {t.shisha.from} {fmtPrice(current.price, lang)}
            </div>
          </div>
        )}
      </div>

      <div
        className="s-fog pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(ellipse_at_50%_60%,#b9b0a4,#6d6760_60%,#3b3733)] opacity-0"
        aria-hidden
      />
    </section>
  );
}
