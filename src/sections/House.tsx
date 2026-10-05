import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { gsap, useScene, reducedMotion } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { cafe, digits } from "@/data/cafe";
import { menu, category } from "@/data/menu";
import { images } from "@/data/images";
import { Photo } from "@/components/Photo";
import { CLOSE_AT, OPEN_AT } from "@/lib/hours";
import { Chapter } from "@/components/Chapter";

const ICONS: ReactNode[] = [
  <>
    <path d="M2 9a15 15 0 0 1 20 0" />
    <path d="M5 12.5a10 10 0 0 1 14 0" />
    <path d="M8.5 16a5 5 0 0 1 7 0" />
    <circle cx="12" cy="19.5" r="1" />
  </>,
  <>
    <path d="M3 17v-4l2.2-5.2A2 2 0 0 1 7 6.5h10a2 2 0 0 1 1.8 1.3L21 13v4H3z" />
    <path d="M3 13h18" />
    <circle cx="7.5" cy="17.5" r="1.8" />
    <circle cx="16.5" cy="17.5" r="1.8" />
  </>,
  <>
    <path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5z" />
    <path d="M2 21h20" />
    <path d="M17 3v2M16 4h2" />
  </>,
  <>
    <rect x="2.5" y="4.5" width="19" height="12.5" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M10 8.5l4.5 2.25L10 13z" />
  </>,
  <>
    <path d="M13 2L4.5 13.5h6.5L10 22l9-12h-7z" />
  </>,
  <>
    <path d="M5 19c0-8 5.5-14 15-14 0 9.5-6 15-14 15" />
    <path d="M5 19l8-8" />
  </>,
  <>
    <rect x="2" y="5" width="20" height="14" rx="2.5" />
    <path d="M2 10h20" />
    <path d="M6 15h4" />
  </>,
  <>
    <rect x="4" y="4" width="16" height="16" rx="3.5" />
    <circle cx="9" cy="9" r="1" />
    <circle cx="15" cy="9" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="9" cy="15" r="1" />
    <circle cx="15" cy="15" r="1" />
  </>,
];

const hoursOpen = (24 * 60 - OPEN_AT + CLOSE_AT) / 60;

/* Interlude: who we are, in numbers and little things. Not pinned, the page breathes. */
export function House() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  const h = t.house;

  const stats: [number, string, boolean][] = [
    [menu.reduce((n, c) => n + c.items.length, 0), h.stats.menu, true],
    [category("shisha").items.length, h.stats.flavors, true],
    [cafe.billiards.tables, h.stats.tables, false],
    [hoursOpen, h.stats.hours, false],
  ];

  useScene(root, () => {
    const still = reducedMotion();
    gsap.fromTo(
      ".h-word",
      { yPercent: 160, rotate: 4 },
      {
        yPercent: 0,
        rotate: 0,
        stagger: 0.06,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { trigger: ".h-title", start: "top 85%", once: true },
      },
    );
    gsap.fromTo(
      ".h-story",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".h-story", start: "top 85%", once: true },
      },
    );

    gsap.fromTo(
      ".h-photo",
      { clipPath: "inset(48% 0% 48% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: { trigger: ".h-photo", start: "top 90%", end: "top 35%", scrub: 1 },
      },
    );
    if (!still) {
      gsap.fromTo(
        ".h-photo img",
        { scale: 1.35, yPercent: -8 },
        {
          scale: 1.05,
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ".h-photo",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.to(".h-badge-ring", { rotate: 360, duration: 22, repeat: -1, ease: "none" });
    }

    gsap.utils.toArray<HTMLElement>(".h-num").forEach((el) => {
      const target = Number(el.dataset["value"]);
      const counter = { v: 0 };
      el.textContent = digits(0, lang);
      gsap.to(counter, {
        v: target,
        duration: still ? 0 : 2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => void (el.textContent = digits(Math.round(counter.v), lang)),
      });
    });
    gsap.fromTo(
      ".h-stat-line",
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        stagger: 0.12,
        ease: "power3.inOut",
        scrollTrigger: { trigger: ".h-stats", start: "top 85%", once: true },
      },
    );

    gsap.utils.toArray<HTMLElement>(".h-amenity").forEach((card, i) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: "top 90%", once: true },
        delay: (i % 4) * 0.08,
      });
      tl.fromTo(
        card,
        { opacity: 0, y: 40, rotateX: -25 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: "power3.out" },
      ).fromTo(
        card.querySelectorAll("svg > *"),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.1, stagger: 0.12, ease: "power2.inOut" },
        0.15,
      );
    });
  }, [lang]);

  return (
    <section
      ref={root}
      id="house"
      aria-label={h.title}
      className="relative overflow-hidden bg-[linear-gradient(to_bottom,var(--ink),#140e0a_40%,var(--ink))] py-24 md:py-36"
    >
      <div
        className="pointer-events-none absolute -top-40 start-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-amber/10 blur-[120px] rtl:translate-x-1/2"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-[90rem] grid-cols-1 gap-14 px-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-20 md:px-12">
        <div>
          <Chapter id="house" label={h.kicker} />
          <h2 className="h-title display mt-5 text-5xl md:text-8xl md:rtl:text-7xl">
            {h.title.split(" ").map((w, i) => (
              <span
                key={i}
                className="-mb-[0.18em] inline-block overflow-hidden pb-[0.28em] align-bottom"
              >
                <span className="h-word me-[0.22em] inline-block">{w}</span>
              </span>
            ))}
          </h2>
          <p className="h-story mt-8 max-w-xl text-base leading-relaxed text-cream/75 md:text-lg">
            {h.story}
          </p>
          <p className="h-story mt-5 max-w-xl text-base leading-relaxed text-cream/60 md:text-lg">
            {h.story2}
          </p>
          <p className="h-story mt-6 text-2xl text-amber [font-family:var(--f-hand)] md:text-3xl">
            {h.sign}
          </p>
        </div>

        <div className="relative">
          <div className="h-photo relative aspect-[4/5] overflow-hidden rounded-[2rem] md:aspect-[4/5]">
            <Photo
              img={images.indoor}
              alt={t.alt.indoor}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          </div>
          <div
            className="absolute -bottom-10 -start-6 grid h-32 w-32 place-items-center md:-start-12 md:h-40 md:w-40"
            aria-hidden
          >
            <svg viewBox="0 0 100 100" className="h-badge-ring absolute inset-0 h-full w-full">
              <defs>
                <path id="h-badge-path" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
              </defs>
              <text className="fill-cream/80 text-[9.5px] font-semibold uppercase tracking-[0.3em]">
                <textPath href="#h-badge-path">{`${t.brand} · ${t.brandSub} · `}</textPath>
              </text>
            </svg>
            <div className="grid h-14 w-14 place-items-center rounded-full bg-amber text-center text-[0.6rem] font-bold leading-tight text-ink md:h-16 md:w-16">
              EST.
              <br />
              {digits(cafe.established, lang)}
            </div>
          </div>
        </div>
      </div>

      <dl className="h-stats relative mx-auto mt-24 grid max-w-[90rem] grid-cols-2 gap-x-6 gap-y-12 px-6 md:mt-32 md:grid-cols-4 md:px-12">
        {stats.map(([value, label, plus]) => (
          <div key={label} className="flex flex-col">
            <div className="h-stat-line mb-5 h-px origin-left bg-amber/50 rtl:origin-right" />
            <dt className="order-last mt-3 text-xs uppercase tracking-[0.25em] text-cream/55">
              {label}
            </dt>
            <dd className="display text-6xl tabular-nums text-cream md:text-8xl">
              <span className="h-num" data-value={value}>
                {digits(value, lang)}
              </span>
              {plus && <span className="text-amber">+</span>}
            </dd>
          </div>
        ))}
      </dl>

      <div className="relative mx-auto mt-24 max-w-[90rem] px-6 md:mt-32 md:px-12">
        <h3 className="kicker">{h.amenitiesTitle}</h3>
        <ul className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border [perspective:900px] sm:grid-cols-2 lg:grid-cols-4">
          {h.amenities.map((a, i) => (
            <li
              key={a.title}
              className="h-amenity group relative bg-ink p-7 transition-colors duration-500 hover:bg-[#1a120c] md:p-9"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-10 w-10 text-amber transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110 [&>*]:[stroke-dasharray:1]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                {withPathLength(ICONS[i])}
              </svg>
              <div className="mt-6 text-lg font-semibold text-cream">{a.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-cream/55">{a.text}</p>
              <span className="absolute end-6 top-6 text-[0.65rem] tabular-nums text-cream/25">
                {digits(String(i + 1).padStart(2, "0"), lang)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Normalizes every shape to pathLength=1 so one dash value draws any icon. */
function withPathLength(node: ReactNode) {
  const frag = node as ReactElement<{ children: ReactNode }>;
  return Children.map(frag.props.children, (child) =>
    isValidElement<{ pathLength?: number }>(child) ? cloneElement(child, { pathLength: 1 }) : child,
  );
}
