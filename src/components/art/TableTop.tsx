import { useId } from "react";
import { Ball } from "./Billiards";
import { cafe } from "@/data/cafe";

// Top-down illustrations of the things that end up on a Layali table.

type P = { className?: string };

export function TopCup({ className = "", latte = true }: P & { latte?: boolean }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      <defs>
        <radialGradient id={`${id}s`} cx="45%" cy="40%">
          <stop offset="0.7" stopColor="#efe7da" />
          <stop offset="1" stopColor="#bdb2a2" />
        </radialGradient>
        <radialGradient id={`${id}c`} cx="50%" cy="50%">
          <stop offset="0" stopColor={latte ? "#c58a55" : "#3a2114"} />
          <stop offset="0.8" stopColor={latte ? "#8a5530" : "#26140b"} />
          <stop offset="1" stopColor="#3b2213" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#${id}s)`} />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#d9cfbf" strokeWidth="1" />
      <rect x="78" y="44" width="18" height="12" rx="6" fill="#efe7da" stroke="#cfc4b3" />
      <circle cx="50" cy="50" r="30" fill="#f4eee4" />
      <circle cx="50" cy="50" r="26" fill={`url(#${id}c)`} />
      {latte && (
        <g fill="#f1e2c9" opacity="0.9">
          <path d="M50 30 C 44 36, 44 42, 50 46 C 56 42, 56 36, 50 30 Z" />
          <path d="M40 44 C 44 50, 56 50, 60 44 C 58 52, 42 52, 40 44 Z" />
          <path d="M38 52 C 44 60, 56 60, 62 52 C 60 62, 40 62, 38 52 Z" />
          <rect x="49.3" y="44" width="1.4" height="24" rx="0.7" />
        </g>
      )}
    </svg>
  );
}

export function TopDessert({ className = "" }: P) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      <defs>
        <radialGradient id={`${id}p`} cx="45%" cy="40%">
          <stop offset="0.75" stopColor="#1d1a18" />
          <stop offset="1" stopColor="#0d0b0a" />
        </radialGradient>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a1c0c" />
          <stop offset="0.5" stopColor="#7a3d16" />
          <stop offset="1" stopColor="#2a1408" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill={`url(#${id}p)`} stroke="#3a3430" />
      <path d="M30 68 L 50 24 L 72 66 Q 51 76 30 68 Z" fill="#f0dfb8" />
      <path d="M30 68 L 50 24 L 72 66 Q 51 72 30 68 Z" fill={`url(#${id}t)`} opacity="0.92" />
      <circle cx="62" cy="76" r="5" fill="#f6efe2" />
      <path d="M22 30 L 34 78" stroke="#c9c1b4" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M19 24 L 22 34 M22 23 L 24 33 M25 22 L 26 32"
        stroke="#c9c1b4"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TopGlass({ className = "", liquid = "#3f9a5a" }: P & { liquid?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      <defs>
        <radialGradient id={`${id}l`} cx="50%" cy="50%">
          <stop offset="0" stopColor={liquid} stopOpacity="0.55" />
          <stop offset="1" stopColor={liquid} stopOpacity="0.95" />
        </radialGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="37" fill={`url(#${id}l)`} />
      <g fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
        <rect x="30" y="34" width="16" height="16" rx="3" transform="rotate(14 38 42)" />
        <rect x="52" y="50" width="15" height="15" rx="3" transform="rotate(-20 59 57)" />
        <rect x="40" y="56" width="12" height="12" rx="3" transform="rotate(30 46 62)" />
      </g>
      <circle cx="64" cy="34" r="13" fill="#9cc93f" stroke="#e4f2b4" strokeWidth="2" />
      <g stroke="#e4f2b4" strokeWidth="1">
        <path d="M64 21 V47 M51 34 H77 M55 25 L73 43 M73 25 L55 43" />
      </g>
      <path
        d="M30 70 Q 22 62 26 52"
        stroke="#2f7a3a"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="58" cy="44" r="2.5" fill="#d43a3a" />
      <path d="M58 44 L 92 8" stroke="#d43a3a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function TopShisha({ className = "" }: P) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      <defs>
        <radialGradient id={`${id}t`} cx="40%" cy="35%">
          <stop offset="0" stopColor="#f3d9a0" />
          <stop offset="0.6" stopColor="#b4873e" />
          <stop offset="1" stopColor="#5a3d17" />
        </radialGradient>
        <radialGradient id={`${id}c`}>
          <stop offset="0" stopColor="#fff2b0" />
          <stop offset="0.45" stopColor="#ff8a2a" />
          <stop offset="1" stopColor="#4a1205" />
        </radialGradient>
      </defs>
      <path
        d="M62 60 C 92 66, 96 90, 70 94 C 40 98, 18 86, 24 70"
        fill="none"
        stroke="#1c1512"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="44" r="34" fill={`url(#${id}t)`} />
      <circle
        cx="50"
        cy="44"
        r="28"
        fill="none"
        stroke="#7a5622"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <circle cx="50" cy="44" r="17" fill="#8a4a32" />
      <circle cx="50" cy="44" r="14" fill="#d9d4cc" />
      <g className="hk-coals">
        <rect x="41" y="37" width="9" height="6" rx="1.5" fill={`url(#${id}c)`} />
        <rect x="51" y="44" width="9" height="6" rx="1.5" fill={`url(#${id}c)`} />
        <rect x="42" y="46" width="7" height="5" rx="1.5" fill={`url(#${id}c)`} />
      </g>
    </svg>
  );
}

export function TopCards({ className = "" }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      {[-24, -8, 8, 24].map((r, i) => (
        <g key={r} transform={`rotate(${r} 50 86)`}>
          <rect
            x="34"
            y="18"
            width="32"
            height="46"
            rx="3"
            fill={i === 3 ? "#f4efe2" : "#6e1a26"}
            stroke={i === 3 ? "#cfc6b5" : "#c9a057"}
            strokeWidth="1"
          />
          {i === 3 ? (
            <>
              <text x="38" y="28" fontSize="8" fontWeight="700" fill="#a3212b" fontFamily="Manrope">
                A
              </text>
              <text x="50" y="46" fontSize="16" textAnchor="middle" fill="#a3212b">
                ♥
              </text>
            </>
          ) : (
            <rect
              x="37"
              y="21"
              width="26"
              height="40"
              rx="2"
              fill="none"
              stroke="#c9a057"
              strokeWidth="0.6"
              opacity="0.6"
            />
          )}
        </g>
      ))}
    </svg>
  );
}

export function TopPhone({ className = "" }: P) {
  return (
    <svg viewBox="0 0 60 110" className={className} aria-hidden focusable="false">
      <rect
        x="2"
        y="2"
        width="56"
        height="106"
        rx="10"
        fill="#0d0d0f"
        stroke="#3a3a40"
        strokeWidth="1.5"
      />
      <rect x="6" y="8" width="48" height="94" rx="6" fill="#16131a" />
      <rect x="22" y="10" width="16" height="4" rx="2" fill="#000" />
      <g fill="none" stroke="#e0a35a" strokeWidth="2.4" strokeLinecap="round">
        <path d="M18 46 a17 17 0 0 1 24 0" />
        <path d="M22 51 a11 11 0 0 1 16 0" />
      </g>
      <circle cx="30" cy="56" r="2.4" fill="#e0a35a" />
      <text
        x="30"
        y="72"
        fontSize="5.6"
        textAnchor="middle"
        fill="#efe7da"
        fontFamily="Manrope"
        fontWeight="600"
      >
        {cafe.wifi}
      </text>
      <text
        x="30"
        y="30"
        fontSize="9"
        textAnchor="middle"
        fill="#efe7da"
        fontFamily="Manrope"
        fontWeight="300"
      >
        23:41
      </text>
    </svg>
  );
}

export function Ashtray({ className = "" }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      <circle cx="50" cy="50" r="44" fill="#2c2a2c" stroke="#4a474a" strokeWidth="3" />
      <circle cx="50" cy="50" r="32" fill="#1a191a" />
      {[0, 120, 240].map((a) => (
        <rect
          key={a}
          x="46"
          y="2"
          width="8"
          height="16"
          rx="4"
          fill="#1a191a"
          transform={`rotate(${a} 50 50)`}
        />
      ))}
      <circle cx="44" cy="54" r="6" fill="#5a5552" opacity="0.6" />
    </svg>
  );
}

export function SnackBowl({ className = "" }: P) {
  const nuts = Array.from({ length: 16 }, (_, i) => ({
    x: +(50 + Math.cos(i * 2.4) * (8 + (i % 4) * 6)).toFixed(2),
    y: +(50 + Math.sin(i * 2.4) * (8 + (i % 4) * 6)).toFixed(2),
    r: (i * 37) % 180,
  }));
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      <circle cx="50" cy="50" r="44" fill="#e8e0d2" />
      <circle cx="50" cy="50" r="38" fill="#cfc4b2" />
      {nuts.map((n, i) => (
        <ellipse
          key={i}
          cx={n.x}
          cy={n.y}
          rx="6"
          ry="4"
          fill={i % 3 ? "#b98a4e" : "#8fae4a"}
          transform={`rotate(${n.r} ${n.x} ${n.y})`}
        />
      ))}
    </svg>
  );
}

export function TopBall({ className = "", n = 8 }: P & { n?: number }) {
  return <Ball n={n} className={className} />;
}
