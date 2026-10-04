import { useRef } from "react";
import { gsap, useScene } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { digits } from "@/data/cafe";
import { images, type ImageKey } from "@/data/images";
import { Photo } from "@/components/Photo";
import { Dust } from "@/components/Dust";
import { Bean } from "@/components/art/Cup";
import { Ball } from "@/components/art/Billiards";
import { PlayingCard, type Suit } from "@/components/art/PlayingCard";

const MOODS: ImageKey[] = ["coffee", "friends", "billiards", "facade"];

/* [x vw, y vh, size vmin, spin deg, depth] — depth 0 is blurred background, 2 is a close foreground bean. */
const BEANS: [number, number, number, number, number][] = [
  [-34, -26, 7, 220, 1],
  [30, -30, 5, -160, 0],
  [-40, 12, 9, 300, 2],
  [38, 18, 8, -260, 2],
  [-18, -38, 4, 140, 0],
  [16, -40, 5, -200, 1],
  [-26, 34, 6, 180, 1],
  [24, 36, 5, -120, 0],
  [-44, -6, 4, 90, 0],
  [44, -10, 5, -90, 1],
  [-8, 42, 4, 240, 0],
  [8, -46, 6, -300, 2],
];

/* Chat bubbles around the word: [inset %, top %, anchored to the end side?]. */
const BUBBLES: [number, number, boolean][] = [
  [6, 18, false],
  [6, 26, true],
  [4, 62, false],
  [5, 66, true],
  [30, 76, false],
];
const AVATAR = [
  "from-amber to-[#b4572a]",
  "from-mint to-lagoon",
  "from-[#e38aa8] to-burgundy",
  "from-gold to-coffee",
  "from-lagoon to-[#5b2a86]",
];

/* Billiard balls rolling in from the sides: [n, from-left?, final x vw, y vh, size vmin]. */
const BALLS: [number, boolean, number, number, number][] = [
  [8, true, -32, 26, 15],
  [3, false, 34, 22, 12],
  [11, true, -38, -24, 9],
  [6, false, 38, -28, 10],
];
const CARDS: { rank: string; suit: Suit; x: number; y: number; r: number }[] = [
  { rank: "A", suit: "♠", x: -24, y: -30, r: -14 },
  { rank: "K", suit: "♥", x: 22, y: -34, r: 12 },
  { rank: "Q", suit: "♦", x: -14, y: 27, r: 8 },
  { rank: "J", suit: "♣", x: 18, y: 29, r: -10 },
];

/* Deterministic star field so server and client markup match. */
const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: (i * 37.7) % 100,
  y: (i * 23.3) % 58,
  s: 1 + ((i * 7) % 3),
  d: ((i * 0.53) % 4).toFixed(2),
}));

function CoffeeFx() {
  return (
    <>
      <div className="absolute inset-x-0 bottom-[8%] flex justify-center gap-[3vmin]">
        {[0, 1, 2].map((k) => (
          <svg
            key={k}
            viewBox="0 0 60 220"
            className="i-steam h-[42vmin] w-[10vmin] text-cream/40 blur-[3px]"
            style={{ animationDelay: `${k * 1.1}s` }}
          >
            <path
              d="M30 220 C 6 180, 54 150, 30 110 S 8 40, 30 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
        ))}
      </div>
      {BEANS.map(([, , size, , depth], k) => (
        <div
          key={k}
          className={`i-bean absolute left-1/2 top-1/2 ${depth === 0 ? "opacity-60 blur-[2px]" : depth === 2 ? "drop-shadow-[0_10px_18px_rgb(0_0_0/0.6)]" : ""}`}
          style={{
            width: `${size}vmin`,
            marginLeft: `-${size / 2}vmin`,
            marginTop: `-${size * 0.7}vmin`,
          }}
        >
          <Bean className="h-auto w-full" />
        </div>
      ))}
    </>
  );
}

function FriendsFx({ chatter }: { chatter: { who: string; say: string }[] }) {
  return (
    <>
      {Array.from({ length: 9 }, (_, k) => (
        <span
          key={k}
          className="i-bokeh absolute rounded-full bg-amber/30 blur-xl"
          style={{
            width: `${10 + ((k * 7) % 12)}vmin`,
            height: `${10 + ((k * 7) % 12)}vmin`,
            left: `${(k * 41) % 92}%`,
            top: `${(k * 29) % 85}%`,
            animationDelay: `${k * 0.7}s`,
          }}
        />
      ))}
      {chatter.map((c, k) => {
        const [x, y, end] = BUBBLES[k]!;
        return (
          <div
            key={k}
            className={`i-bubble absolute max-w-[46vw] items-end gap-2 md:max-w-xs ${k === BUBBLES.length - 1 ? "hidden md:flex" : "flex"}`}
            style={{ [end ? "insetInlineEnd" : "insetInlineStart"]: `${x}%`, top: `${y}%` }}
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-bold text-ink shadow-lg ring-2 ring-cream/70 md:h-10 md:w-10 md:text-sm ${AVATAR[k]}`}
            >
              {c.who}
            </span>
            <span className="rounded-2xl rounded-es-sm bg-cream/95 px-3 py-2 text-xs font-medium text-ink shadow-[0_10px_30px_-8px_rgb(0_0_0/0.7)] md:px-4 md:text-sm">
              {c.say}
            </span>
          </div>
        );
      })}
    </>
  );
}

function GamesFx() {
  return (
    <div className="absolute inset-0 [perspective:900px]">
      {CARDS.map((c, k) => (
        <div
          key={k}
          className="i-card absolute left-1/2 top-1/2 -ml-[6vmin] -mt-[8.4vmin] w-[12vmin]"
        >
          <PlayingCard rank={c.rank} suit={c.suit} />
        </div>
      ))}
      {BALLS.map(([n, , , , size], k) => (
        <div
          key={k}
          className="i-ball absolute left-1/2 top-1/2 drop-shadow-[0_14px_16px_rgb(0_0_0/0.65)]"
          style={{
            width: `${size}vmin`,
            marginLeft: `-${size / 2}vmin`,
            marginTop: `-${size / 2}vmin`,
          }}
        >
          <Ball n={n} className="h-auto w-full" />
        </div>
      ))}
    </div>
  );
}

function NightsFx() {
  return (
    <>
      {STARS.map((s, k) => (
        <span
          key={k}
          className="i-star absolute rounded-full bg-cream"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            animationDelay: `${s.d}s`,
          }}
        />
      ))}
      <div className="i-moon absolute start-[10%] top-[14%] h-[16vmin] w-[16vmin] rounded-full shadow-[inset_-3.2vmin_1.4vmin_0_0_#f6e4b8] drop-shadow-[0_0_28px_rgb(246_228_184/0.55)] rotate-[-20deg]" />
      <span className="i-shoot absolute start-[8%] top-[18%] h-px w-[22vw] origin-left bg-gradient-to-r from-transparent via-cream to-cream/0 opacity-0 rtl:origin-right rtl:bg-gradient-to-l" />
    </>
  );
}

/* Four words, four moods — each one a room you can almost smell. */
export function Inside() {
  const { t, lang, dir } = useI18n();
  const root = useRef<HTMLElement>(null);

  useScene(root, () => {
    const side = dir === "rtl" ? -1 : 1;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "+=320%",
        scrub: 0.8,
        pin: true,
      },
    });
    tl.from(".i-veil", { opacity: 1, duration: 0.3 });

    const fx: ((at: string) => void)[] = [
      (at) => {
        tl.fromTo(
          ".i-bean",
          { x: 0, y: 0, scale: 0.2, rotation: 0, opacity: 0 },
          {
            x: (k: number) => `${BEANS[k]![0] * side}vw`,
            y: (k: number) => `${BEANS[k]![1]}vh`,
            scale: 1,
            rotation: (k: number) => BEANS[k]![3],
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.015,
          },
          at,
        ).to(
          ".i-bean",
          {
            y: (k: number) => `${BEANS[k]![1] - 10 - BEANS[k]![4] * 6}vh`,
            duration: 1,
            ease: "none",
          },
          `${at}+=0.7`,
        );
      },
      (at) => {
        tl.fromTo(
          ".i-bubble",
          { opacity: 0, scale: 0.5, y: 24 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(2)", stagger: 0.16 },
          `${at}+=0.2`,
        );
      },
      (at) => {
        tl.fromTo(
          ".i-ball",
          {
            x: (k: number) => `${(BALLS[k]![1] ? -70 : 70) * side}vw`,
            y: (k: number) => `${BALLS[k]![3]}vh`,
            rotation: 0,
          },
          {
            x: (k: number) => `${BALLS[k]![2] * side}vw`,
            rotation: (k: number) => (BALLS[k]![1] ? 540 : -540) * side,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.08,
          },
          at,
        )
          .fromTo(
            ".i-card",
            { x: 0, y: "-80vh", rotation: 0, opacity: 0 },
            {
              x: (k: number) => `${CARDS[k]!.x * side}vw`,
              y: (k: number) => `${CARDS[k]!.y}vh`,
              rotation: (k: number) => CARDS[k]!.r * side,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.1,
            },
            `${at}+=0.15`,
          )
          .fromTo(
            ".i-card .playing-card",
            { rotationY: 0 },
            { rotationY: 180, duration: 0.6, ease: "power2.inOut", stagger: 0.1 },
            `${at}+=0.4`,
          );
      },
      (at) => {
        tl.fromTo(
          ".i-moon",
          { y: "30vh", opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power2.out" },
          at,
        )
          .fromTo(
            ".i-star",
            { opacity: 0 },
            { opacity: 1, duration: 0.5, stagger: { each: 0.01, from: "random" } },
            at,
          )
          .fromTo(
            ".i-shoot",
            { opacity: 0, scaleX: 0, x: 0, y: 0 },
            {
              opacity: 1,
              scaleX: 1,
              x: `${40 * side}vw`,
              y: "14vh",
              duration: 0.5,
              ease: "power1.in",
            },
            `${at}+=0.5`,
          )
          .to(".i-shoot", { opacity: 0, duration: 0.15 }, ">-0.1");
      },
    ];

    MOODS.forEach((_, i) => {
      const w = `.i-w${i}`;
      const mood = `.i-m${i}`;
      tl.addLabel(`m${i}`)
        .fromTo(
          mood,
          { opacity: 0, clipPath: "inset(18% 18% 18% 18% round 24px)" },
          { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.6 },
          `m${i}`,
        )
        .fromTo(
          `${mood} img`,
          { scale: 1.3 },
          { scale: 1.05, duration: 1.6, ease: "none" },
          `m${i}`,
        );
      fx[i]!(`m${i}`);
      tl.fromTo(
        `${w} .i-char`,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.45, stagger: 0.03, ease: "power3.out" },
        `m${i}+=0.15`,
      )
        .fromTo(
          `.i-l${i}`,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4 },
          `m${i}+=0.35`,
        )
        .to(`.i-bar${i}`, { scaleX: 1, duration: 0.5 }, `m${i}`)
        .fromTo(
          ".i-beat",
          { scaleY: 0.2 },
          { scaleY: 1, duration: 0.25, stagger: { each: 0.01, from: "center" } },
          `m${i}+=0.2`,
        )
        .to(".i-beat", { scaleY: 0.2, duration: 0.3, stagger: { each: 0.01, from: "edges" } }, ">")
        .to(`${w}, .i-l${i}`, { opacity: 0, y: -30, filter: "blur(8px)", duration: 0.4 }, "+=0.35");
      if (i < MOODS.length - 1) tl.to(mood, { opacity: 0, duration: 0.4 }, "<0.2");
      else tl.to(mood, { opacity: 0.35, filter: "blur(6px)", duration: 0.4 }, "<0.2");
    });
    tl.fromTo(
      ".i-welcome",
      { opacity: 0, letterSpacing: "0.4em" },
      { opacity: 1, letterSpacing: "0em", duration: 0.6 },
    ).to({}, { duration: 0.4 });
  }, [lang]);

  const fx = [
    <CoffeeFx key="c" />,
    <FriendsFx key="f" chatter={t.inside.chatter} />,
    <GamesFx key="g" />,
    <NightsFx key="n" />,
  ];

  return (
    <section
      ref={root}
      id="inside"
      aria-label={t.inside.welcome}
      className="relative h-screen overflow-hidden bg-ink"
    >
      <div className="i-veil absolute inset-0 z-10 bg-amber opacity-0" />
      {MOODS.map((key, i) => (
        <div key={key} className={`i-m${i} absolute inset-0 overflow-hidden opacity-0`} aria-hidden>
          <Photo
            img={images[key]}
            alt=""
            sizes="100vw"
            loading="eager"
            className="h-full w-full object-cover brightness-[0.68] saturate-[1.05]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgb(10_7_5/0.55)_0%,transparent_45%,var(--ink)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />
          <div className="absolute inset-0">{fx[i]}</div>
        </div>
      ))}
      <Dust className="z-[4]" count={24} />

      <div className="relative z-[5] flex h-full items-center justify-center px-6 text-center">
        {t.inside.words.map((w, i) => (
          <div key={i} className="absolute inset-x-0 flex flex-col items-center">
            <h2
              className={`i-w${i} display flex overflow-hidden pb-[0.08em] text-[22vw] leading-[0.9] drop-shadow-[0_8px_40px_rgb(0_0_0/0.6)] md:text-[15vw] ${lang === "ar" ? "" : "tracking-tight"}`}
            >
              {lang === "ar" ? (
                <span className="i-char inline-block">{w}</span>
              ) : (
                [...w].map((c, k) => (
                  <span key={k} className="i-char inline-block">
                    {c}
                  </span>
                ))
              )}
            </h2>
            <p
              className={`i-l${i} mt-2 max-w-xl text-base text-cream/80 opacity-0 md:mt-4 md:text-xl`}
            >
              {t.inside.lines[i]}
            </p>
          </div>
        ))}
        <h2 className="i-welcome display neon-text absolute text-5xl opacity-0 md:text-8xl">
          {t.inside.welcome}
        </h2>
      </div>

      <div className="i-count pointer-events-none absolute end-6 top-24 z-[6] flex items-center gap-3 text-xs tabular-nums text-cream/60 md:end-12">
        {MOODS.map((_, i) => (
          <span key={i} className="relative h-px w-6 overflow-hidden bg-cream/20">
            <span
              className={`i-bar${i} absolute inset-0 origin-left bg-amber rtl:origin-right`}
              style={{ transform: "scaleX(0)" }}
            />
          </span>
        ))}
        <span className="ms-1 text-amber">{digits("04", lang)}</span>
      </div>

      {/* sound-like rhythm line */}
      <div
        className="absolute inset-x-0 bottom-[calc(2.5rem+var(--tab))] z-[6] flex h-12 items-center justify-center gap-[5px]"
        aria-hidden
      >
        {Array.from({ length: 48 }, (_, i) => (
          <span
            key={i}
            className="i-beat w-[2px] origin-center rounded-full bg-cream/40"
            style={{
              height: `${(20 + Math.abs(Math.sin(i * 1.7)) * 80).toFixed(1)}%`,
              transform: "scaleY(0.2)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
