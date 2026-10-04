import { Fragment } from "react";
import { Marquee } from "./Marquee";

/** A band of oversized words between chapters that drifts and leans with the scroll. */
export function Strip({
  words,
  reverse = false,
  tone = "amber",
}: {
  words: string[];
  reverse?: boolean;
  tone?: "amber" | "cream";
}) {
  return (
    <div className="overflow-x-clip bg-ink py-10 md:py-14" aria-hidden>
      <div
        className={`-rotate-[1.5deg] scale-x-[1.04] border-y py-5 md:py-7 ${
          tone === "amber"
            ? "border-ink bg-amber text-ink"
            : "border-cream/15 bg-[#120d0a] text-cream"
        }`}
      >
        <Marquee speed={60} reverse={reverse}>
          {words.map((w, i) => (
            <Fragment key={i}>
              <span
                className={`display whitespace-nowrap px-6 text-4xl md:px-10 md:text-7xl ${
                  i % 2 ? "type-serif-italic" : ""
                }`}
              >
                {w}
              </span>
              <span className="self-center text-2xl md:text-4xl">✦</span>
            </Fragment>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
