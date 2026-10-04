import type { CSSProperties } from "react";

/** Gold dust drifting through a beam of light. Deterministic, CSS-only. */
export function Dust({ count = 36, className = "" }: { count?: number; className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {Array.from({ length: count }, (_, i) => {
        const size = 1.5 + ((i * 7) % 5) * 0.7;
        const style = {
          left: `${(i * 37 + 11) % 100}%`,
          top: `${(i * 53 + 7) % 100}%`,
          width: size,
          height: size,
          ["--dur" as string]: `${9 + ((i * 13) % 9)}s`,
          ["--delay" as string]: `${-((i * 1.7) % 12)}s`,
          ["--dx" as string]: `${((i * 29) % 60) - 30}px`,
          opacity: 0.3 + ((i * 11) % 7) / 10,
        } as CSSProperties;
        return <span key={i} className={`dust ${i % 3 ? "max-md:hidden" : ""}`} style={style} />;
      })}
    </div>
  );
}
