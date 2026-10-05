import { useRef } from "react";
import { gsap, useScene, cue } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { PlayingCard, type Suit } from "@/components/art/PlayingCard";
import { Ashtray, SnackBowl, TopBall, TopCup, TopPhone } from "@/components/art/TableTop";
import { Chapter } from "@/components/Chapter";

const DECK: [string, Suit][] = [
  ["A", "♥"],
  ["K", "♠"],
  ["Q", "♦"],
  ["J", "♣"],
  ["10", "♥"],
  ["7", "♠"],
  ["A", "♠"],
  ["K", "♦"],
];
const ENTRY = [
  { x: -80, y: 50, r: -200 },
  { x: 180, y: 50, r: 220 },
  { x: 50, y: -80, r: 160 },
  { x: 50, y: 190, r: -180 },
];
const SEATS = [
  { x: 50, y: 15, r: 180 },
  { x: 85, y: 50, r: -90 },
  { x: 50, y: 85, r: 0 },
  { x: 15, y: 50, r: 90 },
];

/* Friends, cards, warm wood. PLAYFUL. */
export function CardsTable() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useScene(root, () => {
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "+=420%",
        scrub: 1,
        pin: true,
      },
    });
    const q = gsap.utils.selector(root);
    const cw = (i: number) => `.k-cw${i}`;
    const card = (i: number) => `.k-cw${i} .playing-card`;
    const W = DECK.map((_, i) => q(cw(i))[0]!);
    const C = DECK.map((_, i) => q(card(i))[0]!);
    const line = (i: number, at: number) => {
      tl.fromTo(
        `.k-l${i} .k-word`,
        { opacity: 0, rotateX: -90, yPercent: 60 },
        {
          opacity: 1,
          rotateX: 0,
          yPercent: 0,
          stagger: 0.12,
          duration: 0.6,
          ease: "back.out(1.6)",
        },
        at,
      );
      if (i < 2)
        tl.to(
          `.k-l${i} .k-word`,
          { opacity: 0, yPercent: -60, stagger: 0.06, duration: 0.4, ease: "power2.in" },
          at + 2.2,
        );
    };

    // Lights on, coming out of the pocket's darkness.
    tl.fromTo(".k-light", { opacity: 0 }, { opacity: 1, duration: 1, ease: "power1.in" }, 0)
      .fromTo(".k-plane", { rotateX: 70, scale: 1.15 }, { rotateX: 56, scale: 1, duration: 1.4 }, 0)
      .to(".k-plane", { rotateZ: 28, duration: 8, ease: "none" }, 1)
      .fromTo(
        ".k-ball",
        { scale: 3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: "bounce.out" },
        0.3,
      );

    DECK.forEach((_, i) =>
      gsap.set(cw(i), {
        xPercent: i < 4 ? ENTRY[i]!.x : 50,
        yPercent: i < 4 ? ENTRY[i]!.y : 190,
        z: i * 0.6,
      }),
    );
    DECK.forEach((_, i) => gsap.set(card(i), { rotation: i < 4 ? ENTRY[i]!.r : 0 }));

    // Card 1, 2, 3, 4 slide in from every side; the rest of the deck follows.
    [0, 1, 2, 3].forEach((i) => {
      tl.to(
        cw(i),
        { xPercent: 50 + (i - 1.5) * 0.4, yPercent: 50, duration: 0.8, ease: "power3.out" },
        1 + i * 0.35,
      ).to(card(i), { rotation: (i - 1.5) * 4, duration: 0.8, ease: "power3.out" }, "<");
    });
    tl.to(
      W.slice(4),
      { yPercent: 50, xPercent: 50, duration: 0.6, stagger: 0.05, ease: "power3.out" },
      2.4,
    );
    line(0, 1.6);

    // Shuffle: split, then riffle back together.
    tl.to(
      W.filter((_, i) => i % 2 === 0),
      { xPercent: 32, duration: 0.5 },
      3,
    )
      .to(
        W.filter((_, i) => i % 2 === 1),
        { xPercent: 68, duration: 0.5 },
        3,
      )
      .to(C, { rotation: (i) => (i % 2 ? 12 : -12), duration: 0.5 }, 3)
      .to(
        W,
        { xPercent: 50, z: (i) => 10 + i * 2, duration: 0.6, stagger: 0.06, ease: "power2.in" },
        3.6,
      )
      .to(C, { rotation: 0, duration: 0.6, stagger: 0.06 }, 3.6)
      .to(W, { z: (i) => i * 0.6, duration: 0.3 }, 4.3);
    cue(tl, "shuffle", 3.6);

    // Spread into a fan.
    tl.to(
      W,
      {
        xPercent: (i) => 50 + (i - 3.5) * 5,
        yPercent: (i) => 50 + Math.abs(i - 3.5) * 1.6,
        duration: 0.8,
      },
      4.6,
    ).to(C, { rotation: (i) => (i - 3.5) * 9, duration: 0.8 }, 4.6);
    line(1, 4.9);

    // Flip.
    tl.to(C, { rotationY: 180, duration: 0.5, stagger: 0.08, ease: "power2.out" }, 5.5);
    cue(tl, "flip", 5.5);

    // Deal to four friends.
    tl.to(
      W,
      {
        xPercent: (i) => SEATS[i % 4]!.x + (i < 4 ? -2.5 : 2.5),
        yPercent: (i) => SEATS[i % 4]!.y,
        duration: 0.7,
        stagger: 0.07,
        ease: "power3.out",
      },
      6.6,
    ).to(
      C,
      {
        rotation: (i) => SEATS[i % 4]!.r + (i < 4 ? -6 : 6),
        duration: 0.7,
        stagger: 0.07,
        ease: "power3.out",
      },
      6.6,
    );
    line(2, 7.4);

    // Cards that pass right in front of the camera.
    tl.fromTo(
      ".k-fly0",
      { xPercent: -160, yPercent: 30, rotate: -40, opacity: 0 },
      { xPercent: 260, yPercent: -40, rotate: 50, opacity: 1, duration: 1.4, ease: "none" },
      3.1,
    ).fromTo(
      ".k-fly1",
      { xPercent: 260, yPercent: 60, rotate: 30, opacity: 0 },
      { xPercent: -200, yPercent: -20, rotate: -60, opacity: 1, duration: 1.4, ease: "none" },
      6.4,
    );

    // Camera rises off the table toward the room.
    tl.to(
      ".k-plane",
      { rotateX: 18, scale: 0.55, y: "-10vh", duration: 1.6, ease: "power2.in" },
      8.6,
    )
      .to(".k-lines, .k-info", { opacity: 0, duration: 0.6 }, 8.6)
      .fromTo(
        ".k-curtain-l",
        { xPercent: -100 },
        { xPercent: 0, duration: 1.2, ease: "power2.inOut" },
        8.9,
      )
      .fromTo(
        ".k-curtain-r",
        { xPercent: 100 },
        { xPercent: 0, duration: 1.2, ease: "power2.inOut" },
        8.9,
      );
  });

  return (
    <section
      ref={root}
      id="cards"
      aria-label={t.cards.kicker}
      className="relative h-screen overflow-hidden bg-[#0b0706]"
    >
      <Chapter
        id="cards"
        label={t.cards.kicker}
        className="absolute start-6 top-24 z-20 md:start-12"
      />

      <div className="absolute inset-0 flex items-center justify-center [perspective:1100px] md:justify-end md:pe-[4vw]">
        <div
          className="k-plane relative h-[min(92vmin,700px)] w-[min(118vmin,980px)] [transform-style:preserve-3d]"
          aria-hidden
        >
          <div className="wood absolute inset-0 rounded-[3%] shadow-[0_60px_120px_-20px_black]" />
          <div className="absolute inset-[16%] rounded-[50%] bg-[radial-gradient(ellipse,#5a1622_0%,#3d0e17_70%)] shadow-[inset_0_0_60px_rgb(0_0_0/0.6)]" />
          <div className="absolute inset-[17.5%] rounded-[50%] border border-gold/25" />
          <TopCup
            className="absolute left-[7%] top-[9%] w-[15%] -rotate-12 drop-shadow-[0_14px_10px_rgb(0_0_0/0.6)]"
            latte={false}
          />
          <Ashtray className="absolute right-[8%] top-[10%] w-[11%] drop-shadow-[0_10px_8px_rgb(0_0_0/0.6)]" />
          <SnackBowl className="absolute bottom-[8%] left-[9%] w-[13%] drop-shadow-[0_12px_10px_rgb(0_0_0/0.6)]" />
          <TopPhone className="absolute bottom-[9%] right-[10%] w-[6.5%] rotate-[24deg] drop-shadow-[0_10px_8px_rgb(0_0_0/0.6)]" />
          <div className="k-ball absolute bottom-[22%] right-[26%] w-[4.6%]">
            <div className="drop-shadow-[0_8px_6px_rgb(0_0_0/0.7)]">
              <TopBall className="h-full w-full" n={8} />
            </div>
          </div>
          {DECK.map(([rank, suit], i) => (
            <div key={i} className={`k-cw${i} absolute inset-0 [transform-style:preserve-3d]`}>
              <div className="absolute left-0 top-0 w-[10%] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]">
                <PlayingCard rank={rank} suit={suit} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="k-light pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_62%_42%,rgb(255_190_110/0.22),transparent_55%),radial-gradient(ellipse_at_62%_42%,transparent_40%,rgb(0_0_0/0.85))]"
        aria-hidden
      />

      <div
        className="k-lines pointer-events-none absolute inset-x-6 top-[34%] z-20 md:inset-x-auto md:start-12 md:top-1/2 md:max-w-[44vw] md:-translate-y-1/2"
        aria-live="polite"
      >
        {t.cards.lines.map((l, i) => (
          <h2
            key={i}
            className={`k-l${i} display absolute inset-x-0 text-center text-5xl [perspective:600px] md:text-start md:text-8xl ${i === 2 ? "neon-text" : ""}`}
          >
            {l.split(" ").map((w, k) => (
              <span
                key={k}
                className="k-word me-[0.22em] inline-block opacity-0 [transform-origin:50%_100%]"
              >
                {w}
              </span>
            ))}
          </h2>
        ))}
      </div>

      <p className="k-info absolute bottom-[calc(2rem+var(--tab))] start-6 z-20 max-w-sm text-xs uppercase tracking-[0.2em] text-gold/80 md:start-12">
        {t.cards.info}
      </p>

      <div className="pointer-events-none absolute inset-0 z-30" aria-hidden>
        <div className="k-fly0 absolute left-1/3 top-1/3 w-[22vmin] opacity-0">
          <div className="blur-[3px]">
            <PlayingCard rank="Q" suit="♥" style={{ transform: "rotateY(180deg)" }} />
          </div>
        </div>
        <div className="k-fly1 absolute left-1/3 top-1/2 w-[26vmin] opacity-0">
          <div className="blur-[4px]">
            <PlayingCard rank="J" suit="♠" />
          </div>
        </div>
      </div>

      <div
        className="k-curtain-l curtain pointer-events-none absolute inset-y-0 left-0 z-40 w-[51%]"
        aria-hidden
      />
      <div
        className="k-curtain-r curtain pointer-events-none absolute inset-y-0 right-0 z-40 w-[51%]"
        aria-hidden
      />
    </section>
  );
}
