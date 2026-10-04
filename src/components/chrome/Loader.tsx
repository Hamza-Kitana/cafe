import { useEffect, useState } from "react";
import { lockScroll } from "@/lib/motion";
import { digits } from "@/data/cafe";
import { useI18n } from "@/i18n";
import { Emblem, Logo } from "@/components/brand/Logo";

const MILESTONES = [0, 25, 50, 75, 100];

/**
 * Short loader that waits for what the first scene actually needs (fonts + facade photo),
 * capped so it never holds the visitor for long.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const { t, lang } = useI18n();
  const [p, setP] = useState(0);
  const [lit, setLit] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    lockScroll(true);
    let locked = true;
    const release = () => {
      if (locked) lockScroll(false);
      locked = false;
    };
    let ready = false;
    const hero = document.querySelector<HTMLImageElement>("#entrance img");
    void Promise.all([document.fonts?.ready, hero?.decode().catch(() => undefined)]).then(
      () => (ready = true),
    );
    const cap = window.setTimeout(() => (ready = true), 3500);
    let v = 0;
    let doneTimer = 0;
    const id = window.setInterval(() => {
      v = Math.min(ready ? 100 : 86, v + 3 + Math.random() * 7);
      setP(Math.round(v));
      if (v >= 100) {
        window.clearInterval(id);
        setLit(true);
        doneTimer = window.setTimeout(() => {
          setGone(true);
          release();
          onDone();
        }, 1100);
      }
    }, 50);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(cap);
      window.clearTimeout(doneTimer);
      release();
    };
  }, [onDone]);

  return (
    <div
      data-intro
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink transition-[opacity,visibility] duration-700 ${gone ? "invisible opacity-0" : ""}`}
      role="status"
      aria-label={`${t.loading} ${p}%`}
    >
      <div className="relative h-32 md:h-40" aria-hidden>
        <Emblem className="h-full w-auto opacity-[0.12] grayscale" />
        <div
          className="absolute inset-0 transition-[clip-path] duration-150 ease-out"
          style={{ clipPath: `inset(${100 - p}% 0 0 0)` }}
        >
          <Emblem
            className={`h-full w-auto transition-[filter] duration-700 ${lit ? "drop-shadow-[0_0_28px_rgb(255_180_80/0.7)]" : ""}`}
          />
        </div>
      </div>

      <div
        className={`mt-6 transition-all duration-700 ${lit ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
      >
        <Logo size="lg" word className="[&>svg]:hidden" />
      </div>

      <div
        className="mt-8 flex items-center gap-4 font-body text-[0.65rem] tabular-nums tracking-[0.2em]"
        aria-hidden
      >
        {MILESTONES.map((m) => (
          <span
            key={m}
            className={`transition-colors duration-300 ${p >= m ? "text-amber" : "text-cream/20"}`}
          >
            {digits(m, lang)}
          </span>
        ))}
      </div>
      <div className="mt-3 text-xs tracking-[0.3em] text-muted-foreground">{t.loading}</div>
    </div>
  );
}
