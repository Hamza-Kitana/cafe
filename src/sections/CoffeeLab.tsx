import { useRef, useState, type CSSProperties } from "react";
import { gsap, useScene, cue } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { featured, menuItem } from "@/data/menu";
import { digits, fmtPrice } from "@/data/cafe";
import { Bean, Cup } from "@/components/art/Cup";
import { SmokeCanvas, type SmokeState } from "@/components/SmokeCanvas";
import { Chapter } from "@/components/Chapter";

/** Surface of each featured drink, as the CSS variables the cup reads. */
const DRINK = [
  { "--liquid": "#2a170d", "--crema": 1, "--art": 0, "--foam": 0, "--ice": 0 },
  { "--liquid": "#b48a64", "--crema": 0.15, "--art": 1, "--foam": 0, "--ice": 0 },
  { "--liquid": "#a8723c", "--crema": 0.3, "--art": 0.9, "--foam": 0, "--ice": 0 },
  { "--liquid": "#7a4f30", "--crema": 0, "--art": 0.3, "--foam": 1, "--ice": 0 },
  { "--liquid": "#3a2416", "--crema": 0, "--art": 0, "--foam": 0, "--ice": 1 },
];
const ICED = 4;
/** Which ingredients (by index) go into each featured drink. */
const RECIPES = [[0], [0, 1], [0, 1, 2], [0, 1, 3], [0, 1, 2, 4]];
const FLOOD = "#2f7d4c";

/* The cup is the interface. SLOW. Ends by flooding the screen into the drinks. */
export function CoffeeLab() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  const drinks = featured.coffeeLab.map(menuItem);
  const rim = useRef<HTMLDivElement>(null);
  const [steam] = useState<SmokeState>(() => ({ density: 0.6, cover: 0 }));

  useScene(root, () => {
    gsap.set(".c-ice", { y: -150 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "+=480%",
        scrub: 1,
        pin: true,
      },
    });
    tl.from(".c-cup", { y: 120, opacity: 0, scale: 0.92, duration: 0.5 });
    tl.from(".c-ing", { opacity: 0, scale: 0.4, stagger: 0.08, duration: 0.3 }, 0.2);
    const highlight = (i: number, at: string | number) =>
      t.coffee.ingredients.forEach((_, k) => {
        const on = RECIPES[i]!.includes(k);
        tl.to(
          `.c-ing${k}`,
          {
            opacity: on ? 1 : 0.25,
            scale: on ? 1.15 : 0.9,
            color: on ? "#f3d79a" : "#a08a70",
            duration: 0.3,
          },
          at,
        );
      });
    highlight(0, 0.5);
    drinks.forEach((_, i) => {
      if (i > 0) {
        tl.addLabel(`d${i}`);
        tl.to(`.c-d${i - 1}`, { opacity: 0, y: -40, duration: 0.3 }, `d${i}`)
          .fromTo(
            `.c-d${i}`,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.3 },
            `d${i}+=0.15`,
          )
          // A fresh pour: the stream falls until it meets the surface, the drink morphs and
          // sloshes, then the tail of the stream drops into the cup.
          .fromTo(
            ".c-pour",
            { yPercent: -100, opacity: 1 },
            { yPercent: 0, duration: 0.15, ease: "power1.in" },
            `d${i}`,
          )
          .to(".c-cup", { ...DRINK[i]!, duration: 0.45 }, `d${i}+=0.1`)
          .to(".c-pour", { yPercent: 100, duration: 0.15, ease: "power1.in" }, `d${i}+=0.4`)
          .set(".c-pour", { opacity: 0 }, `d${i}+=0.56`)
          .fromTo(
            ".c-ripple",
            { scale: 0.4, opacity: 0.9 },
            {
              scale: 4,
              opacity: 0,
              svgOrigin: "150 86",
              duration: 0.25,
              ease: "power1.out",
              stagger: { each: 0.12, repeat: 1 },
            },
            `d${i}+=0.14`,
          )
          .fromTo(
            ".c-surface",
            { rotate: i % 2 ? 5 : -5 },
            { rotate: 0, svgOrigin: "150 86", duration: 0.6, ease: "elastic.out(1, 0.3)" },
            `d${i}+=0.15`,
          )
          .to(
            ".c-cup",
            { keyframes: { rotate: [0, i % 2 ? -1.5 : 1.5, 0] }, duration: 0.5 },
            `d${i}+=0.1`,
          );
        highlight(i, `d${i}`);
        cue(tl, "pour", `d${i}`);
      }
      tl.to({}, { duration: 0.5 });
    });
    // Iced: cubes fall into the cup, splash, and the steam dies.
    tl.to(".c-ice", { y: 0, duration: 0.2, ease: "power2.in" }, `d${ICED}+=0.3`)
      .to(".c-ice", { y: -4, duration: 0.08, ease: "power1.out" }, ">")
      .to(".c-ice", { y: 0, duration: 0.1, ease: "power1.in" }, ">");
    gsap.utils.toArray<SVGCircleElement>(".c-drop").forEach((d, k) => {
      const dx = (k - 2) * 14;
      tl.to(
        d,
        {
          keyframes: { y: [0, -34 - (k % 2) * 16, 6], x: [0, dx * 0.6, dx], opacity: [1, 1, 0] },
          duration: 0.3,
          ease: "none",
        },
        `d${ICED}+=0.5`,
      );
    });
    tl.to(steam, { density: 0, duration: 0.3 }, `d${ICED}`);

    // Liquid transition into the Drinks Universe.
    tl.addLabel("flood", "+=0.1");
    tl.to(".c-flood", { yPercent: -100, duration: 1, ease: "power2.inOut" }, "flood");
    tl.to(".c-cup", { y: -120, opacity: 0, duration: 0.6 }, "flood");

    gsap.utils.toArray<HTMLElement>(".c-bean").forEach((b, i) => {
      gsap.fromTo(
        b,
        { y: `${-10 - ((i * 53) % 130)}vh`, rotate: i * 23, rotationX: 0 },
        {
          y: `${120 + ((i * 29) % 70)}vh`,
          rotate: 200 + i * 40,
          rotationX: (i % 2 ? 1 : -1) * (360 + (i % 3) * 180),
          transformPerspective: 400,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=480%",
            scrub: 0.5 + (i % 4) * 0.4,
          },
        },
      );
    });
  });

  const beans = Array.from({ length: 16 }, (_, i) => ({
    l: (i * 61) % 100,
    s: 0.5 + ((i * 37) % 10) / 6,
    front: i % 3 === 0,
  }));

  return (
    <section
      ref={root}
      id="coffee"
      aria-label={t.coffee.kicker}
      className="relative h-screen overflow-hidden bg-[radial-gradient(ellipse_at_50%_70%,var(--coffee),var(--ink)_70%)]"
      data-cursor={t.cursor.taste}
    >
      {beans.map((b, i) => (
        <div
          key={i}
          className={`c-bean absolute top-0 h-[1.4rem] w-4 ${b.front ? "z-20 blur-[2px]" : "z-0 opacity-70 blur-[0.5px]"} ${i % 2 ? "max-md:hidden" : ""}`}
          style={{ left: `${b.l}%`, scale: `${b.front ? b.s * 2.2 : b.s}` }}
          aria-hidden
        >
          <Bean className="h-full w-full drop-shadow-[0_6px_6px_rgba(0,0,0,0.5)]" />
        </div>
      ))}

      <SmokeCanvas
        state={steam}
        source={rim}
        spread={0.6}
        className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
      />

      <Chapter
        id="coffee"
        label={t.coffee.kicker}
        className="absolute start-6 top-24 z-10 md:start-12"
      />

      <div className="relative z-10 grid h-full grid-cols-1 grid-rows-[1fr_auto] items-center px-6 pb-[calc(2.5rem+var(--tab))] md:grid-cols-[1.2fr_1fr] md:grid-rows-1 md:px-16 md:pb-0">
        <div
          className="relative flex h-[52vh] items-center justify-center [perspective:1000px] md:h-[60vh]"
          aria-hidden
        >
          {t.coffee.ingredients.map((ing, i) => {
            const a = ((i + 0.5) / t.coffee.ingredients.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <span
                key={i}
                className={`c-ing c-ing${i} absolute text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold md:text-[0.72rem]`}
                style={{
                  transform: `translate(calc(${Math.cos(a).toFixed(3)} * min(200px, 36vw)), calc(${Math.sin(a).toFixed(3)} * min(180px, 19vh)))`,
                }}
              >
                · {ing}
              </span>
            );
          })}
          <div
            className="c-cup relative w-[17rem] md:w-[26rem]"
            style={DRINK[0] as unknown as CSSProperties}
          >
            <div ref={rim} className="absolute left-[18%] top-[24%] h-px w-[56%]" />
            <Cup className="relative block w-full overflow-visible" />
            {/* Above the cup so the stream passes in front of the back rim; it ends at the surface, behind the front lip. */}
            <div className="pointer-events-none absolute inset-x-0 -top-[40vh] bottom-[71%] flex justify-center overflow-hidden [direction:ltr]">
              <div
                className="c-pour h-full w-[0.45rem] rounded-full opacity-0 md:w-[0.6rem]"
                style={{
                  marginInlineEnd: "6.25%",
                  background:
                    "linear-gradient(90deg, color-mix(in oklab, var(--liquid) 70%, black), var(--liquid) 40%, color-mix(in oklab, var(--liquid) 70%, white) 55%, var(--liquid) 70%)",
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative h-48 md:h-72" aria-live="polite">
          {drinks.map((d, i) => (
            <div key={i} className={`c-d${i} absolute inset-0 ${i === 0 ? "" : "opacity-0"}`}>
              <div className="text-xs tabular-nums text-amber">
                {digits(`0${i + 1} / 0${drinks.length}`, lang)}
              </div>
              <h3 className="display mt-3 text-5xl md:text-8xl">{d.name[lang]}</h3>
              <p className="mt-3 max-w-sm text-muted-foreground md:mt-4">{d.desc[lang]}</p>
              <div className="mt-4 inline-block border-b border-amber pb-1 text-lg text-gold md:mt-5">
                {fmtPrice(d.price, lang)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="c-flood world-bg pointer-events-none absolute inset-x-0 top-[calc(100%+60px)] z-30 h-[calc(115%+60px)]"
        style={{ ["--world" as string]: FLOOD } as CSSProperties}
        aria-hidden
      >
        <svg
          className="absolute -top-[59px] left-0 h-[60px] w-[200%] animate-[wave_6s_linear_infinite]"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30 Q 75 0 150 30 T 300 30 T 450 30 T 600 30 T 750 30 T 900 30 T 1050 30 T 1200 30 V60 H0Z"
            style={{ fill: `color-mix(in oklab, ${FLOOD} 72%, black)` }}
          />
        </svg>
        {[12, 30, 55, 72, 88].map((l, i) => (
          <span
            key={l}
            className="bubble absolute bottom-10 h-3 w-3 rounded-full bg-cream/50"
            style={{ left: `${l}%`, animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>
    </section>
  );
}
