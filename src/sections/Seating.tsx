import { useRef } from "react";
import { gsap, useScene } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { digits } from "@/data/cafe";
import { images } from "@/data/images";
import { Photo } from "@/components/Photo";
import { Chapter } from "@/components/Chapter";

/* Full-screen spatial gallery, a different reveal every time. CALM. */
export function Seating() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  const places = t.seating.places;

  useScene(root, () => {
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "+=520%",
        scrub: 1.6,
        pin: true,
      },
    });
    const label = (i: number, at: number) =>
      tl.fromTo(`.st-label${i}`, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, at);

    // 1 — Curtain reveal.
    tl.to(".st-cl", { xPercent: -100, duration: 1.4 }, 0.1)
      .to(".st-cr", { xPercent: 100, duration: 1.4 }, 0.1)
      .fromTo(".st-s1 img", { scale: 1.18 }, { scale: 1, duration: 2.6, ease: "none" }, 0.1)
      .fromTo(
        ".st-w0",
        { opacity: 0, letterSpacing: "0.3em" },
        { opacity: 1, letterSpacing: "0em", duration: 1 },
        0.9,
      );
    label(0, 1);
    tl.to(".st-w0, .st-label0", { opacity: 0, duration: 0.5 }, 2.4);

    // 2 — Split screen.
    tl.fromTo(".st-s2a", { yPercent: -100 }, { yPercent: 0, duration: 1.3 }, 2.6).fromTo(
      ".st-s2b",
      { yPercent: 100 },
      { yPercent: 0, duration: 1.3 },
      2.6,
    );
    label(1, 3.5);
    tl.to(".st-label1", { opacity: 0, duration: 0.4 }, 4.6);

    // 3 — Zoom through a window into the next room.
    tl.fromTo(
      ".st-s3",
      { clipPath: "inset(50% 50% 50% 50% round 28px)" },
      { clipPath: "inset(42% 40% 42% 40% round 28px)", duration: 0.4, immediateRender: false },
      4.4,
    )
      .fromTo(
        ".st-s3",
        { clipPath: "inset(42% 40% 42% 40% round 28px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.6, immediateRender: false },
        4.8,
      )
      .to(
        ".st-s2a, .st-s2b",
        { scale: 1.6, filter: "blur(8px) brightness(0.6)", duration: 1.6 },
        4.8,
      )
      .fromTo(".st-s3 img", { scale: 1.5 }, { scale: 1, duration: 1.6 }, 4.8);
    label(2, 5.9);
    tl.to(".st-label2", { opacity: 0, duration: 0.4 }, 7);

    // 4 — Parallax depth.
    tl.fromTo(".st-s4", { yPercent: 100 }, { yPercent: 0, duration: 1.6, ease: "none" }, 7.2)
      .fromTo(".st-s4 img", { yPercent: -30 }, { yPercent: 0, duration: 1.6, ease: "none" }, 7.2)
      .to(".st-s3", { yPercent: -30, duration: 1.6, ease: "none" }, 7.2)
      .fromTo(".st-w1", { yPercent: 160 }, { yPercent: 0, duration: 1.8, ease: "power2.out" }, 7.4);
    label(3, 8.4);
    tl.to(".st-w1, .st-label3", { opacity: 0, duration: 0.5 }, 9.6);

    // 5 — Light-mask reveal, starting from the lamp.
    tl.fromTo(
      ".st-s5",
      { clipPath: "circle(0% at 72% 36%)" },
      { clipPath: "circle(150% at 72% 36%)", duration: 2, ease: "power2.in" },
      9.8,
    )
      .fromTo(".st-s5 img", { scale: 1.25 }, { scale: 1.05, duration: 2.6, ease: "none" }, 9.8)
      .fromTo(
        ".st-w2",
        { opacity: 0, filter: "blur(14px)" },
        { opacity: 1, filter: "blur(0px)", duration: 1.2 },
        11.2,
      );
    label(4, 11.4);
    tl.to({}, { duration: 0.8 });
  });

  const Label = ({ i }: { i: number }) => (
    <div
      className={`st-label${i} absolute bottom-[calc(2.5rem+var(--tab))] start-6 z-20 flex items-baseline gap-3 opacity-0 md:start-12`}
    >
      <span className="text-xs tabular-nums text-amber">{digits(`0${i + 1}`, lang)}</span>
      <span className="text-sm uppercase tracking-[0.25em] text-cream/85">{places[i]}</span>
    </div>
  );

  const shade =
    "pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/30";

  return (
    <section
      ref={root}
      id="seating"
      aria-label={t.seating.kicker}
      className="relative h-screen overflow-hidden bg-ink"
      data-cursor={t.cursor.view}
    >
      <div className="st-s1 absolute inset-0 overflow-hidden">
        <Photo img={images.indoor} alt={t.alt.indoor} className="h-full w-full object-cover" />
        <div className={shade} />
        <h2 className="st-w0 display absolute inset-x-0 top-[40%] text-center text-6xl opacity-0 md:text-9xl">
          {t.seating.lines[0]}
        </h2>
        <Label i={0} />
        <div className="st-cl curtain absolute inset-y-0 left-0 w-[51%]" aria-hidden />
        <div className="st-cr curtain absolute inset-y-0 right-0 w-[51%]" aria-hidden />
      </div>

      <div className="absolute inset-0">
        <div className="st-s2a absolute inset-0 overflow-hidden [clip-path:inset(0_50%_0_0)]">
          <Photo img={images.outdoor} alt={t.alt.outdoor} className="h-full w-full object-cover" />
          <div className={shade} />
        </div>
        <div
          className="st-s2b absolute inset-0 overflow-hidden [clip-path:inset(0_0_0_50%)]"
          aria-hidden
        >
          <Photo img={images.outdoor} alt="" className="h-full w-full object-cover" />
          <div className={shade} />
        </div>
        <Label i={1} />
      </div>

      <div
        className="st-s3 absolute inset-0 overflow-hidden"
        style={{ clipPath: "inset(50% 50% 50% 50% round 28px)" }}
      >
        <Photo img={images.lounge} alt={t.alt.lounge} className="h-full w-full object-cover" />
        <div className={shade} />
        <Label i={2} />
      </div>

      <div className="st-s4 absolute inset-0 overflow-hidden">
        <Photo
          img={images.friends}
          alt={t.alt.friends}
          className="h-full w-full object-cover object-[50%_40%]"
        />
        <div className={shade} />
        <h2 className="st-w1 display absolute bottom-[18%] end-6 text-6xl md:end-12 md:text-9xl">
          {t.seating.lines[1]}
        </h2>
        <Label i={3} />
      </div>

      <div
        className="st-s5 absolute inset-0 overflow-hidden"
        style={{ clipPath: "circle(0% at 72% 36%)" }}
      >
        <Photo img={images.facade} alt={t.alt.facade} className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-[#120a1a]/50" />
        <h2 className="st-w2 display neon-text absolute inset-x-0 top-[38%] text-center text-6xl opacity-0 md:text-9xl">
          {t.seating.lines[2]}
        </h2>
        <Label i={4} />
      </div>

      <Chapter
        id="seating"
        label={t.seating.kicker}
        className="absolute start-6 top-24 z-30 md:start-12"
      />
    </section>
  );
}
