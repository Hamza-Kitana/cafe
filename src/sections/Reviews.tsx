import { useRef } from "react";
import { gsap, useScene, reducedMotion } from "@/lib/motion";
import { useI18n, type Dict } from "@/i18n";
import { cafe, digits } from "@/data/cafe";
import { Marquee } from "@/components/Marquee";
import { Chapter } from "@/components/Chapter";

const HUES = [28, 350, 160, 200, 45, 280, 12, 120];

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-full w-auto" fill="currentColor">
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({ r, i }: { r: Dict["reviews"]["items"][number]; i: number }) {
  return (
    <figure className="mx-3 flex w-[19rem] shrink-0 flex-col rounded-3xl border border-cream/10 bg-[#15100c] p-6 transition-[transform,border-color] duration-500 hover:-translate-y-1.5 hover:border-amber/40 md:w-[24rem] md:p-7">
      <div className="flex items-center gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-ink"
          style={{
            background: `linear-gradient(135deg, hsl(${HUES[i]} 70% 72%), hsl(${HUES[i]} 55% 48%))`,
          }}
          aria-hidden
        >
          {r.name.charAt(0)}
        </span>
        <figcaption className="min-w-0">
          <div className="truncate font-semibold text-cream">{r.name}</div>
          <div className="text-xs text-cream/45">{r.when}</div>
        </figcaption>
        <svg viewBox="0 0 24 24" className="ms-auto h-5 w-5 shrink-0 opacity-70" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h6a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-8z"
          />
          <path
            fill="#34A853"
            d="M12 23c3 0 5.4-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2.1v2.8A11 11 0 0 0 12 23z"
          />
          <path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8z" />
          <path
            fill="#EA4335"
            d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2.1 7.1l3.6 2.8C6.6 7.3 9.1 5.4 12 5.4z"
          />
        </svg>
      </div>
      <Stars className="mt-5 h-3.5 text-amber" />
      <blockquote className="mt-3 text-[0.95rem] leading-relaxed text-cream/80">
        “{r.text}”
      </blockquote>
    </figure>
  );
}

/* Interlude: word of mouth, drifting past in two directions. */
export function Reviews() {
  const { t, lang, dir } = useI18n();
  const root = useRef<HTMLElement>(null);
  const r = t.reviews;
  const half = Math.ceil(r.items.length / 2);

  useScene(root, () => {
    const el = root.current!.querySelector<HTMLElement>(".r-score")!;
    const counter = { v: 0 };
    const still = reducedMotion();
    el.textContent = digits("0.0", lang);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ".r-head", start: "top 80%", once: true },
    });
    tl.to(counter, {
      v: cafe.rating.score,
      duration: still ? 0 : 1.8,
      ease: "power3.out",
      onUpdate: () => void (el.textContent = digits(counter.v.toFixed(1), lang)),
    })
      .fromTo(
        ".r-fill",
        { clipPath: dir === "rtl" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" },
        {
          clipPath: `inset(0 ${dir === "rtl" ? 0 : 100 - cafe.rating.score * 20}% 0 ${dir === "rtl" ? 100 - cafe.rating.score * 20 : 0}%)`,
          duration: still ? 0 : 1.6,
          ease: "power3.out",
        },
        0,
      )
      .fromTo(
        ".r-rows",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        0.2,
      );
  }, [lang]);

  return (
    <section
      ref={root}
      id="reviews"
      aria-label={r.title}
      className="relative overflow-hidden bg-[linear-gradient(to_bottom,#0d0a08,var(--ink))] py-24 md:py-32"
    >
      <div className="r-head mx-auto flex max-w-[90rem] flex-wrap items-end justify-between gap-10 px-6 md:px-12">
        <div>
          <Chapter id="reviews" label={r.kicker} />
          <h2 className="display mt-5 max-w-3xl text-5xl md:text-8xl">{r.title}</h2>
        </div>
        <a
          href={cafe.rating.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor={t.cursor.view}
          className="group flex items-center gap-5 rounded-3xl border border-cream/10 px-6 py-5 transition-colors hover:border-amber/50"
        >
          <span className="r-score display text-6xl tabular-nums text-cream md:text-7xl">
            {digits(cafe.rating.score.toFixed(1), lang)}
          </span>
          <span className="flex flex-col gap-2">
            <span className="relative block h-5">
              <Stars className="h-5 text-cream/15" />
              <span className="r-fill absolute inset-0">
                <Stars className="h-5 text-amber" />
              </span>
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-cream/55">
              {r.rating} · {r.count(digits(cafe.rating.count.toLocaleString("en-US"), lang))}
            </span>
          </span>
        </a>
      </div>

      <div className="r-rows mt-16 flex flex-col gap-6 md:mt-20">
        <Marquee speed={38} pauseOnHover reactive={false}>
          {r.items.map((item, i) => (
            <ReviewCard key={item.name} r={item} i={i} />
          ))}
        </Marquee>
        <Marquee speed={30} reverse pauseOnHover reactive={false}>
          {[...r.items.slice(half), ...r.items.slice(0, half)].map((item, i) => (
            <ReviewCard key={item.name} r={item} i={(i + half) % r.items.length} />
          ))}
        </Marquee>
        <p className="hidden text-center text-xs uppercase tracking-[0.3em] text-cream/35 md:block">
          {r.hint}
        </p>
      </div>
    </section>
  );
}
