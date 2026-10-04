import { useRef } from "react";
import { gsap, useScene } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { digits } from "@/data/cafe";
import { Chapter } from "@/components/Chapter";

/** Minutes after 7:00 PM for each event in the night. */
const EVENTS = [0, 90, 180, 270, 330, 390, 420];
const START = 19 * 60;
const R = 46;
const CIRC = 2 * Math.PI * R;

/* The night passes in one scroll. MINIMAL. */
export function TheClock() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);

  useScene(root, () => {
    const q = gsap.utils.selector(root);
    const [hour, minute, second] = ["hour", "minute", "second"].map(
      (k) => q(`.ck-${k}`)[0] as unknown as SVGElement,
    );
    const digital = q(".ck-digital")[0] as HTMLElement;
    const ring = q(".ck-ring")[0] as unknown as SVGCircleElement;
    const labels = q(".ck-event") as HTMLElement[];
    const marks = q(".ck-mark") as HTMLElement[];
    const time = { m: 0 };
    let current = -1;

    const render = () => {
      const total = START + time.m;
      const h24 = Math.floor(total / 60) % 24;
      const mm = Math.floor(total % 60);
      const h12 = h24 % 12 || 12;
      hour!.style.transform = `rotate(${(total % 720) / 2}deg)`;
      minute!.style.transform = `rotate(${(total % 60) * 6}deg)`;
      second!.style.transform = `rotate(${time.m * 120}deg)`;
      digital.textContent =
        digits(`${String(h12).padStart(2, "0")}:${String(mm).padStart(2, "0")}`, lang) +
        ` ${h24 >= 12 ? t.clock.pm : t.clock.am}`;
      ring.style.strokeDashoffset = String(CIRC * (1 - time.m / 420));
      const idx = EVENTS.reduce((acc, e, i) => (time.m >= e - 0.5 ? i : acc), -1);
      if (idx !== current) {
        const prev = current;
        current = idx;
        if (prev >= 0)
          gsap.to(labels[prev]!, {
            yPercent: -110,
            opacity: 0,
            duration: 0.5,
            ease: "power3.in",
            overwrite: true,
          });
        if (idx >= 0)
          gsap.fromTo(
            labels[idx]!,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.7, ease: "power3.out", overwrite: true },
          );
        marks.forEach((m, i) => m.classList.toggle("is-active", i === idx));
        marks.forEach((m, i) => m.classList.toggle("is-past", i < idx));
      }
      root.current!.style.setProperty("--night", String(time.m / 420));
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "+=440%",
        scrub: 1,
        pin: true,
      },
      defaults: { ease: "power2.inOut" },
    });
    tl.fromTo(
      ".ck-title",
      { opacity: 0, letterSpacing: "0.25em" },
      { opacity: 1, letterSpacing: "0em", duration: 0.8, ease: "power2.out" },
      0,
    )
      .to(".ck-title", { opacity: 0.0, y: -30, duration: 0.5 }, 1.3)
      .fromTo(".ck-face", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 }, 0.2)
      .call(render, undefined, 0.2);
    EVENTS.forEach((e, i) => {
      if (i === 0) return;
      tl.to(
        time,
        { m: e, duration: ((e - EVENTS[i - 1]!) / 60) * 0.7, onUpdate: render },
        i === 1 ? 1.6 : ">",
      ).to({}, { duration: 0.45 });
    });
    tl.to(".ck-face", { scale: 0.92, opacity: 0.4, duration: 0.6 }, ">");
    render();
  }, [lang]);

  const ticks = Array.from({ length: 60 }, (_, i) => i);

  return (
    <section
      ref={root}
      id="clock"
      aria-label={t.clock.title}
      className="relative h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, color-mix(in oklab, #1d1712 calc((1 - var(--night, 0)) * 100%), #07080d), #050506 75%)",
      }}
    >
      <Chapter
        id="clock"
        label={t.clock.kicker}
        className="absolute start-6 top-24 z-20 md:start-12"
      />
      <h2 className="ck-title display absolute inset-x-6 top-[16%] z-10 text-center text-4xl md:text-7xl">
        {t.clock.title}
      </h2>

      <div className="absolute inset-0 grid grid-cols-1 items-center px-6 md:grid-cols-[1fr_auto_1fr] md:gap-16 md:px-12">
        <div
          className="relative order-2 h-24 overflow-hidden md:order-1 md:h-40"
          aria-live="polite"
        >
          {t.clock.events.map((ev, i) => (
            <div
              key={i}
              className="ck-event display absolute inset-0 flex items-center justify-center text-4xl opacity-0 md:justify-end md:text-end md:text-6xl"
            >
              {ev}
            </div>
          ))}
        </div>

        <div
          className="ck-face relative order-1 mx-auto aspect-square w-[min(72vw,52vh)] md:order-2"
          dir="ltr"
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
            <circle
              cx="50"
              cy="50"
              r="49"
              fill="rgb(255 255 255 / 0.015)"
              stroke="rgb(240 228 210 / 0.12)"
              strokeWidth="0.3"
            />
            <circle
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke="rgb(240 228 210 / 0.06)"
              strokeWidth="0.6"
            />
            <circle
              className="ck-ring"
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke="var(--amber)"
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC}
              transform="rotate(-90 50 50)"
            />
            {ticks.map((i) => (
              <line
                key={i}
                x1="50"
                y1={i % 5 ? 6.5 : 5.5}
                x2="50"
                y2={i % 5 ? 8 : 10}
                stroke={i % 5 ? "rgb(240 228 210 / 0.3)" : "rgb(240 228 210 / 0.8)"}
                strokeWidth={i % 5 ? 0.3 : 0.7}
                transform={`rotate(${i * 6} 50 50)`}
              />
            ))}
            <g className="ck-hour" style={{ transformOrigin: "50px 50px" }}>
              <line
                x1="50"
                y1="52"
                x2="50"
                y2="28"
                stroke="var(--cream)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
            <g className="ck-minute" style={{ transformOrigin: "50px 50px" }}>
              <line
                x1="50"
                y1="54"
                x2="50"
                y2="14"
                stroke="var(--cream)"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </g>
            <g className="ck-second" style={{ transformOrigin: "50px 50px" }}>
              <line x1="50" y1="58" x2="50" y2="10" stroke="var(--amber)" strokeWidth="0.3" />
            </g>
            <circle cx="50" cy="50" r="1.6" fill="var(--amber)" />
          </svg>
          <div className="absolute inset-x-0 top-[64%] text-center">
            <span className="ck-digital font-latin text-lg tabular-nums tracking-[0.2em] text-cream/80 md:text-2xl" />
          </div>
        </div>

        <ol className="order-3 hidden space-y-3 md:block" aria-hidden>
          {t.clock.events.map((ev, i) => {
            const m = START + EVENTS[i]!;
            const h = Math.floor(m / 60) % 24;
            const label = `${h % 12 || 12}:${String(m % 60).padStart(2, "0")} ${h >= 12 ? t.clock.pm : t.clock.am}`;
            return (
              <li
                key={i}
                className="ck-mark flex items-baseline gap-4 text-cream/30 transition-colors duration-500"
              >
                <span className="w-20 text-xs tabular-nums">{digits(label, lang)}</span>
                <span className="text-sm">{ev}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
