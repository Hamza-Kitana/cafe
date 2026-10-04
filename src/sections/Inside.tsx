import { useRef } from "react";
import { gsap, useScene } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { digits } from "@/data/cafe";
import { images, type ImageKey } from "@/data/images";
import { Photo } from "@/components/Photo";
import { Dust } from "@/components/Dust";

const MOODS: ImageKey[] = ["coffee", "friends", "billiards", "lounge"];

/* Four words, four moods — each one a room you can almost smell. */
export function Inside() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);

  useScene(root, () => {
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
        )
        .fromTo(
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
            className="h-full w-full object-cover brightness-[0.55] saturate-[0.9]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_20%,var(--ink)_85%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/60" />
        </div>
      ))}
      <Dust className="z-[4]" count={24} />

      <div className="relative z-[5] flex h-full items-center justify-center px-6 text-center">
        {t.inside.words.map((w, i) => (
          <div key={i} className="absolute inset-x-0 flex flex-col items-center">
            <h2
              className={`i-w${i} display flex overflow-hidden pb-[0.08em] text-[22vw] leading-[0.9] md:text-[15vw] ${lang === "ar" ? "" : "tracking-tight"}`}
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
