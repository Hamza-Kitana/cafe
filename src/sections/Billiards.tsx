import { useRef } from "react";
import { gsap, useScene, cue } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { cafe, fmtPrice } from "@/data/cafe";
import { Ball } from "@/components/art/Billiards";
import { identity, orientBall, roll, type Orient } from "@/lib/ball-roll";
import { Chapter } from "@/components/Chapter";

// Table space: the felt is 100 × 50 units; a ball is D units wide.
const D = 2.6;
const MIN = { x: 1.3 + 1.2, y: 1.3 + 1.2 };
const MAX = { x: 100 - MIN.x, y: 50 - MIN.y };
const CUE_START = { x: 24, y: 25 };
const POCKET = { x: 98.7, y: 48.7 };
const POCKETS = [
  { x: 1.3, y: 1.3 },
  { x: 50, y: 0.4 },
  { x: 98.7, y: 1.3 },
  { x: 1.3, y: 48.7 },
  { x: 50, y: 49.6 },
  POCKET,
];
const RACK_ORDER = [[1], [9, 2], [10, 8, 3], [11, 7, 14, 4], [5, 13, 15, 6, 12]];

type V = { x: number; y: number };

const rack = RACK_ORDER.flatMap((row, i) =>
  row.map((n, j) => ({ n, x: 70 + i * D * 0.87, y: 25 + (j - i / 2) * D * 1.02 })),
);

/** Straight-line travel with cushion reflections; returns the polyline. */
function travel(from: V, dir: V, dist: number): V[] {
  const pts = [from];
  let pos = { ...from };
  const d = { ...dir };
  let left = dist;
  for (let b = 0; b < 3 && left > 0; b++) {
    const tx = d.x > 0 ? (MAX.x - pos.x) / d.x : d.x < 0 ? (MIN.x - pos.x) / d.x : Infinity;
    const ty = d.y > 0 ? (MAX.y - pos.y) / d.y : d.y < 0 ? (MIN.y - pos.y) / d.y : Infinity;
    const hit = Math.min(tx, ty);
    if (hit >= left) {
      pos = { x: pos.x + d.x * left, y: pos.y + d.y * left };
      left = 0;
    } else {
      pos = { x: pos.x + d.x * hit, y: pos.y + d.y * hit };
      left -= hit;
      if (tx < ty) d.x *= -1;
      else d.y *= -1;
    }
    pts.push(pos);
  }
  return pts;
}

function along(pts: V[], s: number): V {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i]!.x, p.y - pts[i]!.y));
  let d = s * lens.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]! || i === lens.length - 1) {
      const k = lens[i]! ? Math.min(1, d / lens[i]!) : 0;
      return {
        x: pts[i]!.x + (pts[i + 1]!.x - pts[i]!.x) * k,
        y: pts[i]!.y + (pts[i + 1]!.y - pts[i]!.y) * k,
      };
    }
    d -= lens[i]!;
  }
  return pts[pts.length - 1]!;
}

const place = (x: number, y: number) => `translate(${x.toFixed(2)}%, ${(y * 2).toFixed(2)}%)`;

/** Deterministic break: every ball always ends up in the same place. */
const breakPaths = rack
  .filter((b) => b.n !== 8)
  .map((b) => {
    const impact = { x: 64.5, y: 25 };
    const jitter = (((b.n * 53) % 17) - 8) * 0.035;
    let a = Math.atan2(b.y - impact.y, b.x - impact.x) + jitter;
    if (b.n === 1) a = 0.35;
    const dist = 12 + ((b.n * 7) % 10) * 2.2;
    return { n: b.n, pts: travel(b, { x: Math.cos(a), y: Math.sin(a) }, dist) };
  });
const eightStart = rack.find((b) => b.n === 8)!;
const eightPath: V[] = [eightStart, POCKET];
const cueIn: V[] = [CUE_START, { x: 70 - D * 1.02, y: 25 }];
const cueOut = travel(cueIn[1]!, { x: -0.8, y: 0.6 }, 9);

/* Top-view table, controlled physics, camera dives into the pocket. INTERACTIVE. */
export function Billiards() {
  const { t, lang, dir } = useI18n();
  const root = useRef<HTMLElement>(null);
  const aimed = useRef(true);

  useScene(root, () => {
    const q = gsap.utils.selector(root);
    const wrap = (n: number) => q(`.b-w${n}`)[0] as HTMLElement;
    const svg = (n: number) => q(`.b-b${n}`)[0] as unknown as SVGSVGElement;
    const cam = () => q(".b-cam")[0] as HTMLElement;
    // Each ball carries a real orientation: it rolls about the axis perpendicular to its motion.
    const balls = new Map<number, { at: V; m: Orient }>();
    [{ n: 0, x: CUE_START.x, y: CUE_START.y }, ...rack].forEach((b) => {
      const tilt = roll(identity(), ((b.n * 37) % 9) - 4, ((b.n * 23) % 9) - 4, 40);
      balls.set(b.n, { at: { x: b.x, y: b.y }, m: tilt });
      orientBall(svg(b.n), b.n, tilt);
    });
    const move = (n: number, pts: V[], s: number) => {
      const p = along(pts, s);
      wrap(n).style.transform = place(p.x, p.y);
      const b = balls.get(n)!;
      b.m = roll(b.m, p.x - b.at.x, p.y - b.at.y, D / 2);
      b.at = p;
      orientBall(svg(n), n, b.m);
    };
    // The display line-height is under 1, so the reveal reaches past the box to keep descenders.
    const hidden = dir === "rtl" ? "inset(-20% 0% -30% 100%)" : "inset(-20% 100% -30% 0%)";
    const word = (i: number, at: number) =>
      tl.fromTo(
        `.b-word${i}`,
        { clipPath: hidden, opacity: 1 },
        { clipPath: "inset(-20% 0% -30% 0%)", duration: 0.8, ease: "power2.out" },
        at,
      );

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "+=460%",
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (s) => {
          if (s.progress > 0.28 && aimed.current) {
            aimed.current = false;
            gsap.to(q(".b-aim"), { rotation: 0, duration: 0.25 });
          } else if (s.progress < 0.28) aimed.current = true;
        },
      },
    });

    tl.to(".b-fog", { opacity: 0, duration: 1.1, ease: "power1.out" }, 0)
      .fromTo(
        ".b-cam",
        { rotateX: 48, scale: 0.88 },
        { rotateX: 26, scale: 1, duration: 1.2, ease: "power2.out" },
        0,
      )
      .to(".b-cam", { rotateX: 0, duration: 2, ease: "power1.inOut" }, 1.2);
    word(0, 0.6);
    tl.fromTo(".b-head", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.8);

    // Draw back… and strike.
    tl.to(".b-cue", { xPercent: -14, duration: 2, ease: "power1.inOut" }, 1).to(
      ".b-cue",
      { xPercent: 2.6, duration: 0.3, ease: "power4.in" },
      3,
    );
    cue(tl, "hit", 3.3);
    tl.to(".b-cue", { opacity: 0, xPercent: -6, duration: 0.6 }, 3.5);

    const cueBall = { s: 0 };
    tl.to(cueBall, { s: 1, duration: 0.5, onUpdate: () => move(0, cueIn, cueBall.s) }, 3.3);
    const cueBack = { s: 0 };
    tl.to(
      cueBack,
      { s: 1, duration: 1.8, ease: "power3.out", onUpdate: () => move(0, cueOut, cueBack.s) },
      3.8,
    );
    cue(tl, "break", 3.8);

    breakPaths.forEach(({ n, pts }) => {
      const p = { s: 0 };
      tl.to(
        p,
        {
          s: 1,
          duration: 2.4 + (n % 4) * 0.25,
          ease: "power3.out",
          onUpdate: () => move(n, pts, p.s),
        },
        3.8,
      );
    });

    const eight = { s: 0 };
    tl.to(
      eight,
      { s: 1, duration: 2.2, ease: "power1.out", onUpdate: () => move(8, eightPath, eight.s) },
      3.8,
    )
      .to(
        ".b-b8",
        { scale: 0.5, filter: "brightness(0.35)", duration: 0.35, ease: "power2.in" },
        5.85,
      )
      .to(".b-w8", { opacity: 0, duration: 0.2 }, 6.2)
      // Camera follows the 8-ball: bring its pocket to the centre of the frame.
      .to(
        ".b-cam",
        {
          scale: 1.6,
          x: () => -0.487 * cam().offsetWidth,
          y: () => -0.474 * cam().offsetHeight,
          duration: 2.4,
          ease: "power1.inOut",
        },
        4,
      );
    cue(tl, "drop", 6.0);

    tl.to(".b-word0", { opacity: 0, duration: 0.3 }, 3.4);
    word(1, 3.6);
    tl.to(".b-word1", { opacity: 0, duration: 0.3 }, 6.1);
    word(2, 6.3);

    // Dive into the pocket.
    tl.to(".b-words, .b-head, .b-foot", { opacity: 0, duration: 0.6 }, 7.4)
      .to(".b-cam", { scale: 55, duration: 2.2, ease: "power3.in" }, 7.4)
      .to(".b-black", { opacity: 1, duration: 0.4 }, 9.4);
  }, [dir]);

  const onMove = (e: React.PointerEvent) => {
    if (!aimed.current) return;
    const y = e.clientY / window.innerHeight - 0.5;
    gsap.to(".b-aim", { rotation: y * 16, duration: 0.6, ease: "power2.out", overwrite: "auto" });
  };

  return (
    <section
      ref={root}
      id="billiards"
      aria-label={t.billiards.kicker}
      className="relative h-screen overflow-hidden bg-[#071510]"
      data-cursor-mode="aim"
      onPointerMove={onMove}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgb(255_220_160/0.16),transparent_60%)]"
        aria-hidden
      />

      <div className="b-head absolute start-6 top-24 z-20 md:start-12">
        <Chapter id="billiards" label={t.billiards.kicker} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center [perspective:1400px]">
        <div className="[transform-style:preserve-3d] portrait:rotate-90">
          <div
            className="b-cam relative aspect-[2/1] w-[min(82vw,150vh)] portrait:w-[min(150vw,78vh)]"
            style={{ transformOrigin: `${POCKET.x}% ${POCKET.y * 2}%` }}
          >
            <div
              className="rails absolute -inset-[clamp(14px,2.4vw,34px)] rounded-[clamp(10px,1.6vw,22px)]"
              aria-hidden
            >
              {[12.5, 25, 37.5, 62.5, 75, 87.5].map((x) => (
                <span
                  key={x}
                  className="absolute top-[3%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#efe3c4]/70"
                  style={{ left: `${x}%` }}
                />
              ))}
            </div>
            <div className="felt absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgb(255_235_190/0.22),transparent_65%)]" />
              <div className="absolute bottom-0 top-0 w-px bg-cream/10" style={{ left: "24%" }} />
              <div
                className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream/40"
                style={{ left: "70%", top: "50%" }}
              />
            </div>
            {POCKETS.map((p, i) => (
              <span
                key={i}
                className="pocket absolute aspect-square w-[4.4%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ left: `${p.x}%`, top: `${p.y * 2}%` }}
                aria-hidden
              />
            ))}

            {[{ n: 0, x: CUE_START.x, y: CUE_START.y }, ...rack].map((b) => (
              <div
                key={b.n}
                className={`b-w${b.n} absolute inset-0`}
                style={{ transform: place(b.x, b.y) }}
                aria-hidden
              >
                <div className="absolute left-0 top-0 aspect-square w-[2.6%] -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute inset-[8%] translate-x-[18%] translate-y-[22%] rounded-full bg-black/55 blur-[3px]" />
                  <Ball n={b.n} className={`b-b${b.n} relative h-full w-full`} />
                </div>
              </div>
            ))}

            <div
              className="b-aim absolute inset-0"
              style={{ transformOrigin: `${CUE_START.x}% 50%` }}
              aria-hidden
            >
              <div
                className="b-cue absolute h-[1.4%] min-h-[4px] w-[46%] -translate-y-1/2"
                style={{ right: `${100 - CUE_START.x + D * 0.9}%`, top: "50%" }}
              >
                <div className="h-full w-full rounded-full bg-[linear-gradient(to_right,#1a0f0a_0%,#2a1810_18%,#c79a5b_18.5%,#e5c48b_60%,#d9b47a_95%,#f4efe2_95.5%,#f4efe2_98.5%,#3b6ea8_98.6%)] shadow-[0_10px_14px_-6px_rgb(0_0_0/0.7)]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="b-words pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        aria-live="polite"
      >
        {t.billiards.words.map((w, i) => (
          <h2
            key={i}
            className={`b-word${i} display absolute text-[20vw] text-[#d8f0dc]/20 opacity-0 md:text-[15vw]`}
          >
            {w}
          </h2>
        ))}
      </div>

      <div className="b-foot absolute bottom-[calc(2rem+var(--tab))] start-6 z-20 max-w-xs md:start-12">
        <p className="text-sm text-cream/75">{t.billiards.sub}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gold">
          {t.billiards.info(cafe.billiards.tables, fmtPrice(cafe.billiards.pricePerHour, lang))}
        </p>
      </div>

      <div
        className="b-fog pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(ellipse_at_50%_60%,#b9b0a4,#6d6760_60%,#3b3733)]"
        aria-hidden
      />
      <div
        className="b-black pointer-events-none absolute inset-0 z-40 bg-ink opacity-0"
        aria-hidden
      />
    </section>
  );
}
