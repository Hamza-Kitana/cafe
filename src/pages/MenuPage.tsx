import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { gsap, useScene, lenisRef, reducedMotion, isTouch } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { useUI } from "@/lib/ui";
import { useReveal } from "@/hooks/use-reveal";
import { menu, type MenuCategory, type MenuItem } from "@/data/menu";
import { cafe, digits, fmtPrice } from "@/data/cafe";
import { images } from "@/data/images";
import { Photo } from "@/components/Photo";
import { FillButton } from "@/components/Magnetic";

const ALL_ITEMS = menu.flatMap((c) => c.items);
const SIGNATURES = menu.flatMap((cat) =>
  cat.items.filter((i) => i.signature).map((item) => ({ item, cat })),
);
const pad = (n: number) => String(n).padStart(2, "0");

/** Hero collage: one photo per category, scattered around the title. Units are vw / %. */
const TILES = [
  { l: 5, t: 16, w: 13, r: -8, depth: 0.6 },
  { l: 79, t: 13, w: 15, r: 6, depth: 1 },
  { l: 85, t: 57, w: 11, r: -5, depth: 0.8 },
  { l: 3, t: 60, w: 14, r: 7, depth: 1.2 },
  { l: 23, t: 77, w: 10, r: -3, depth: 0.5 },
  { l: 63, t: 79, w: 11, r: 4, depth: 0.9 },
  { l: 27, t: 6, w: 7, r: -6, depth: 0.7 },
];

const spotlight = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const scrollToEl = (el: HTMLElement | null) => {
  if (!el) return;
  if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -150, duration: 1.4 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150 });
};

export function MenuPage() {
  const { t, lang } = useI18n();
  const { setReserveOpen } = useUI();
  const m = t.menuPage;
  const root = useRef<HTMLElement>(null);
  const pills = useRef<(HTMLButtonElement | null)[]>([]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const q = query.trim().toLowerCase();
  const cats = useMemo(
    () =>
      menu
        .map((c) => ({
          ...c,
          items: c.items.filter(
            (i) =>
              !q ||
              [i.name.en, i.name.ar, i.desc.en, i.desc.ar].some((s) => s.toLowerCase().includes(q)),
          ),
        }))
        .filter((c) => c.items.length),
    [q],
  );
  const layoutKey = cats.map((c) => `${c.id}${c.items.length}`).join();

  useScene(root, () => {
    const still = reducedMotion();
    const intro = gsap.timeline({ delay: 0.15 });
    intro
      .fromTo(
        ".mp-char",
        { yPercent: 120, rotateX: -70, opacity: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          stagger: 0.05,
          duration: still ? 0 : 1.3,
          ease: "expo.out",
        },
      )
      .fromTo(
        ".mp-tile",
        { scale: 0.4, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.07,
          duration: still ? 0 : 1.2,
          ease: "back.out(1.6)",
        },
        0.2,
      )
      .fromTo(
        ".mp-fade",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: still ? 0 : 0.9, ease: "power3.out" },
        0.5,
      );

    gsap.utils.toArray<HTMLElement>(".mp-num").forEach((el) => {
      const target = Number(el.dataset["value"]);
      const counter = { v: 0 };
      intro.to(
        counter,
        {
          v: target,
          duration: still ? 0 : 1.6,
          ease: "power2.out",
          onUpdate: () => void (el.textContent = digits(Math.round(counter.v), lang)),
        },
        0.7,
      );
    });

    if (still) return;
    gsap.utils.toArray<HTMLElement>(".mp-tile").forEach((tile) => {
      const depth = Number(tile.dataset["depth"]);
      gsap.to(tile.querySelector(".mp-tile-in"), {
        yPercent: -60 * depth,
        rotate: depth * 8,
        ease: "none",
        scrollTrigger: { trigger: ".mp-hero", start: "top top", end: "bottom top", scrub: true },
      });
    });
    gsap.to(".mp-title", {
      yPercent: 35,
      scale: 0.9,
      opacity: 0.15,
      ease: "none",
      scrollTrigger: { trigger: ".mp-hero", start: "top top", end: "bottom top", scrub: true },
    });
  }, [lang]);

  useScene(root, () => {
    const page = root.current!;
    const sections = gsap.utils.toArray<HTMLElement>(".mp-cat");
    sections.forEach((section, i) => {
      const cat = cats[i]!;
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (s) => {
            if (!s.isActive) return;
            setActive(i);
            gsap.to(page, { backgroundColor: cat.background, duration: 0.9, overwrite: "auto" });
          },
          onLeaveBack: () => {
            if (i !== 0) return;
            setActive(-1);
            gsap.to(page, { backgroundColor: "#14110e", duration: 0.9, overwrite: "auto" });
          },
        },
      });
      gsap.fromTo(
        section.querySelector(".mp-img"),
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 85%", end: "top 25%", scrub: 0.8 },
        },
      );
      gsap.fromTo(
        section.querySelector(".mp-img img"),
        { scale: 1.4 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        section.querySelectorAll(".mp-word"),
        { yPercent: 160 },
        {
          yPercent: 0,
          stagger: 0.08,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        },
      );
    });
  }, [lang, layoutKey]);

  useReveal(root, [lang, layoutKey]);

  // Pointer parallax on the hero collage.
  useEffect(() => {
    if (isTouch() || reducedMotion()) return;
    const tiles = gsap.utils.toArray<HTMLElement>(".mp-tile");
    const movers = tiles.map((tile) => ({
      depth: Number(tile.dataset["depth"]),
      x: gsap.quickTo(tile, "x", { duration: 0.9, ease: "power3" }),
      y: gsap.quickTo(tile, "y", { duration: 0.9, ease: "power3" }),
    }));
    const onMove = (e: globalThis.PointerEvent) => {
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      movers.forEach((mv) => {
        mv.x(dx * -60 * mv.depth);
        mv.y(dy * -40 * mv.depth);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const pill = pills.current[active];
    if (!pill) return;
    setIndicator({ left: pill.offsetLeft, width: pill.offsetWidth });
    pill.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active, lang, layoutKey]);

  const pick = (id: string) => {
    setQuery("");
    // Wait a frame so a cleared search has re-rendered the row before we scroll to it.
    requestAnimationFrame(() => {
      const row = document.getElementById(`item-${id}`);
      scrollToEl(row);
      if (row && !reducedMotion())
        gsap.fromTo(
          row,
          { boxShadow: "0 0 0 2px var(--gold), 0 0 40px rgb(212 175 106 / 0.45)" },
          {
            boxShadow: "0 0 0 0px var(--gold), 0 0 0px rgb(212 175 106 / 0)",
            duration: 2.2,
            delay: 1,
          },
        );
    });
  };

  const titleParts = lang === "ar" ? m.title.split(" ") : [...m.title];

  return (
    <main
      ref={root}
      id="content"
      className="relative bg-[#14110e] pb-10"
      style={{ ["--accent" as string]: cats[active]?.accent ?? "var(--amber)" } as CSSProperties}
    >
      <section
        className="mp-hero relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden"
        aria-label={m.title}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgb(224_163_90/0.16),transparent_60%)]"
          aria-hidden
        />
        <div className="absolute inset-0" aria-hidden>
          {menu.map((c, i) => {
            const tile = TILES[i]!;
            return (
              <div
                key={c.id}
                data-depth={tile.depth}
                className={`mp-tile absolute ${i > 1 ? "hidden md:block" : ""}`}
                style={{
                  left: `${tile.l}%`,
                  top: `${tile.t}%`,
                  width: `max(${tile.w}vw, 6.5rem)`,
                }}
              >
                <div className="mp-tile-in" style={{ rotate: `${tile.r}deg` }}>
                  <div className="overflow-hidden rounded-2xl border border-cream/10 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)]">
                    <Photo
                      img={images[c.image]}
                      alt=""
                      sizes="15vw"
                      className="aspect-[4/5] w-full object-cover opacity-60"
                      style={{ objectPosition: c.imagePosition }}
                    />
                  </div>
                  <div
                    className="mt-2 text-[0.6rem] font-semibold uppercase tracking-[0.25em]"
                    style={{ color: c.accent }}
                  >
                    {c.title[lang]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 px-6 text-center">
          <div className="mp-fade kicker">{m.kicker}</div>
          <h1
            className="mp-title display mt-4 text-[22vw] leading-[0.85] [perspective:800px] md:text-[14vw] md:rtl:text-[11vw]"
            aria-label={m.title}
          >
            {titleParts.map((ch, i) =>
              ch === " " ? (
                <span key={i} className="inline-block w-[0.25em]" />
              ) : (
                <span
                  key={i}
                  className="-mb-[0.22em] inline-block overflow-hidden pb-[0.28em] align-bottom"
                >
                  <span
                    className={`mp-char inline-block origin-bottom ${lang === "ar" ? "me-[0.2em]" : ""} ${i % 3 === 1 ? "type-serif-italic text-amber" : ""}`}
                    aria-hidden
                  >
                    {ch}
                  </span>
                </span>
              ),
            )}
          </h1>
          <p className="mp-fade mx-auto mt-6 max-w-xl text-cream/70 md:text-lg">{m.sub}</p>
          <dl className="mp-fade mx-auto mt-10 flex max-w-lg justify-center">
            {(
              [
                [ALL_ITEMS.length, m.stats.items],
                [menu.length, m.stats.categories],
                [SIGNATURES.length, m.stats.signatures],
              ] as const
            ).map(([n, label]) => (
              <div
                key={label}
                className="flex flex-col-reverse border-cream/15 px-6 md:px-10 [&+&]:border-s"
              >
                <dt className="mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-cream/50">
                  {label}
                </dt>
                <dd className="display text-4xl tabular-nums text-cream md:text-5xl">
                  <span className="mp-num" data-value={n}>
                    {digits(n, lang)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mp-fade absolute bottom-[calc(2rem+var(--tab))] left-1/2 hidden -translate-x-1/2 md:flex flex-col items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-cream/50">
          {m.scroll}
          <span className="relative h-12 w-px overflow-hidden bg-cream/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-amber" />
          </span>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 md:py-28" aria-labelledby="mp-sig-title">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_at_50%_0%,rgb(212_175_106/0.14),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[90rem] px-6 md:px-12">
          <div className="reveal flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            <span className="h-px w-10 bg-gold/60" aria-hidden />★ {m.sigKicker}
          </div>
          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2
              id="mp-sig-title"
              className="reveal display max-w-2xl text-5xl leading-[1.05] md:text-7xl"
            >
              {m.sigTitle}
            </h2>
            <p className="reveal max-w-sm text-cream/60">{m.sigSub}</p>
          </div>
        </div>
        <ol className="relative mt-12 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:scroll-px-12 md:gap-6 md:px-12">
          {SIGNATURES.map(({ item, cat }, i) => (
            <SignatureCard
              key={item.id}
              item={item}
              cat={cat}
              index={i}
              onPick={() => pick(item.id)}
            />
          ))}
        </ol>
      </section>

      <div className="sticky top-[calc(4.75rem+env(safe-area-inset-top))] z-30 mt-6 px-4 md:top-[5.25rem] md:px-8">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-3 rounded-[1.75rem] border border-cream/10 bg-ink/75 p-2 shadow-2xl backdrop-blur-xl md:flex-row md:items-center">
          <div className="relative flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none]">
            <span
              className="absolute inset-y-0 rounded-full bg-[var(--accent)] transition-[left,width,background-color] duration-500 ease-[cubic-bezier(.7,0,.2,1)]"
              style={{ left: indicator.left, width: indicator.width, opacity: active < 0 ? 0 : 1 }}
              aria-hidden
            />
            {cats.map((c, i) => (
              <button
                key={c.id}
                ref={(el) => void (pills.current[i] = el)}
                onClick={() => scrollToEl(document.getElementById(`cat-${c.id}`))}
                aria-current={i === active ? "true" : undefined}
                className={`relative z-10 shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ${
                  i === active ? "text-ink" : "text-cream/65 hover:text-cream"
                }`}
              >
                {c.title[lang]}
                <span className="ms-2 inline-grid min-w-[1.25rem] place-items-center rounded-full bg-current/15 px-1 py-px text-[0.6rem] tabular-nums">
                  {digits(c.items.length, lang)}
                </span>
              </button>
            ))}
          </div>
          <label className="relative flex items-center md:w-64 md:shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute start-4 h-4 w-4 text-cream/50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <span className="sr-only">{m.search}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={m.search}
              className="w-full rounded-full border border-cream/10 bg-cream/5 py-2.5 pe-4 ps-10 text-sm text-cream outline-none transition-colors placeholder:text-cream/40 focus:border-[var(--accent)]"
            />
          </label>
        </div>
      </div>

      {cats.length === 0 && (
        <div className="mx-auto max-w-xl px-6 py-40 text-center">
          <div className="display text-6xl text-cream/20" aria-hidden>
            ☕
          </div>
          <p className="display mt-6 text-3xl">{m.empty}</p>
          <button onClick={() => setQuery("")} className="link-underline mt-6 text-sm text-amber">
            {m.clear}
          </button>
        </div>
      )}

      {cats.map((c) => (
        <Category key={c.id} cat={c} index={menu.findIndex((x) => x.id === c.id)} />
      ))}

      <section className="relative mx-4 mt-24 overflow-hidden rounded-[2.5rem] border border-cream/10 bg-[radial-gradient(ellipse_at_30%_0%,rgb(224_163_90/0.25),transparent_60%),#120d0a] px-6 py-20 text-center md:mx-8 md:py-28">
        <div className="reveal kicker">{m.ctaKicker}</div>
        <h2 className="reveal display mx-auto mt-5 max-w-3xl text-5xl md:text-8xl">{m.ctaTitle}</h2>
        <p className="reveal mx-auto mt-6 max-w-md text-cream/65">{m.ctaSub}</p>
        <div className="reveal mt-10 flex flex-wrap justify-center gap-3">
          <FillButton variant="solid" onClick={() => setReserveOpen(true)}>
            {m.reserve}
          </FillButton>
          <FillButton href={cafe.whatsapp.href} external>
            {m.ask}
          </FillButton>
        </div>
        <ul className="reveal mx-auto mt-14 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-cream/45">
          {m.notes.map((n) => (
            <li key={n} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-amber" aria-hidden />
              {n}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Category({ cat, index }: { cat: MenuCategory; index: number }) {
  const { t, lang } = useI18n();
  const m = t.menuPage;
  const from = Math.min(...cat.items.map((i) => i.price));
  return (
    <section
      id={`cat-${cat.id}`}
      aria-label={cat.title[lang]}
      className="mp-cat relative scroll-mt-40 py-16 md:py-28"
      style={{ ["--accent" as string]: cat.accent } as CSSProperties}
    >
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:px-12">
        <div className="md:sticky md:top-44 md:self-start">
          <div className="flex items-end justify-between gap-4">
            <span
              className="outline-text font-latin text-8xl font-semibold leading-none md:text-[9rem]"
              aria-hidden
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mb-3 rounded-full border border-[var(--accent)]/40 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--accent)]">
              {m.count(digits(cat.items.length, lang))}
            </span>
          </div>
          <h2
            className={`display mt-4 text-6xl md:text-8xl type-${cat.type}`}
            style={{ color: cat.accent }}
          >
            {cat.title[lang].split(" ").map((w, i) => (
              <span
                key={i}
                className="-mb-[0.18em] inline-block overflow-hidden pb-[0.28em] align-bottom"
              >
                <span className="mp-word me-[0.2em] inline-block">{w}</span>
              </span>
            ))}
          </h2>
          <p className="mt-4 max-w-sm text-cream/65">{cat.tagline[lang]}</p>
          <div className="mp-img relative mt-8 aspect-[16/10] overflow-hidden rounded-[2rem] md:aspect-[4/5] md:max-w-sm md:rounded-b-none md:rounded-t-full">
            <Photo
              img={images[cat.image]}
              alt=""
              sizes="24rem"
              className="h-full w-full object-cover"
              style={{ objectPosition: cat.imagePosition }}
            />
            <div
              className="absolute inset-0 mix-blend-color"
              style={{ backgroundColor: cat.accent, opacity: 0.18 }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <span className="text-xs uppercase tracking-[0.25em] text-cream/70">
                {t.shisha.from}{" "}
                <span className="font-semibold text-cream">{fmtPrice(from, lang)}</span>
              </span>
            </div>
          </div>
        </div>

        <ol className="flex flex-col gap-1">
          {cat.items.map((item) => (
            <ItemRow key={item.id} item={item} accent={cat.accent} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ItemRow({ item, accent }: { item: MenuItem; accent: string }) {
  const { t, lang } = useI18n();
  const other = lang === "en" ? "ar" : "en";
  const dot = item.color ?? accent;
  return (
    <li
      id={`item-${item.id}`}
      className={`reveal group relative scroll-mt-48 rounded-2xl px-4 py-5 transition-colors duration-500 md:px-6 ${
        item.signature
          ? "my-2 border border-gold/35 bg-[linear-gradient(110deg,rgb(212_175_106/0.13),transparent_65%)]"
          : "border-b border-cream/[0.07] hover:bg-cream/[0.04]"
      }`}
    >
      <div className="flex items-baseline gap-3">
        <span
          className="h-2.5 w-2.5 shrink-0 -translate-y-[0.1em] rounded-full transition-transform duration-500 group-hover:scale-150"
          style={{ background: dot, boxShadow: `0 0 12px ${dot}` }}
          aria-hidden
        />
        <h3 className="display min-w-0 text-xl md:text-2xl">{item.name[lang]}</h3>
        <span className="leader" aria-hidden />
        <span className="shrink-0 font-semibold tabular-nums text-gold md:text-lg">
          {fmtPrice(item.price, lang)}
        </span>
      </div>
      <div className="ps-[1.375rem]">
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span
            lang={other}
            dir={other === "ar" ? "rtl" : "ltr"}
            className={`text-xs text-cream/45 ${other === "ar" ? "font-arabic" : "font-latin italic"}`}
          >
            {item.name[other]}
          </span>
          {item.signature && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-ink">
              ★ {t.menu.signature}
            </span>
          )}
        </div>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-cream/60">{item.desc[lang]}</p>
      </div>
    </li>
  );
}

function SignatureCard({
  item,
  cat,
  index,
  onPick,
}: {
  item: MenuItem;
  cat: MenuCategory;
  index: number;
  onPick: () => void;
}) {
  const { lang } = useI18n();
  const other = lang === "en" ? "ar" : "en";
  return (
    <li
      className="reveal w-[80vw] max-w-[22rem] shrink-0 snap-start"
      style={{ ["--accent" as string]: cat.accent } as CSSProperties}
    >
      <button
        type="button"
        onClick={onPick}
        onPointerMove={spotlight}
        className="group relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-[2rem] border border-cream/10 text-start shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] transition-[translate,border-color] duration-500 hover:-translate-y-1.5 hover:border-[var(--accent)]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
      >
        <Photo
          img={images[cat.image]}
          alt=""
          sizes="22rem"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
          style={{ objectPosition: cat.imagePosition }}
        />
        <span
          className="absolute inset-0 mix-blend-color"
          style={{ backgroundColor: cat.accent, opacity: 0.28 }}
          aria-hidden
        />
        <span
          className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10"
          aria-hidden
        />
        <span
          className="spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />

        <span className="relative flex items-center justify-between p-5">
          <span
            dir="ltr"
            className="font-latin text-xs font-semibold tabular-nums tracking-[0.25em] text-cream/70"
          >
            <span className="text-cream">{pad(index + 1)}</span> / {pad(SIGNATURES.length)}
          </span>
          <span
            className="rounded-full border border-cream/15 bg-black/40 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest backdrop-blur"
            style={{ color: cat.accent }}
          >
            {cat.title[lang]}
          </span>
        </span>

        <Seal className="absolute end-4 top-16 h-20 w-20 text-gold drop-shadow-[0_6px_16px_rgb(0_0_0/0.6)] md:h-24 md:w-24" />

        <span className="relative mt-auto block p-6">
          <span className="display block text-4xl leading-tight">{item.name[lang]}</span>
          <span
            lang={other}
            dir={other === "ar" ? "rtl" : "ltr"}
            className={`mt-1 block text-sm text-cream/50 ${other === "ar" ? "font-arabic" : "font-latin italic"}`}
          >
            {item.name[other]}
          </span>
          <span className="mt-3 block text-sm leading-relaxed text-cream/75">
            {item.desc[lang]}
          </span>
          <span className="mt-5 flex items-center justify-between border-t border-cream/15 pt-4">
            <span className="display text-3xl tabular-nums text-[var(--accent)]">
              {fmtPrice(item.price, lang)}
            </span>
            <span
              className="grid h-11 w-11 place-items-center rounded-full border border-cream/25 transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-ink"
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </span>
      </button>
    </li>
  );
}

/** Slowly turning wax-seal stamp with the house name running around its rim. */
function Seal({ className }: { className: string }) {
  const id = `seal-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <path id={id} d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
      </defs>
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="rgb(10 8 6 / 0.55)"
        stroke="currentColor"
        strokeOpacity="0.5"
      />
      <circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <g className="origin-center animate-[spin_18s_linear_infinite] motion-reduce:animate-none">
        {/* Latin only: Arabic shaping breaks apart when stretched along a curve. */}
        <text
          direction="ltr"
          className="font-latin"
          fill="currentColor"
          fontSize="8.5"
          fontWeight="600"
          letterSpacing="1.5"
        >
          <textPath href={`#${id}`} textLength="230" lengthAdjust="spacing">
            LAYALI · SIGNATURE · LAYALI · SIGNATURE ·
          </textPath>
        </text>
      </g>
      <text x="50" y="58" textAnchor="middle" fontSize="22" fill="currentColor">
        ★
      </text>
    </svg>
  );
}
