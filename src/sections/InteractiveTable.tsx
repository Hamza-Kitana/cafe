import { useCallback, useRef, useState, type ComponentType } from "react";
import { gsap, useScene } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { useIsTouch } from "@/hooks/use-media";
import { useUI } from "@/lib/ui";
import { category, type CategoryId } from "@/data/menu";
import { cafe, fmtPrice } from "@/data/cafe";
import { Drawer } from "@/components/Drawer";
import { MenuList } from "@/components/MenuList";
import {
  TopBall,
  TopCards,
  TopCup,
  TopDessert,
  TopGlass,
  TopPhone,
  TopShisha,
} from "@/components/art/TableTop";
import { Chapter } from "@/components/Chapter";

type Key = "coffee" | "dessert" | "cold" | "shisha" | "cards" | "ball" | "phone";

const ITEMS: {
  key: Key;
  cat?: CategoryId;
  x: number;
  y: number;
  w: number;
  rot: number;
  from: gsap.TweenVars;
  Art: ComponentType<{ className?: string }>;
}[] = [
  {
    key: "coffee",
    cat: "coffee",
    x: 30,
    y: 31,
    w: 23,
    rot: -14,
    from: { x: "-60vw", y: -40, rotation: -110 },
    Art: TopCup,
  },
  {
    key: "dessert",
    cat: "desserts",
    x: 68,
    y: 27,
    w: 22,
    rot: 8,
    from: { y: "-70vh", scale: 1.5, rotation: 40 },
    Art: TopDessert,
  },
  {
    key: "cold",
    cat: "cold",
    x: 75,
    y: 61,
    w: 19,
    rot: 0,
    from: { x: "60vw", rotation: 70 },
    Art: TopGlass,
  },
  {
    key: "shisha",
    cat: "shisha",
    x: 35,
    y: 69,
    w: 26,
    rot: 20,
    from: { scale: 0.2, rotation: -140, opacity: 0 },
    Art: TopShisha,
  },
  {
    key: "cards",
    x: 52,
    y: 47,
    w: 20,
    rot: -6,
    from: { scale: 0.1, rotation: 560 },
    Art: TopCards,
  },
  { key: "ball", x: 15, y: 50, w: 7, rot: 0, from: { x: "-50vw", rotation: -900 }, Art: TopBall },
  { key: "phone", x: 60, y: 85, w: 9, rot: 18, from: { y: "60vh", rotation: 60 }, Art: TopPhone },
];

/* Top view. The table is the menu. EXPLORATION. */
export function InteractiveTable() {
  const { t, lang } = useI18n();
  const touch = useIsTouch();
  const { setReserveOpen } = useUI();
  const root = useRef<HTMLElement>(null);
  const [preview, setPreview] = useState<Key | null>(null);
  const [open, setOpen] = useState<Key | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useScene(root, () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "+=320%",
        scrub: 1,
        pin: true,
      },
    });
    tl.fromTo(
      ".tb-table",
      { scale: 0.8, rotation: -20, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: "power2.out" },
      0,
    ).fromTo(
      ".tb-title",
      { clipPath: "inset(0 0 100% 0)", yPercent: 30 },
      { clipPath: "inset(0 0 0% 0)", yPercent: 0, duration: 0.8 },
      0.3,
    );
    ITEMS.forEach((it, i) => {
      tl.fromTo(
        `.tb-${it.key}`,
        { opacity: 0, ...it.from },
        { opacity: 1, x: 0, y: 0, scale: 1, rotation: it.rot, duration: 0.9, ease: "power3.out" },
        0.9 + i * 0.7,
      ).fromTo(
        `.tb-${it.key} .tb-shadow`,
        { opacity: 0, scale: 1.4 },
        { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" },
        "<",
      );
    });
    tl.fromTo(".tb-hint", { opacity: 0 }, { opacity: 1, duration: 0.6 }).to({}, { duration: 1 });
  });

  const label = (k: Key) => t.table.items[k];

  const Detail = ({ k, compact }: { k: Key; compact: boolean }) => {
    const it = ITEMS.find((i) => i.key === k)!;
    if (it.cat) {
      const c = category(it.cat);
      return <MenuList items={compact ? c.items.slice(0, 3) : c.items} compact />;
    }
    if (k === "cards")
      return (
        <div className="space-y-5 pt-2">
          <p className="text-cream/80">{t.table.games.text}</p>
          <ul className="flex flex-wrap gap-2">
            {t.table.games.list.map((g) => (
              <li key={g} className="rounded-full border border-border px-3 py-1 text-sm">
                {g}
              </li>
            ))}
          </ul>
        </div>
      );
    if (k === "ball")
      return (
        <div className="space-y-4 pt-2">
          <p className="text-cream/80">{t.table.billiards.text}</p>
          <p className="text-sm uppercase tracking-[0.2em] text-gold">
            {t.billiards.info(cafe.billiards.tables, fmtPrice(cafe.billiards.pricePerHour, lang))}
          </p>
          {!compact && (
            <button
              onClick={() => {
                setOpen(null);
                setReserveOpen(true);
              }}
              className="fill-btn fill-btn--solid mt-4"
            >
              <span className="fill-btn__bg" aria-hidden />
              <span className="relative z-10">{t.end.reserve}</span>
            </button>
          )}
        </div>
      );
    return (
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 pt-2 text-sm">
        <dt className="text-muted-foreground">{t.table.phone.wifi}</dt>
        <dd dir="ltr" className="text-start font-latin text-cream">
          {cafe.wifi}
        </dd>
        <dt className="text-muted-foreground">{t.table.phone.hours}</dt>
        <dd className="text-cream">{cafe.hours[lang]}</dd>
        <dt className="text-muted-foreground">{t.table.phone.phone}</dt>
        <dd dir="ltr" className="text-start text-cream">
          <a className="link-underline" href={cafe.phone.href}>
            {cafe.phone.display}
          </a>
        </dd>
        <dt className="text-muted-foreground">⚡</dt>
        <dd className="text-cream">{t.table.phone.charging}</dd>
      </dl>
    );
  };

  const accent = (k: Key | null) => {
    const cat = k && ITEMS.find((i) => i.key === k)?.cat;
    return cat ? category(cat).accent : "var(--amber)";
  };

  return (
    <section
      ref={root}
      id="table"
      aria-label={t.table.kicker}
      className="relative h-screen overflow-hidden bg-[radial-gradient(circle_at_60%_50%,#2a1c12,#0d0907_70%)]"
    >
      <div className="grid h-full grid-cols-1 grid-rows-[auto_1fr] items-center gap-4 px-6 pb-[calc(1.5rem+var(--tab))] pt-24 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:grid-rows-1 md:gap-10 md:px-12 md:pt-0">
        <div
          className="relative z-10 md:max-w-md"
          style={{ ["--accent" as string]: accent(preview) }}
        >
          <Chapter id="table" label={t.table.kicker} />
          <h2 className="tb-title display mt-3 text-4xl md:mt-4 md:text-7xl">{t.table.title}</h2>
          <p className="tb-hint mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground md:mt-6">
            {touch ? t.table.hintTouch : t.table.hint}
          </p>
          <div className="mt-6 hidden min-h-[16rem] md:block" aria-live="polite">
            {preview && (
              <div key={preview} className="animate-[rise_.5s_cubic-bezier(.2,.7,.2,1)]">
                <div className="flex items-baseline justify-between border-b border-border pb-2">
                  <h3 className="display text-3xl" style={{ color: accent(preview) }}>
                    {label(preview)}
                  </h3>
                  <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                    {t.cursor.open} ↵
                  </span>
                </div>
                <Detail k={preview} compact />
              </div>
            )}
          </div>
        </div>

        <div className="relative flex h-full min-h-0 items-center justify-center">
          <div className="tb-table relative aspect-square h-auto w-[min(88vw,58vh)] md:w-[min(46vw,82vh)]">
            <div className="wood-round absolute inset-0 rounded-full" aria-hidden />
            <div
              className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_35%,rgb(255_210_150/0.18),transparent_60%)]"
              aria-hidden
            />
            {ITEMS.map((it) => (
              <button
                key={it.key}
                className={`tb-${it.key} tb-item absolute -translate-x-1/2 -translate-y-1/2 opacity-0`}
                style={{ left: `${it.x}%`, top: `${it.y}%`, width: `${it.w}%` }}
                onPointerEnter={() => setPreview(it.key)}
                onFocus={() => setPreview(it.key)}
                onClick={() => setOpen(it.key)}
                aria-label={label(it.key)}
                aria-haspopup="dialog"
                data-cursor={t.cursor.explore}
              >
                <span
                  className="tb-shadow absolute inset-[6%] translate-x-[6%] translate-y-[10%] rounded-full bg-black/60 blur-md"
                  aria-hidden
                />
                <span className="tb-lift relative block transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]">
                  <it.Art className="h-auto w-full" />
                </span>
                <span
                  className={`tb-tip pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-cream px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-ink transition-all duration-300 ${preview === it.key ? "opacity-100" : "translate-y-2 opacity-0"}`}
                >
                  {label(it.key)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Drawer
        open={open !== null}
        onClose={close}
        title={open ? label(open) : ""}
        kicker={t.table.kicker}
        accent={accent(open)}
      >
        {open && <Detail k={open} compact={false} />}
      </Drawer>
    </section>
  );
}
