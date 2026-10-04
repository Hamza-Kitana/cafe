import type { CSSProperties } from "react";

export type Suit = "♠" | "♥" | "♦" | "♣";

/** A two-sided card: the back faces the viewer by default; rotateY(180deg) reveals the face. */
export function PlayingCard({
  rank,
  suit,
  className = "",
  style,
}: {
  rank: string;
  suit: Suit;
  className?: string;
  style?: CSSProperties;
}) {
  const red = suit === "♥" || suit === "♦";
  return (
    <div className={`playing-card ${className}`} style={style} aria-hidden>
      <div className="playing-card__side playing-card__back">
        <div className="absolute inset-[6%] rounded-[6%] border border-gold/60 bg-[repeating-linear-gradient(45deg,transparent_0_6px,rgb(224_163_90/0.18)_6px_7px),repeating-linear-gradient(-45deg,transparent_0_6px,rgb(224_163_90/0.18)_6px_7px)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-[clamp(0.9rem,2.4vw,1.6rem)] italic text-gold">L</span>
        </div>
      </div>
      <div
        className={`playing-card__side playing-card__face ${red ? "text-[#a3212b]" : "text-[#161310]"}`}
      >
        <div className="absolute start-[8%] top-[5%] flex flex-col items-center leading-none">
          <span className="font-latin text-[clamp(0.7rem,1.6vw,1.1rem)] font-bold">{rank}</span>
          <span className="text-[clamp(0.6rem,1.4vw,1rem)]">{suit}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-[clamp(1.8rem,5vw,3.6rem)]">
          {suit}
        </div>
        <div className="absolute bottom-[5%] end-[8%] flex rotate-180 flex-col items-center leading-none">
          <span className="font-latin text-[clamp(0.7rem,1.6vw,1.1rem)] font-bold">{rank}</span>
          <span className="text-[clamp(0.6rem,1.4vw,1rem)]">{suit}</span>
        </div>
      </div>
    </div>
  );
}
