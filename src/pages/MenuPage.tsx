import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { gsap, useScene, lenisRef, reducedMotion, isTouch } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { useUI } from "@/lib/ui";
import { useReveal } from "@/hooks/use-reveal";
import { menu, type MenuCategory, type MenuItem } from "@/data/menu";
import { cafe, digits, fmtPrice } from "@/data/cafe";
import { images } from "@/data/images";
import { Photo } from "@/components/Photo";
import { FillButton } from "@/components/Magnetic";
import { Marquee } from "@/components/Marquee";

const ALL_ITEMS = menu.flatMap((c) => c.items);
const SIGNATURES = ALL_ITEMS.filter((i) => i.signature);

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
  const [sigOnly, setSigOnly] = useState(false);
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
              (!sigOnly || i.signature) &&
              (!q ||
                [i.name.en, i.name.ar, i.desc.en, i.desc.ar].some((s) =>
                  s.toLowerCase().includes(q),
                )),
          ),
        }))
        .filter((c) => c.items.length),
    [q, sigOnly],
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
        { yPercent: 110 },
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
                <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
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
          <dl className="mp-fade mx-auto mt-10 flex max-w-lg justify-center divide-x divide-cream/15 rtl:divide-x-reverse">
            {(
              [
                [ALL_ITEMS.length, m.stats.items],
                [menu.length, m.stats.categories],
                [SIGNATURES.length, m.stats.signatures],
              ] as const
            ).map(([n, label]) => (
              <div key={label} className="flex flex-col-reverse px-6 md:px-10">
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

        <div className="mp-fade absolute bottom-[calc(2rem+var(--tab))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-cream/50">
          {m.scroll}
          <span className="relative h-12 w-px overflow-hidden bg-cream/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-amber" />
          </span>
        </div>
      </section>

      <div className="border-y border-cream/10 py-4" aria-hidden>
        <Marquee speed={45}>
          {SIGNATURES.map((item) => (
            <span
              key={item.id}
              className="display flex items-center gap-6 whitespace-nowrap px-6 text-3xl md:text-5xl"
            >
              <span className="type-serif-italic">{item.name[lang]}</span>
              <span className="text-lg tabular-nums text-gold md:text-2xl">
                {fmtPrice(item.price, lang)}
              </span>
              <span className="text-amber">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

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
                <span className="ms-1.5 tabular-nums opacity-60">
                  {digits(c.items.length, lang)}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="relative flex flex-1 items-center md:w-64 md:flex-none">
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
            <button
              onClick={() => setSigOnly((v) => !v)}
              aria-pressed={sigOnly}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors ${
                sigOnly
                  ? "border-gold bg-gold text-ink"
                  : "border-cream/10 text-cream/70 hover:border-cream/40"
              }`}
            >
              <span aria-hidden>★</span>
              <span className="hidden sm:inline">{m.signatureOnly}</span>
            </button>
          </div>
        </div>
      </div>

      {cats.length === 0 && (
        <div className="mx-auto max-w-xl px-6 py-40 text-center">
          <div className="display text-6xl text-cream/20" aria-hidden>
            ☕
          </div>
          <p className="display mt-6 text-3xl">{m.empty}</p>
          <button
            onClick={() => {
              setQuery("");
              setSigOnly(false);
            }}
            className="link-underline mt-6 text-sm text-amber"
          >
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
      className="mp-cat relative scroll-mt-40 py-20 md:py-28"
      style={{ ["--accent" as string]: cat.accent } as CSSProperties}
    >
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:px-12">
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
              <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                <span className="mp-word me-[0.2em] inline-block">{w}</span>
              </span>
            ))}
          </h2>
          <p className="mt-4 max-w-sm text-cream/65">{cat.tagline[lang]}</p>
          <div className="mp-img relative mt-8 hidden aspect-[4/5] max-w-sm overflow-hidden rounded-t-full md:block">
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

        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cat.items.map((item) => (
            <ItemCard key={item.id} item={item} accent={cat.accent} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ItemCard({ item, accent }: { item: MenuItem; accent: string }) {
  const { t, lang } = useI18n();
  const other = lang === "en" ? "ar" : "en";
  const dot = item.color ?? accent;
  return (
    <li
      onPointerMove={spotlight}
      className={`reveal group relative overflow-hidden rounded-[1.75rem] border border-cream/10 bg-black/25 p-6 transition-[border-color,translate] duration-500 hover:-translate-y-1 hover:border-[var(--accent)]/60 md:p-7 ${
        item.signature ? "sm:col-span-2" : ""
      }`}
    >
      <span
        className="spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-4">
        <span
          className="relative h-11 w-11 shrink-0 rounded-full shadow-[inset_-4px_-6px_10px_rgb(0_0_0/0.35)] transition-transform duration-700 group-hover:rotate-[200deg] group-hover:scale-110"
          style={{
            background: `radial-gradient(circle at 30% 30%, color-mix(in oklab, ${dot} 60%, white), ${dot} 55%, color-mix(in oklab, ${dot} 60%, black))`,
          }}
          aria-hidden
        >
          <span className="absolute left-2 top-2 h-2 w-3 rotate-[-30deg] rounded-full bg-white/50 blur-[1px]" />
        </span>
        <span className="rounded-full border border-gold/40 px-3 py-1 text-sm font-semibold tabular-nums text-gold transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-ink">
          {fmtPrice(item.price, lang)}
        </span>
      </div>
      <div
        className={
          item.signature ? "relative md:flex md:items-end md:justify-between md:gap-8" : "relative"
        }
      >
        <div>
          <h3
            className={`display mt-6 ${item.signature ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"}`}
          >
            {item.name[lang]}
          </h3>
          <div
            lang={other}
            dir={other === "ar" ? "rtl" : "ltr"}
            className={`mt-1 text-sm text-cream/45 ${other === "ar" ? "font-arabic" : "font-latin italic"}`}
          >
            {item.name[other]}
          </div>
        </div>
        <p
          className={`mt-3 text-sm leading-relaxed text-cream/65 ${item.signature ? "md:max-w-xs" : ""}`}
        >
          {item.desc[lang]}
        </p>
      </div>
      {item.signature && (
        <span className="relative mt-5 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-gold">
          ★ {t.menu.signature}
        </span>
      )}
    </li>
  );
}
