import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { gsap, useScene, reducedMotion } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { useUI } from "@/lib/ui";
import { useReveal } from "@/hooks/use-reveal";
import { cafe, digits } from "@/data/cafe";
import { nightOf, useAmmanTime } from "@/lib/hours";
import { OpenStatus } from "@/components/OpenStatus";
import { FillButton } from "@/components/Magnetic";
import { Faq } from "@/sections/Faq";

const latinDigits = (s: string) => s.replace(/[٠-٩۰-۹]/g, (c) => String(c.charCodeAt(0) & 0xf));

const spotlight = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ICONS: Record<string, ReactNode> = {
  call: (
    <svg {...ICON_PROPS}>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  ),
  whatsapp: (
    <svg {...ICON_PROPS}>
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2.2-1.1-1 .9a4.5 4.5 0 0 1-2.5-2.5l.9-1L10.6 7.5z" />
    </svg>
  ),
  instagram: (
    <svg {...ICON_PROPS}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
    </svg>
  ),
  email: (
    <svg {...ICON_PROPS}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  car: (
    <svg {...ICON_PROPS}>
      <path d="M3 17v-4l2.2-5.2A2 2 0 0 1 7 6.5h10a2 2 0 0 1 1.8 1.3L21 13v4H3z" />
      <circle cx="7.5" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
    </svg>
  ),
  taxi: (
    <svg {...ICON_PROPS}>
      <path d="M9 4h6l1 3M3 17v-4l2.2-5.2A2 2 0 0 1 7 6.5h10a2 2 0 0 1 1.8 1.3L21 13v4H3z" />
      <path d="M7 12h10" />
    </svg>
  ),
  walk: (
    <svg {...ICON_PROPS}>
      <circle cx="13" cy="4" r="1.6" />
      <path d="M10 21l2-6-2.5-2.5L11 8l3 3 3 1M12 15l3 6M9.5 12.5L7 14" />
    </svg>
  ),
};

const ACTION_HREF: Record<string, { href: string; value: string; external?: boolean }> = {
  call: { href: cafe.phone.href, value: cafe.phone.display },
  whatsapp: { href: cafe.whatsapp.href, value: cafe.phone.display, external: true },
  instagram: { href: cafe.instagram.href, value: cafe.instagram.handle, external: true },
  email: { href: cafe.email.href, value: cafe.email.display },
};

/** Timeline runs from noon to 4 AM so the whole night reads as one bar. */
const WINDOW_START = 12 * 60;
const WINDOW = 16 * 60;
const OPEN_FROM = (16 * 60 - WINDOW_START) / WINDOW;
const OPEN_TO = (26 * 60 - WINDOW_START) / WINDOW;
const TICKS = [12, 16, 20, 24, 28];

function AmmanClock() {
  const { lang } = useI18n();
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Amman",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span dir="ltr" className="font-latin tabular-nums">
      {time ? digits(time, lang) : "--:--:--"}
    </span>
  );
}

export function ContactPage() {
  const { t, lang } = useI18n();
  const { setReserveOpen } = useUI();
  const c = t.contactPage;
  const root = useRef<HTMLElement>(null);
  const now = useAmmanTime();
  const tonight = now ? nightOf(now) : -1;
  const nowPos = now ? ((now.minutes - WINDOW_START + 1440) % 1440) / WINDOW : 2;
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", topic: 0, message: "" });
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [sent, setSent] = useState(false);

  useScene(root, () => {
    const still = reducedMotion();
    gsap
      .timeline({ delay: 0.1 })
      .fromTo(
        ".ct-word",
        { yPercent: 115, rotate: 5 },
        { yPercent: 0, rotate: 0, stagger: 0.08, duration: still ? 0 : 1.2, ease: "expo.out" },
      )
      .fromTo(
        ".ct-fade",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.08, duration: still ? 0 : 0.8, ease: "power3.out" },
        0.3,
      )
      .fromTo(
        ".ct-action",
        { opacity: 0, y: 50, rotateX: -30 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.09,
          duration: still ? 0 : 1,
          ease: "power3.out",
        },
        0.35,
      );
    gsap.fromTo(
      ".ct-bar",
      { scaleX: 0 },
      {
        scaleX: 1,
        stagger: 0.07,
        duration: still ? 0 : 1.1,
        ease: "power3.inOut",
        scrollTrigger: { trigger: ".ct-hours", start: "top 75%", once: true },
      },
    );
    if (!still) {
      gsap.to(".ct-blob", {
        xPercent: (i) => (i ? -18 : 22),
        yPercent: (i) => (i ? 14 : -10),
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.fromTo(
        ".ct-map",
        { clipPath: "inset(12% 12% 12% 12% round 2.5rem)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 2.5rem)",
          ease: "none",
          scrollTrigger: { trigger: ".ct-map", start: "top 90%", end: "top 30%", scrub: 0.8 },
        },
      );
    }
  }, [lang]);

  useReveal(root, [lang, sent]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cafe.address[lang]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.open(cafe.maps.href, "_blank", "noopener,noreferrer");
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = c.required;
    if (!form.message.trim()) next.message = c.required;
    setErrors(next);
    if (Object.keys(next).length) return;
    const text = c.text({
      name: form.name.trim(),
      phone: latinDigits(form.phone.trim()),
      topic: c.topics[form.topic]!,
      message: form.message.trim(),
    });
    window.open(
      `${cafe.whatsapp.href}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  };

  const field =
    "w-full rounded-2xl border border-cream/10 bg-cream/[0.04] px-5 py-4 text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-amber";

  return (
    <main ref={root} id="content" className="relative overflow-x-clip bg-[#0d0a08]">
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-32 md:pt-36">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="ct-blob absolute -start-40 top-10 h-[34rem] w-[34rem] rounded-full bg-amber/20 blur-[130px]" />
          <div className="ct-blob absolute -end-32 bottom-0 h-[30rem] w-[30rem] rounded-full bg-burgundy/30 blur-[130px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.03)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-[90rem] grid-cols-1 gap-14 px-6 md:px-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <div>
            <div className="ct-fade kicker">{c.kicker}</div>
            <h1 className="display mt-5 text-[19vw] leading-[0.9] md:text-[10rem] md:rtl:text-[8.5rem]">
              {c.title.split(" ").map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span
                    className={`ct-word me-[0.2em] inline-block ${i === 1 ? "type-serif-italic text-amber" : ""}`}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </h1>
            <p className="ct-fade mt-8 max-w-md text-lg text-cream/70">{c.sub}</p>
            <div className="ct-fade mt-8 flex flex-wrap items-center gap-4">
              <OpenStatus />
              <span className="flex items-center gap-2 text-sm text-cream/60">
                <span className="text-xl text-cream">
                  <AmmanClock />
                </span>
                {c.inAmman}
              </span>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-4 [perspective:1000px] sm:grid-cols-2">
            {c.actions.map((a) => {
              const target = ACTION_HREF[a.key]!;
              return (
                <li key={a.key} className="ct-action">
                  <a
                    href={target.href}
                    {...(target.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onPointerMove={spotlight}
                    data-cursor={t.cursor.go}
                    className="group relative flex h-full min-h-[11rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-cream/10 bg-cream/[0.03] p-6 transition-[border-color,translate] duration-500 hover:-translate-y-1 hover:border-amber/60"
                  >
                    <span
                      className="spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      aria-hidden
                    />
                    <span
                      className="absolute inset-x-0 bottom-0 h-full origin-bottom scale-y-0 bg-amber transition-transform duration-[650ms] ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100"
                      aria-hidden
                    />
                    <span className="relative flex items-start justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-cream/15 text-amber transition-colors duration-500 group-hover:border-ink/20 group-hover:text-ink [&>svg]:h-6 [&>svg]:w-6">
                        {ICONS[a.key]}
                      </span>
                      <span
                        className="text-2xl text-cream/40 transition-[transform,color] duration-500 group-hover:-rotate-45 group-hover:text-ink rtl:-scale-x-100"
                        aria-hidden
                      >
                        →
                      </span>
                    </span>
                    <span className="relative mt-8 block">
                      <span className="block text-xs uppercase tracking-[0.25em] text-cream/50 transition-colors duration-500 group-hover:text-ink/60">
                        {a.hint}
                      </span>
                      <span className="display mt-2 block text-3xl transition-colors duration-500 group-hover:text-ink">
                        {a.label}
                      </span>
                      <bdi
                        dir="ltr"
                        className="mt-1 block text-sm text-cream/60 transition-colors duration-500 group-hover:text-ink/70"
                      >
                        {target.value}
                      </bdi>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Map */}
      <section className="relative px-4 py-20 md:px-8 md:py-28" aria-label={c.mapTitle}>
        <div className="ct-map relative mx-auto h-[70vh] min-h-[480px] max-w-[96rem] overflow-hidden rounded-[2.5rem] border border-cream/10">
          <iframe
            src={cafe.mapEmbed}
            title={c.mapTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_invert(0.92)_contrast(0.85)_sepia(0.35)_hue-rotate(-10deg)]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(13_10_8/0.85))]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
            aria-hidden
          >
            <span className="absolute left-1/2 top-full h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-amber/30" />
            <span className="relative grid h-14 w-14 place-items-center rounded-full rounded-br-none bg-amber text-lg font-bold text-ink shadow-[0_10px_40px_rgb(224_163_90/0.6)] [rotate:45deg]">
              <span className="[rotate:-45deg]">{t.brand.charAt(0)}</span>
            </span>
          </div>

          <div className="absolute bottom-4 start-4 end-4 max-w-md rounded-[2rem] border border-cream/10 bg-ink/80 p-6 backdrop-blur-xl md:bottom-8 md:start-8 md:end-auto md:p-8">
            <div className="kicker">{c.mapKicker}</div>
            <h2 className="display mt-3 text-3xl md:text-4xl">{c.mapTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/65">{c.landmark}</p>
            <p className="mt-4 text-sm font-semibold text-cream">{cafe.address[lang]}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <FillButton variant="solid" href={cafe.maps.href} external>
                {c.openMaps}
              </FillButton>
              <button
                onClick={copy}
                className="rounded-full border border-cream/20 px-5 py-3 text-xs font-semibold transition-colors hover:border-cream"
                aria-live="polite"
              >
                {copied ? `✓ ${c.copied}` : c.copy}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hours */}
      <section className="ct-hours relative px-6 py-20 md:px-12 md:py-28" aria-label={c.hoursTitle}>
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
          <div>
            <div className="reveal kicker">{c.hoursKicker}</div>
            <h2 className="reveal display mt-5 text-5xl md:text-7xl">{c.hoursTitle}</h2>
            <p className="reveal mt-6 max-w-sm text-cream/60">{c.hoursNote}</p>
            <p className="reveal mt-8 text-2xl text-amber [font-family:var(--f-hand)]">
              {cafe.hours[lang]}
            </p>
          </div>

          <div>
            <ol className="flex flex-col gap-2">
              {t.week.nights.map((n, i) => {
                const isToday = i === tonight;
                return (
                  <li
                    key={n.day}
                    className={`grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-4 rounded-2xl px-4 py-4 transition-colors md:grid-cols-[9rem_minmax(0,1fr)_6rem] ${
                      isToday ? "bg-amber/10 ring-1 ring-amber/40" : ""
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${isToday ? "text-amber" : "text-cream/80"}`}
                    >
                      {n.day}
                      {isToday && (
                        <span className="ms-2 rounded-full bg-amber px-2 py-0.5 text-[0.6rem] uppercase text-ink">
                          {c.today}
                        </span>
                      )}
                    </span>
                    <span className="relative h-2.5 rounded-full bg-cream/[0.06]" dir="ltr">
                      <span
                        className={`ct-bar absolute inset-y-0 origin-left rounded-full ${isToday ? "bg-gradient-to-r from-amber to-gold shadow-[0_0_20px_rgb(224_163_90/0.6)]" : "bg-cream/25"}`}
                        style={{
                          left: `${OPEN_FROM * 100}%`,
                          width: `${(OPEN_TO - OPEN_FROM) * 100}%`,
                        }}
                      />
                      {isToday && nowPos <= 1 && (
                        <span
                          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-cream shadow-[0_0_0_4px_rgb(245_236_220/0.2)]"
                          style={{ left: `${nowPos * 100}%` }}
                          aria-hidden
                        />
                      )}
                    </span>
                    <span
                      className="hidden text-end text-xs tabular-nums text-cream/50 md:block"
                      dir="ltr"
                    >
                      {digits("16:00 – 02:00", lang)}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div
              className="mt-3 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 px-4 md:grid-cols-[9rem_minmax(0,1fr)_6rem]"
              aria-hidden
            >
              <span />
              <span className="relative h-4 text-[0.6rem] tabular-nums text-cream/40" dir="ltr">
                {TICKS.map((h) => (
                  <span
                    key={h}
                    className="absolute -translate-x-1/2"
                    style={{ left: `${((h * 60 - WINDOW_START) / WINDOW) * 100}%` }}
                  >
                    {digits(`${String(h % 24).padStart(2, "0")}:00`, lang)}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Message */}
      <section className="relative px-4 py-20 md:px-8 md:py-28" aria-label={c.formTitle}>
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 overflow-hidden rounded-[2.5rem] border border-cream/10 bg-[radial-gradient(ellipse_at_100%_0%,rgb(224_163_90/0.14),transparent_55%),#120d0a] p-6 md:p-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <div className="reveal kicker">{c.formKicker}</div>
            <h2 className="reveal display mt-5 text-5xl md:text-7xl">{c.formTitle}</h2>
            <p className="reveal mt-6 max-w-sm text-cream/60">{c.formSub}</p>
            <button
              onClick={() => setReserveOpen(true)}
              className="reveal link-underline mt-10 text-sm text-amber"
            >
              {c.reserveInstead} →
            </button>
          </div>

          {sent ? (
            <div className="reveal flex flex-col items-start justify-center gap-6">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-mint/15 text-3xl text-mint">
                ✓
              </span>
              <p className="display text-4xl">{c.sent}</p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", phone: "", topic: 0, message: "" });
                }}
                className="link-underline text-sm text-amber"
              >
                {t.reserve.again}
              </button>
            </div>
          ) : (
            <form
              onSubmit={submit}
              noValidate
              className="reveal grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-widest text-cream/50">
                  {c.name}
                </span>
                <input
                  className={field}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <span className="mt-1 block text-xs text-destructive">{errors.name}</span>
                )}
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-widest text-cream/50">
                  {c.phone}
                </span>
                <input
                  className={field}
                  dir="ltr"
                  type="tel"
                  inputMode="tel"
                  placeholder="+962 7…"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  autoComplete="tel"
                />
              </label>
              <fieldset className="sm:col-span-2">
                <legend className="mb-3 text-xs uppercase tracking-widest text-cream/50">
                  {c.topic}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {c.topics.map((topic, i) => (
                    <label
                      key={topic}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber ${
                        form.topic === i
                          ? "border-amber bg-amber text-ink"
                          : "border-cream/15 hover:border-cream/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="topic"
                        className="sr-only"
                        checked={form.topic === i}
                        onChange={() => setForm({ ...form, topic: i })}
                      />
                      {topic}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs uppercase tracking-widest text-cream/50">
                  {c.message}
                </span>
                <textarea
                  rows={5}
                  className={`${field} resize-none`}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <span className="mt-1 block text-xs text-destructive">{errors.message}</span>
                )}
              </label>
              <button
                type="submit"
                className="fill-btn fill-btn--solid justify-center !py-4 sm:col-span-2"
              >
                <span className="fill-btn__bg" aria-hidden />
                <span className="relative z-10">{c.send}</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Getting here */}
      <section className="px-6 py-20 md:px-12 md:py-24" aria-label={c.gettingKicker}>
        <div className="mx-auto max-w-[90rem]">
          <div className="reveal kicker">{c.gettingKicker}</div>
          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {c.getting.map((g, i) => (
              <li
                key={g.title}
                onPointerMove={spotlight}
                className="reveal group relative overflow-hidden rounded-[2rem] border border-cream/10 p-7 transition-colors duration-500 hover:border-amber/50 md:p-9"
              >
                <span
                  className="spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                />
                <span className="relative flex items-center justify-between">
                  <span className="text-amber [&>svg]:h-9 [&>svg]:w-9">
                    {ICONS[["car", "taxi", "walk"][i]!]}
                  </span>
                  <span className="font-latin text-5xl font-semibold text-cream/[0.07]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <h3 className="display relative mt-8 text-3xl">{g.title}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-cream/60">{g.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Social */}
      <section className="px-6 py-16 md:px-12 md:py-20" aria-label={c.socialKicker}>
        <div className="mx-auto max-w-[90rem]">
          <div className="reveal kicker">{c.socialKicker}</div>
          <ul className="mt-6 border-b border-cream/10">
            {(
              [
                ["Instagram", cafe.instagram.handle, cafe.instagram.href],
                ["TikTok", cafe.tiktok.handle, cafe.tiktok.href],
                ["WhatsApp", cafe.phone.display, cafe.whatsapp.href],
              ] as const
            ).map(([name, handle, href]) => (
              <li key={name} className="reveal border-t border-cream/10">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor={t.cursor.go}
                  className="group relative flex items-center justify-between gap-6 overflow-hidden py-7 md:py-9"
                >
                  <span
                    className="absolute inset-0 origin-bottom scale-y-0 bg-amber transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100"
                    aria-hidden
                  />
                  <span className="display relative font-latin text-5xl transition-[translate,color] duration-500 group-hover:translate-x-6 group-hover:text-ink md:text-8xl rtl:group-hover:-translate-x-6">
                    {name}
                  </span>
                  <span className="relative flex items-center gap-4 pe-2 text-sm text-cream/60 transition-colors duration-500 group-hover:text-ink md:text-base">
                    <bdi dir="ltr">{handle}</bdi>
                    <span
                      className="text-3xl transition-transform duration-500 group-hover:-rotate-45 rtl:-scale-x-100"
                      aria-hidden
                    >
                      →
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq />
    </main>
  );
}
