import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap, useScene, cue, ScrollTrigger } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { useUI } from "@/lib/ui";
import { cafe } from "@/data/cafe";
import { images } from "@/data/images";
import { Photo } from "@/components/Photo";
import { FillButton } from "@/components/Magnetic";
import { OpenStatus } from "@/components/OpenStatus";

/* Inside, looking out. The door opens, we step out and turn around. CINEMATIC. */
export function EndOfNight() {
  const { t, lang } = useI18n();
  const { setReserveOpen } = useUI();
  const root = useRef<HTMLDivElement>(null);
  const e = t.end;

  useScene(root, () => {
    const scene = root.current!.querySelector<HTMLElement>(".en-scene")!;
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: { trigger: scene, start: "top top", end: "+=340%", scrub: 1, pin: true },
    });
    tl.fromTo(".en-closing", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, 0)
      .to(".en-lamps", { opacity: 0.35, duration: 0.8 }, 0.2)
      .to(".en-closing", { opacity: 0, duration: 0.4 }, 1)
      .to(".en-in", { scale: 2.9, duration: 1.8, ease: "power2.in" }, 0.7)
      .to(".en-door-l", { rotateY: 100, duration: 1, ease: "power2.inOut" }, 0.9)
      .to(".en-door-r", { rotateY: -100, duration: 1, ease: "power2.inOut" }, 0.9)
      .fromTo(".en-street", { scale: 1.3 }, { scale: 1, duration: 1.8 }, 0.7)
      .to(".en-in", { opacity: 0, duration: 0.4 }, 2.1);
    cue(tl, "door", 0.95);
    // Turn around: a whip pan from the quiet street back to the façade.
    tl.to(
      ".en-street",
      { xPercent: -35, filter: "blur(18px)", opacity: 0, duration: 0.6, ease: "power3.in" },
      2.6,
    )
      .fromTo(
        ".en-facade",
        { xPercent: 35, filter: "blur(18px) brightness(0.5)", opacity: 0 },
        {
          xPercent: 0,
          filter: "blur(0px) brightness(0.62)",
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        },
        3.05,
      )
      .fromTo(
        ".en-facade img",
        { scale: 1.2 },
        { scale: 1, duration: 1.6, ease: "power1.out" },
        3.05,
      )
      .fromTo(
        ".en-word",
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: "power3.out" },
        3.6,
      )
      .fromTo(
        ".en-sub, .en-actions",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.6 },
        4.2,
      )
      .to({}, { duration: 0.6 });

    ScrollTrigger.create({
      trigger: ".en-info",
      start: "top 80%",
      toggleClass: { targets: ".en-info", className: "is-in" },
      once: true,
    });
  });

  const info: [string, string, string | undefined][] = [
    [e.location, cafe.address[lang], cafe.maps.href],
    [e.hours, cafe.hours[lang], undefined],
    [e.phone, cafe.phone.display, cafe.phone.href],
    [e.instagram, cafe.instagram.handle, cafe.instagram.href],
    [e.whatsapp, cafe.phone.display, cafe.whatsapp.href],
    [e.maps, "Rainbow St. ↗", cafe.maps.href],
  ];

  return (
    <div ref={root} id="end">
      <section
        className="en-scene relative h-screen overflow-hidden bg-[#06070b]"
        aria-label={e.title}
      >
        <div className="absolute inset-0">
          <div className="en-street absolute inset-0" aria-hidden>
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0b1020_0%,#121a2c_45%,#0a0c12_62%,#05060a_100%)]" />
            {[14, 38, 64, 88].map((x, i) => (
              <div key={x} className="absolute" style={{ left: `${x}%`, top: "26%" }}>
                <div className="h-3 w-3 -translate-x-1/2 rounded-full bg-[#ffd9a0] shadow-[0_0_30px_12px_rgb(255_190_110/0.35)]" />
                <div className="mx-auto h-[36vh] w-px -translate-x-1/2 bg-cream/10" />
                <div
                  className="absolute left-0 top-[44vh] h-[30vh] w-6 -translate-x-1/2 bg-gradient-to-b from-[#ffd9a0]/30 to-transparent blur-md"
                  style={{ opacity: 0.7 - i * 0.1 }}
                />
              </div>
            ))}
            <div className="absolute inset-x-0 top-[56%] h-px bg-cream/10" />
          </div>
          <div className="en-facade absolute inset-0 opacity-0">
            <Photo img={images.facade} alt={t.alt.facade} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06070b] via-[#06070b]/40 to-[#0b1020]/50" />
          </div>
        </div>

        <div className="en-in absolute inset-0" aria-hidden>
          <div className="interior-wall absolute inset-0">
            <div className="en-lamps absolute inset-0">
              {[20, 50, 80].map((x) => (
                <div key={x} className="absolute top-0" style={{ left: `${x}%` }}>
                  <div className="mx-auto h-[10vh] w-px bg-cream/30" />
                  <div className="h-6 w-16 -translate-x-1/2 rounded-t-full bg-[#2a1f16] shadow-[0_30px_80px_30px_rgb(255_170_80/0.28)]" />
                </div>
              ))}
              <div className="absolute inset-x-0 bottom-0 h-[22vh] bg-[linear-gradient(to_top,#1a120c,#2a1c12)] shadow-[0_-20px_60px_rgb(255_170_80/0.15)]" />
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 h-[var(--dh)] w-[var(--dw)] -translate-x-1/2 -translate-y-1/2 [perspective:1200px]">
            <div className="absolute -inset-[10px] border-[10px] border-[#1b140f]" />
            <div className="en-door-l glass-in absolute inset-y-0 start-0 w-1/2 origin-left rtl:origin-right">
              <div className="absolute end-3 top-1/2 h-24 w-1.5 -translate-y-1/2 rounded bg-gold/70" />
            </div>
            <div className="en-door-r glass-in absolute inset-y-0 end-0 w-1/2 origin-right rtl:origin-left">
              <div className="absolute start-3 top-1/2 h-24 w-1.5 -translate-y-1/2 rounded bg-gold/70" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-[20%] text-center">
              <div className="display inline-block -scale-x-100 text-5xl text-cream/25 md:text-6xl">
                {e.signBack}
              </div>
            </div>
          </div>
        </div>

        <div className="en-closing absolute inset-x-0 top-[14%] z-10 text-center text-xs uppercase tracking-[0.35em] text-amber opacity-0">
          {e.closing}
        </div>

        <div className="absolute inset-x-0 bottom-[calc(12vh+var(--tab))] z-10 flex flex-col items-center px-6 text-center">
          <h2 className="display text-6xl md:text-9xl">
            {e.title.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span className="en-word me-[0.2em] inline-block opacity-0">{w}</span>
              </span>
            ))}
          </h2>
          <p className="en-sub mt-5 max-w-md text-cream/70 opacity-0">{e.sub}</p>
          <div className="en-actions mt-8 flex flex-wrap justify-center gap-3 opacity-0">
            <FillButton variant="solid" onClick={() => setReserveOpen(true)}>
              {e.reserve}
            </FillButton>
            <FillButton href={cafe.maps.href} external>
              {e.directions}
            </FillButton>
            <FillButton href={cafe.phone.href}>{e.call}</FillButton>
            <FillButton href={cafe.whatsapp.href} external>
              {e.whatsappBtn}
            </FillButton>
          </div>
        </div>
      </section>

      <section
        className="en-info relative bg-[#06070b] px-6 py-20 md:px-12 md:py-28"
        aria-label={e.location}
      >
        <dl className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {info.map(([label, value, href], i) => (
            <div
              key={label}
              className="info-cell border-t border-border py-6 pe-6"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <dt className="text-[0.65rem] uppercase tracking-[0.3em] text-amber">{label}</dt>
              <dd className="mt-3 text-lg text-cream md:text-xl">
                {href ? (
                  <a
                    href={href}
                    className="link-underline"
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <bdi dir={/^[+@\dA-Za-z]/.test(value) ? "ltr" : undefined}>{value}</bdi>
                  </a>
                ) : (
                  value
                )}
                {label === e.hours && (
                  <div className="mt-3">
                    <OpenStatus />
                  </div>
                )}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mx-auto mt-12 flex max-w-6xl justify-center">
          <Link to="/contact" className="fill-btn" data-cursor={t.cursor.go}>
            <span className="fill-btn__bg" aria-hidden />
            <span className="relative z-10">{e.contactCta} →</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
