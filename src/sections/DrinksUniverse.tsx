import { useRef, type CSSProperties } from "react";
import { gsap, useScene } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { useIsMobile } from "@/hooks/use-media";
import { featured, menuItem } from "@/data/menu";
import { digits, fmtPrice } from "@/data/cafe";
import { DecoShape, DrinkDefs, Glass, type CitrusKind, type Deco } from "@/components/art/Drinks";
import { Chapter } from "@/components/Chapter";

const WORLDS: Record<
  string,
  { color: string; decos: Deco[]; cream?: boolean; garnish?: CitrusKind }
> = {
  mojito: { color: "#2f7d4c", decos: ["lime", "mint", "ice"], garnish: "lime" },
  "lemon-mint": { color: "#8f9a26", decos: ["lemon", "mint", "ice"], garnish: "lemon" },
  "blue-lagoon": { color: "#23649e", decos: ["ice", "orange", "bubble"], garnish: "orange" },
  milkshake: { color: "#a36f5e", decos: ["cookie", "cream", "berry"], cream: true },
  "fresh-juice": { color: "#c96f1c", decos: ["orange", "berry", "ice"], garnish: "orange" },
  "iced-tea": { color: "#94502a", decos: ["peach", "lemon", "ice"], garnish: "lemon" },
};

/* Vertical scroll turns sideways. FAST. Each drink is its own world. */
export function DrinksUniverse() {
  const { t, dir, lang } = useI18n();
  const mobile = useIsMobile();
  const root = useRef<HTMLElement>(null);
  const drinks = featured.drinks.map(menuItem);
  const colors = featured.drinks.map((id) => WORLDS[id]!.color);

  useScene(root, () => {
    const section = root.current!;
    const paint = gsap.utils.interpolate(colors);
    const setWorld = (p: number) => section.style.setProperty("--world", paint(p));
    if (mobile) {
      const strip = section.querySelector<HTMLElement>(".h-track")!;
      const onScroll = () =>
        setWorld(Math.abs(strip.scrollLeft) / Math.max(1, strip.scrollWidth - strip.clientWidth));
      strip.addEventListener("scroll", onScroll, { passive: true });
      return () => strip.removeEventListener("scroll", onScroll);
    }
    const track = section.querySelector<HTMLElement>(".h-track")!;
    const dist = () => track.scrollWidth - window.innerWidth;
    const sign = dir === "rtl" ? 1 : -1;
    const tween = gsap.to(track, {
      x: () => sign * dist(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${dist()}`,
        scrub: 0.6,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (s) => setWorld(s.progress),
      },
    });
    gsap.utils.toArray<HTMLElement>(".h-glass").forEach((g) => {
      const along = {
        trigger: g,
        containerAnimation: tween,
        start: "left right",
        end: "right left",
        scrub: true,
        horizontal: true,
      };
      gsap.fromTo(
        g,
        { rotate: -8 * sign, y: 70 },
        { rotate: 6 * sign, y: -30, ease: "none", scrollTrigger: along },
      );
      // Gravity: the liquid stays level while the glass tilts (with a little lag, like a real slosh).
      gsap.fromTo(
        g.querySelector(".gl-level"),
        { rotate: 8 * sign, svgOrigin: "100 92" },
        { rotate: -6 * sign, ease: "none", scrollTrigger: { ...along, scrub: 1.4 } },
      );
    });
    gsap.utils.toArray<HTMLElement>(".h-name").forEach((n) => {
      gsap.fromTo(
        n,
        { xPercent: 30 * -sign },
        {
          xPercent: -30 * -sign,
          ease: "none",
          scrollTrigger: {
            trigger: n,
            containerAnimation: tween,
            start: "left right",
            end: "right left",
            scrub: true,
            horizontal: true,
          },
        },
      );
    });
    gsap.utils.toArray<HTMLElement>(".h-front").forEach((d, i) => {
      gsap.fromTo(
        d,
        { x: 200 * -sign },
        {
          x: -260 * -sign,
          rotate: 90 * (i % 2 ? 1 : -1),
          ease: "none",
          scrollTrigger: {
            trigger: d,
            containerAnimation: tween,
            start: "left right",
            end: "right left",
            scrub: true,
            horizontal: true,
          },
        },
      );
    });
    return undefined;
  }, [dir, mobile]);

  return (
    <section
      ref={root}
      id="drinks"
      aria-label={t.drinks.kicker}
      className="world-bg relative h-screen overflow-hidden"
      style={{ ["--world" as string]: colors[0] } as CSSProperties}
      data-cursor={mobile ? undefined : t.cursor.drag}
    >
      <DrinkDefs />
      <Chapter
        id="drinks"
        label={t.drinks.kicker}
        className="absolute start-6 top-24 z-20 md:start-12"
      />
      <div className="absolute bottom-[calc(2rem+var(--tab))] start-6 z-20 text-[0.7rem] tracking-[0.25em] text-cream/60 md:start-12">
        {mobile ? t.drinks.swipe : t.drinks.hint}
      </div>

      <div
        className={`h-track flex h-full ${mobile ? "snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none]" : "w-max"}`}
      >
        {drinks.map((d, i) => {
          const world = WORLDS[d.id]!;
          return (
            <article
              key={d.id}
              className="h-world relative flex h-full w-screen shrink-0 snap-center items-center justify-center overflow-hidden"
              aria-label={d.name[lang]}
            >
              <div
                className="h-name display pointer-events-none absolute whitespace-nowrap text-[30vw] text-cream/[0.08] md:text-[26vw]"
                aria-hidden
              >
                {d.name[lang]}
              </div>
              {Array.from({ length: 9 }).map((_, k) => {
                const type = world.decos[k % world.decos.length]!;
                const front = k % 4 === 0;
                const size = front ? 120 + (k % 3) * 30 : 34 + ((k * 13) % 40);
                const style = {
                  ["--r" as string]: `${k * 31}deg`,
                  width: size,
                  height: type === "mint" ? size * 1.2 : size,
                  left: `${(k * 37 + i * 11) % 88}%`,
                  top: `${((k * 29 + 13) % 78) + 6}%`,
                  animationDelay: `${k * 0.4}s`,
                  filter: front
                    ? "blur(5px)"
                    : k % 3 === 0
                      ? "blur(2px) drop-shadow(0 10px 12px rgba(0,0,0,.35))"
                      : "drop-shadow(0 10px 12px rgba(0,0,0,.35))",
                } as CSSProperties;
                return (
                  <div
                    key={k}
                    className={`${front ? "h-front z-20" : "floaty z-0 opacity-90"} pointer-events-none absolute will-change-transform ${front && k > 4 ? "max-md:hidden" : ""}`}
                    style={style}
                    aria-hidden
                  >
                    <DecoShape type={type} />
                  </div>
                );
              })}
              <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-6 px-8 md:grid-cols-2 md:gap-8">
                <div
                  className="h-glass relative mx-auto aspect-[200/430] h-[44vh] md:h-[58vh]"
                  aria-hidden
                >
                  <Glass
                    color={world.color}
                    cream={world.cream}
                    ice={!world.cream}
                    garnish={world.garnish}
                    className="h-full w-auto"
                  />
                </div>
                <div className="text-center md:text-start">
                  <div className="text-xs tabular-nums text-cream/70">
                    {digits(`0${i + 1}`, lang)}
                  </div>
                  <h3 className="display mt-2 text-6xl md:text-8xl">{d.name[lang]}</h3>
                  <p className="mx-auto mt-4 max-w-sm text-cream/85 md:mx-0">{d.desc[lang]}</p>
                  <div className="mt-4 text-lg text-gold">{fmtPrice(d.price, lang)}</div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
