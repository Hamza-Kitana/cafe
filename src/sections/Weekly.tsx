import { useRef, type CSSProperties } from "react";
import { gsap, useScene } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { digits } from "@/data/cafe";
import { nightOf, useAmmanTime } from "@/lib/hours";
import { Chapter } from "@/components/Chapter";

const ACCENTS = [
  "var(--lagoon)",
  "var(--amber)",
  "var(--neon)",
  "var(--felt)",
  "var(--burgundy)",
  "var(--mint)",
  "var(--gold)",
];

/* Interlude: seven nights stacked like a deck, each card pushing the last one back. */
export function Weekly() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  const now = useAmmanTime();
  const tonight = now ? nightOf(now) : -1;
  const w = t.week;

  useScene(root, () => {
    const cards = gsap.utils.toArray<HTMLElement>(".w-card");
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      gsap.to(card.querySelector(".w-card-inner"), {
        scale: 0.9,
        rotateX: 8,
        filter: "brightness(0.6)",
        ease: "none",
        scrollTrigger: {
          trigger: next,
          start: "top bottom",
          end: "top 25%",
          scrub: true,
        },
      });
    });
    gsap.fromTo(
      ".w-head > *",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".w-head", start: "top 80%", once: true },
      },
    );
    gsap.fromTo(
      ".w-progress",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".w-stack", start: "top 60%", end: "bottom 60%", scrub: true },
      },
    );
  }, [lang]);

  return (
    <section
      ref={root}
      id="week"
      aria-label={w.title}
      className="relative overflow-x-clip bg-ink py-24 md:py-36"
    >
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 px-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-20 md:px-12">
        <div className="md:sticky md:top-28 md:self-start">
          <div className="w-head">
            <Chapter id="week" label={w.kicker} />
            <h2 className="display mt-5 text-5xl md:text-7xl">{w.title}</h2>
            <p className="mt-6 max-w-sm text-cream/65">{w.sub}</p>
            <ol className="mt-10 flex gap-2" aria-hidden>
              {w.nights.map((n, i) => (
                <li
                  key={n.day}
                  className={`flex h-12 flex-1 items-end justify-center rounded-full border pb-2 text-[0.6rem] font-semibold uppercase transition-colors md:h-16 ${
                    i === tonight ? "border-transparent text-ink" : "border-border text-cream/45"
                  }`}
                  style={i === tonight ? { background: ACCENTS[i] } : undefined}
                >
                  {n.short}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="w-stack relative">
          <div
            className="absolute -start-6 top-0 hidden h-full w-px bg-border md:block"
            aria-hidden
          >
            <div className="w-progress h-full w-full origin-top bg-amber" />
          </div>
          <ol className="flex flex-col gap-[12vh]">
            {w.nights.map((n, i) => (
              <li
                key={n.day}
                className="w-card sticky [perspective:1200px]"
                style={{ top: `calc(6.5rem + ${i * 0.9}rem)` }}
              >
                <article
                  className="w-card-inner relative origin-top overflow-hidden rounded-[2rem] border border-cream/10 bg-[#120d0a] p-7 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] md:p-10"
                  style={{ ["--c" as string]: ACCENTS[i] } as CSSProperties}
                >
                  <div className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-[var(--c)] opacity-25 blur-[90px]" />
                  <div
                    className="outline-text pointer-events-none absolute -bottom-[0.2em] end-4 select-none font-latin text-[9rem] font-semibold leading-none md:text-[13rem]"
                    style={{ ["--accent" as string]: ACCENTS[i] } as CSSProperties}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="relative flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--c)]">
                      {n.day}
                    </span>
                    {i === tonight && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--c)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" />
                        {w.tonight}
                      </span>
                    )}
                    <span className="ms-auto rounded-full border border-[var(--c)]/40 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-cream/80">
                      {n.tag}
                    </span>
                  </div>

                  <h3 className="display relative mt-8 text-4xl md:text-6xl">{n.name}</h3>
                  <p className="relative mt-4 max-w-md text-cream/65 md:text-lg">{n.text}</p>
                  <div className="relative mt-8 flex items-center gap-3 text-sm text-cream">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 text-[var(--c)]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" strokeLinecap="round" />
                    </svg>
                    <bdi>{digits(n.time, lang)}</bdi>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
