import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { SectionId } from "@/data/cafe";
import { chapterLabel, chapterNumber } from "@/data/chapters";

type Props = {
  id: SectionId;
  label: string;
  className?: string;
  accent?: string | undefined;
};

/* Section masthead: gold chapter numeral, a drawn rule, and the section's name. */
export function Chapter({ id, label, className = "", accent }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const n = chapterNumber(id);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`chapter ${seen ? "is-in" : ""} ${className}`}
      style={accent ? ({ ["--chap" as string]: accent } as CSSProperties) : undefined}
    >
      <span className="chapter-num" aria-hidden>
        {n ? chapterLabel(n, "en") : "✦"}
      </span>
      <span className="chapter-rule" aria-hidden>
        <i />
      </span>
      <span className="kicker chapter-label">{label.split(" — ").pop()}</span>
    </div>
  );
}
