import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { CHAPTERS as ORDER, chapterLabel } from "@/data/chapters";

/* Quiet desktop wayfinding: which chapter you're in, and how far through the night. */
export function ChapterIndicator() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState<number>(-1);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // Pinned scenes stretch the page, so read each section's start from ScrollTrigger rather than the DOM.
    const triggers = ORDER.map(([id]) => {
      const el = document.getElementById(id);
      return el ? ScrollTrigger.create({ trigger: el, start: "top 55%" }) : null;
    });
    const update = (s: ScrollTrigger) => {
      ring.current?.setAttribute("stroke-dashoffset", (1 - s.progress).toFixed(4));
      let current = -1;
      triggers.forEach((st, i) => {
        if (st && s.scroll() >= st.start) current = i;
      });
      setActive(current);
    };
    const page = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: update,
      onRefresh: update,
    });
    return () => {
      triggers.forEach((st) => st?.kill());
      page.kill();
    };
  }, []);

  const entry = ORDER[active];
  const [id, n] = entry ?? [null, null];

  return (
    <div
      className={`pointer-events-none fixed bottom-6 start-6 z-40 hidden items-center gap-3 rounded-full border border-cream/10 bg-ink/70 py-2 pe-5 ps-2 shadow-lg backdrop-blur-md transition-[opacity,transform] duration-700 lg:flex ${entry ? "opacity-100" : "translate-y-4 opacity-0"}`}
      aria-hidden
    >
      <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="currentColor"
          className="text-cream/10"
          strokeWidth="2"
        />
        <circle
          ref={ring}
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="var(--amber)"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
        />
      </svg>
      {id && (
        <div key={`${id}-${lang}`} className="chap-in leading-tight">
          <div className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-amber">
            {n ? chapterLabel(n, lang) : `✦ ${t.interlude}`}
          </div>
          <div className="mt-0.5 text-xs text-cream/80">{t.chapters[id]}</div>
        </div>
      )}
    </div>
  );
}
