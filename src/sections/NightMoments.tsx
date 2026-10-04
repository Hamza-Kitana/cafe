import { useRef } from "react";
import { gsap, useScene, isMobile } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { images, type ImageKey } from "@/data/images";
import { Photo } from "@/components/Photo";
import { Chapter } from "@/components/Chapter";

/** Photos floating in depth: x/y in vw/vh from centre, z in px (negative = further away). */
const PHOTOS: {
  img: ImageKey;
  pos: string;
  x: number;
  y: number;
  z: number;
  r: number;
  w: number;
}[] = [
  { img: "coffee", pos: "50% 50%", x: -24, y: -14, z: -300, r: -6, w: 17 },
  { img: "friends", pos: "50% 35%", x: 22, y: 10, z: -700, r: 5, w: 20 },
  { img: "lounge", pos: "65% 50%", x: -30, y: 18, z: -1100, r: 4, w: 19 },
  { img: "billiards", pos: "50% 60%", x: 28, y: -18, z: -1500, r: -8, w: 18 },
  { img: "friends", pos: "20% 70%", x: -14, y: 4, z: -1900, r: 7, w: 16 },
  { img: "drinks", pos: "50% 50%", x: 18, y: 20, z: -2300, r: -4, w: 19 },
  { img: "outdoor", pos: "60% 50%", x: -26, y: -20, z: -2700, r: 3, w: 22 },
  { img: "indoor", pos: "40% 50%", x: 26, y: -2, z: -3100, r: -6, w: 20 },
  { img: "facade", pos: "70% 50%", x: -20, y: 16, z: -3500, r: 5, w: 21 },
  { img: "billiards", pos: "30% 30%", x: 4, y: -6, z: -3950, r: -3, w: 18 },
];
const TRAVEL = 4200;

/* A 3D memory wall you walk into. DREAMY. */
export function NightMoments() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useScene(root, () => {
    const q = gsap.utils.selector(root);
    const cards = q(".nm-photo") as HTMLElement[];
    const mobile = isMobile();
    const cam = { z: 0 };
    const render = () => {
      cards.forEach((el, i) => {
        const p = PHOTOS[i]!;
        const z = p.z + cam.z;
        const fadeIn = gsap.utils.clamp(0, 1, (z + 3400) / 900);
        const fadeOut = gsap.utils.clamp(0, 1, 1 - (z - 150) / 450);
        const o = fadeIn * fadeOut;
        el.style.transform = `translate3d(${p.x * (mobile ? 0.9 : 1)}vw, ${p.y}vh, ${z}px) rotate(${p.r}deg)`;
        el.style.opacity = String(o);
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
      });
    };
    render();
    gsap
      .timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=420%",
          scrub: 1.4,
          pin: true,
        },
      })
      .to(".nm-title", { opacity: 0, scale: 0.7, filter: "blur(12px)", duration: 0.12 }, 0.04)
      .to(cam, { z: TRAVEL, duration: 1, ease: "none", onUpdate: render }, 0)
      .to(".nm-glow", { opacity: 0.25, duration: 0.3 }, 0.7);

    if (mobile) return undefined;
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      gsap.to(q(".nm-world"), {
        rotateY: x * 6,
        rotateX: -y * 5,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    root.current!.addEventListener("pointermove", onMove);
    return () => root.current?.removeEventListener("pointermove", onMove);
  });

  return (
    <section
      ref={root}
      id="moments"
      aria-label={t.moments.title}
      className="relative h-screen overflow-hidden bg-[#08070b]"
    >
      <div className="nm-glow pointer-events-none absolute inset-0" aria-hidden>
        <div className="bokeh left-[12%] top-[20%] h-40 w-40 bg-amber/30" />
        <div
          className="bokeh left-[70%] top-[60%] h-56 w-56 bg-[#7d5cff]/20"
          style={{ animationDelay: "-4s" }}
        />
        <div
          className="bokeh left-[40%] top-[75%] h-32 w-32 bg-[#ff6a5c]/20"
          style={{ animationDelay: "-8s" }}
        />
        <div
          className="bokeh left-[82%] top-[12%] h-24 w-24 bg-gold/25"
          style={{ animationDelay: "-2s" }}
        />
      </div>

      <Chapter
        id="moments"
        label={t.moments.kicker}
        className="absolute start-6 top-24 z-20 md:start-12"
      />
      <div className="nm-title pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="display text-6xl md:text-9xl">{t.moments.title}</h2>
        <p className="mt-6 text-[0.7rem] uppercase tracking-[0.3em] text-cream/50">
          {t.moments.hint}
        </p>
      </div>

      <div className="absolute inset-0 [perspective:900px]">
        <div className="nm-world absolute inset-0 [transform-style:preserve-3d]">
          {PHOTOS.map((p, i) => (
            <figure
              key={i}
              className={`nm-photo polaroid group absolute left-1/2 top-1/2 ${i % 3 === 2 ? "max-md:hidden" : ""}`}
              style={{
                width: `clamp(150px, ${p.w}vw, 340px)`,
                marginLeft: `calc(clamp(150px, ${p.w}vw, 340px) / -2)`,
                marginTop: `calc(clamp(150px, ${p.w}vw, 340px) / -1.6)`,
                opacity: 0,
              }}
              data-cursor={t.cursor.view}
              tabIndex={0}
            >
              <div className="polaroid__inner">
                <div className="aspect-[4/5] overflow-hidden bg-ink">
                  <Photo
                    img={images[p.img]}
                    alt={t.alt[p.img]}
                    sizes="22vw"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-focus:scale-110"
                    style={{ objectPosition: p.pos }}
                  />
                </div>
                <figcaption className="polaroid__caption">{t.moments.captions[i]}</figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(0_0_0/0.7))]"
        aria-hidden
      />
    </section>
  );
}
