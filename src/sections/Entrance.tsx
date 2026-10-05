import { useRef } from "react";
import { gsap, useScene, goTo, cue } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { images } from "@/data/images";
import { cafe } from "@/data/cafe";
import { Photo } from "@/components/Photo";
import { Magnetic } from "@/components/Magnetic";
import { Dust } from "@/components/Dust";
import { Emblem, Logo } from "@/components/brand/Logo";

const LIGHT_R = 460;

/* Outside at night → camera pushes through the glass door. CINEMATIC. */
export function Entrance({ ready }: { ready: boolean }) {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const follow = useRef<((x: number, y: number) => void) | null>(null);
  const words = t.entrance.title.split(" ");

  useScene(root, () => {
    const door = root.current!.querySelector<HTMLElement>(".e-door")!;
    const q = (sel: string, prop: string, duration: number) =>
      gsap.quickTo(sel, prop, { duration });
    const parallax = [
      [q(".e-door", "rotationY", 1), 6, "x"],
      [q(".e-door", "rotationX", 1), -3, "y"],
      [q(".e-glow", "x", 1.2), 60, "x"],
      [q(".e-glow", "y", 1.2), 30, "y"],
      [q(".e-bg", "x", 1.4), -24, "x"],
      [q(".e-bg", "y", 1.4), -14, "y"],
      [q(".e-dust", "x", 2), -40, "x"],
      [q(".e-dust", "y", 2), -20, "y"],
    ] as const;
    follow.current = (x, y) => parallax.forEach(([to, k, axis]) => to((axis === "x" ? x : y) * k));
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "+=220%",
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
    tl.to(".e-title", { opacity: 0, y: -60, duration: 0.25 }, 0)
      .to(".e-meta", { opacity: 0, duration: 0.2 }, 0)
      .to(
        ".e-cam",
        {
          scale: 2.8,
          transformOrigin: () => `50% ${door.offsetTop + door.offsetHeight * 0.55}px`,
          duration: 1,
          ease: "power2.in",
        },
        0,
      )
      .to(".e-bg", { scale: 1.35, filter: "blur(10px) brightness(0.6)", duration: 1 }, 0)
      .to(".e-rays", { opacity: 1.4, scale: 1.3, duration: 0.6 }, 0)
      .to(".e-fog", { opacity: 0, y: 80, duration: 0.5 }, 0)
      .to(".e-logo", { scale: 1.4, opacity: 0, duration: 0.5 }, 0.1)
      .to(".e-reflect", { xPercent: 260, duration: 0.8 }, 0)
      .to(".e-door-l", { rotateY: -100, duration: 0.6, ease: "power2.inOut" }, 0.3)
      .to(".e-door-r", { rotateY: 100, duration: 0.6, ease: "power2.inOut" }, 0.3)
      .to(".e-inside", { opacity: 1, filter: "brightness(1.4) saturate(1.1)", duration: 0.6 }, 0.3)
      .to(".e-flash", { opacity: 1, duration: 0.18 }, 0.84);
    cue(tl, "door", 0.32);
  });

  const onMove = (e: React.PointerEvent) => {
    follow.current?.(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
    const el = root.current;
    if (light.current && el)
      light.current.style.transform = `translate(${e.clientX - el.clientWidth * 0.5 - LIGHT_R}px, ${e.clientY - el.clientHeight * 0.4 - LIGHT_R}px)`;
  };

  const fx = `transition-all duration-[1200ms] ease-[cubic-bezier(.2,.7,.2,1)] ${ready ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`;

  return (
    <section
      ref={root}
      id="entrance"
      aria-label={t.entrance.title}
      className="relative h-screen overflow-hidden bg-ink"
      onPointerMove={onMove}
      data-cursor={t.cursor.enter}
    >
      {/* the street at night */}
      <Photo
        img={images.facade}
        alt={t.alt.facade}
        priority
        className="e-bg absolute inset-[-3%] h-[106%] w-[106%] max-w-none object-cover opacity-45 saturate-[0.85]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_42%,transparent,var(--ink)_85%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/10 to-ink" />
      <div className="absolute inset-0 bg-amber/[0.06] mix-blend-overlay" />
      {/* moved by transform so following the pointer never repaints the scene */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light">
        <div
          ref={light}
          className="absolute left-1/2 top-[40%] h-[920px] w-[920px] will-change-transform [background:radial-gradient(460px_circle_at_center,rgb(255_200_120/0.35),transparent_70%)]"
          style={{ transform: `translate(${-LIGHT_R}px, ${-LIGHT_R}px)` }}
        />
      </div>

      <div className="e-fog pointer-events-none absolute inset-x-0 bottom-0 h-1/2" aria-hidden>
        <div className="smoke absolute -bottom-20 left-[5%] h-64 w-[50vw]">
          <div className="puff bg-cream/[0.07]" />
        </div>
        <div
          className="smoke absolute -bottom-24 right-[0%] h-72 w-[60vw]"
          style={{ animationDelay: "-6s" }}
        >
          <div className="puff bg-cream/[0.06]" />
        </div>
      </div>

      <div className="e-cam absolute inset-0 flex items-start justify-center pt-[max(6rem,12vh)] [perspective:1400px]">
        <div className="e-door relative aspect-[5/8] h-[clamp(9rem,calc(100svh-31.5rem),44vh)] [transform-style:preserve-3d] md:h-[clamp(10rem,calc(100svh-25rem),50vh)]">
          <div className="e-glow absolute -inset-28">
            <div className="h-full w-full rounded-full bg-amber/20 blur-3xl" />
          </div>
          {/* light spilling out of the door onto the pavement */}
          <div className="e-rays rays pointer-events-none absolute left-1/2 top-[30%] h-[260%] w-[420%] -translate-x-1/2 opacity-80" />
          <div className="absolute -bottom-8 left-1/2 h-16 w-[190%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_190_110/0.45),transparent)] blur-md" />

          {/* gold arch frame */}
          <div className="absolute inset-0 rounded-t-full bg-[linear-gradient(120deg,#6b4a1e,#f6dc9c_35%,#b88a3e_55%,#fff1c9_70%,#7a5520)] p-[7px] shadow-[0_40px_90px_-20px_rgb(0_0_0/0.9),0_0_60px_-10px_rgb(255_180_80/0.45)]">
            <div className="relative h-full w-full overflow-hidden rounded-t-full bg-ink [perspective:900px]">
              <Photo
                img={images.indoor}
                alt=""
                sizes="(max-width: 768px) 60vw, 380px"
                className="e-inside absolute inset-0 h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgb(255_190_110/0.35),transparent_70%)] mix-blend-screen" />
              {(["l", "r"] as const).map((side) => (
                <div
                  key={side}
                  className={`e-door-${side} door-glass absolute inset-y-0 w-1/2 ${side === "l" ? "left-0 origin-left" : "right-0 origin-right"}`}
                >
                  {side === "l" && (
                    <div className="e-reflect absolute -inset-y-10 -left-full w-1/2 rotate-12">
                      <div className="h-full w-full bg-gradient-to-r from-transparent via-cream/25 to-transparent blur-sm" />
                    </div>
                  )}
                  <div
                    className={`absolute top-[56%] h-[22%] w-[5px] rounded-full bg-[linear-gradient(90deg,#7a5520,#fff1c9,#b88a3e)] shadow-[0_0_8px_rgb(255_200_120/0.6)] ${side === "l" ? "right-3" : "left-3"}`}
                  />
                </div>
              ))}
              <div className="e-logo pointer-events-none absolute inset-x-0 top-[24%] flex flex-col items-center gap-2 text-center">
                <Logo
                  size="md"
                  word
                  className="flex-col !gap-1 [&_.logo-word]:text-[2.4rem] md:[&_.logo-word]:text-[2.8rem]"
                />
              </div>
            </div>
          </div>
          {/* keystone */}
          <div className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-gold/60 bg-ink shadow-[0_0_24px_rgb(255_180_80/0.5)]">
            <Emblem className="h-6 w-auto" />
          </div>
          {/* step */}
          <div className="absolute -bottom-3 left-1/2 h-3 w-[118%] -translate-x-1/2 rounded-sm bg-[linear-gradient(180deg,#3a2f26,#14100c)] shadow-[0_10px_20px_rgb(0_0_0/0.7)]" />
        </div>
      </div>

      <Dust className="e-dust z-[1]" count={42} />

      {/* side meta */}
      <div className="e-meta pointer-events-none absolute inset-0 z-10 hidden md:block" aria-hidden>
        <div className="absolute start-8 top-1/2 -translate-y-1/2">
          <span
            className={`block text-[0.6rem] tracking-[0.4em] text-cream/45 [writing-mode:vertical-rl] ltr:rotate-180 ${fx}`}
            style={{ transitionDelay: "500ms" }}
          >
            31.9539° N — 35.9106° E
          </span>
        </div>
        <div className="absolute end-8 top-1/2 -translate-y-1/2">
          <span
            className={`block text-[0.6rem] tracking-[0.4em] text-cream/45 [writing-mode:vertical-rl] ltr:rotate-180 ${fx}`}
            style={{ transitionDelay: "600ms" }}
          >
            {cafe.address[lang]}
          </span>
        </div>
        <div
          className={`absolute bottom-8 start-8 flex items-center gap-3 ${fx}`}
          style={{ transitionDelay: `900ms` }}
        >
          <span className="relative h-10 w-px overflow-hidden bg-cream/15">
            <span className="scroll-line absolute inset-x-0 top-0 h-1/2 bg-amber" />
          </span>
          <span className="text-[0.6rem] tracking-[0.3em] text-cream/55">{t.entrance.hint}</span>
        </div>
        <div
          className={`absolute bottom-8 end-8 text-[0.6rem] tracking-[0.3em] text-cream/55 ${fx}`}
          style={{ transitionDelay: `900ms` }}
        >
          {cafe.hours[lang]}
        </div>
      </div>

      <div className="e-title absolute inset-x-0 bottom-[calc(7rem+env(safe-area-inset-bottom))] z-10 md:bottom-[7vh]">
        <div className="flex flex-col items-center px-6 text-center">
          <h1 className="display max-w-4xl text-balance text-4xl md:text-7xl">
            {words.map((w, i) => (
              <span
                key={i}
                className={`-mb-[0.16em] -mt-[0.3em] inline-block overflow-hidden pb-[0.28em] pt-[0.3em] align-bottom ${i < words.length - 1 ? "me-[0.28em]" : ""}`}
              >
                <span
                  className={`inline-block transition-transform duration-[1300ms] ease-[cubic-bezier(.2,.8,.2,1)] ${ready ? "translate-y-0" : "translate-y-[160%]"} ${i === words.length - 1 ? "text-gold-grad" : ""}`}
                  style={{ transitionDelay: `${200 + i * 110}ms` }}
                >
                  {w}
                </span>
              </span>
            ))}
          </h1>
          <div className={fx} style={{ transitionDelay: "700ms" }}>
            <Magnetic strength={0.5} className="mt-6 [@media(max-height:560px)]:mt-3">
              <button
                onClick={() => goTo("inside")}
                data-cursor={t.cursor.enter}
                className="group relative flex h-20 w-20 items-center justify-center rounded-full [@media(max-height:560px)]:h-14 [@media(max-height:560px)]:w-14"
                aria-label={t.entrance.enter}
              >
                <span className="absolute inset-0 animate-ping rounded-full border border-amber/40 [animation-duration:2.4s]" />
                <span className="absolute inset-0 rounded-full border border-amber transition-transform duration-500 group-hover:scale-125" />
                <span className="absolute inset-2 scale-0 rounded-full bg-amber transition-transform duration-500 group-hover:scale-100" />
                <span className="relative text-[0.65rem] font-bold uppercase tracking-[0.3em] text-cream transition-colors group-hover:text-ink">
                  {t.entrance.enter}
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
      <div className="e-flash pointer-events-none absolute inset-0 z-20 bg-amber opacity-0 mix-blend-screen" />
    </section>
  );
}
