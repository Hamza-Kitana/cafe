import { useId } from "react";
import { Ball } from "./Billiards";
import { cafe } from "@/data/cafe";

// Top-down illustrations of the things that end up on a Layali table. Light falls from the top-left.

type P = { className?: string };

const r2 = (n: number) => +n.toFixed(2);
const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${r2(cx + r * Math.cos(a))} ${r2(cy + r * Math.sin(a))}`;
};

/** Stacked crescents of a poured rosetta, base to tip. */
const ROSETTA = [
  { y: 63, w: 15, h: 7.5 },
  { y: 56.5, w: 13.8, h: 7 },
  { y: 50.5, w: 12.2, h: 6.4 },
  { y: 45, w: 10.4, h: 5.8 },
  { y: 40.2, w: 8.4, h: 5.2 },
  { y: 36, w: 6.4, h: 4.6 },
].map(
  ({ y, w, h }) =>
    `M${50 - w} ${y} Q50 ${y + 2 * h} ${50 + w} ${y} Q50 ${r2(y + h * 0.95)} ${50 - w} ${y}Z`,
);

const LIME_SEGMENTS = Array.from({ length: 9 }, (_, i) => {
  const a0 = i * 40 + 4;
  const a1 = (i + 1) * 40 - 4;
  return `M${polar(0, 0, 2, a0)} L${polar(0, 0, 9.6, a0)} A9.6 9.6 0 0 1 ${polar(0, 0, 9.6, a1)} L${polar(0, 0, 2, a1)}Z`;
});

const SPECKLES = Array.from({ length: 26 }, (_, i) => ({
  x: r2(50 + Math.cos(i * 2.39) * (8 + ((i * 11) % 36))),
  y: r2(50 + Math.sin(i * 2.39) * (8 + ((i * 11) % 36))),
  r: 0.25 + (i % 3) * 0.2,
}));

export function TopCup({ className = "", latte = true }: P & { latte?: boolean }) {
  const id = useId();
  const u = (k: string) => `url(#${id}${k})`;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      <defs>
        <radialGradient id={`${id}saucer`} cx="42%" cy="38%" r="62%">
          <stop offset="0" stopColor="#fdfaf4" />
          <stop offset="0.72" stopColor="#ebe3d6" />
          <stop offset="1" stopColor="#b5a996" />
        </radialGradient>
        <radialGradient id={`${id}well`} cx="60%" cy="64%" r="62%">
          <stop offset="0" stopColor="#f8f4ec" />
          <stop offset="0.8" stopColor="#e2d9ca" />
          <stop offset="1" stopColor="#c5b9a6" />
        </radialGradient>
        <radialGradient id={`${id}cup`} cx="38%" cy="34%" r="68%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.72" stopColor="#efe8dc" />
          <stop offset="1" stopColor="#c8bca9" />
        </radialGradient>
        <linearGradient id={`${id}wall`} x1="0.2" y1="0.1" x2="0.8" y2="0.9">
          <stop offset="0" stopColor="#b3a691" />
          <stop offset="0.5" stopColor="#e4dccd" />
          <stop offset="1" stopColor="#fdfaf5" />
        </linearGradient>
        <radialGradient id={`${id}coffee`} cx="50%" cy="50%" r="50%">
          {latte ? (
            <>
              <stop offset="0" stopColor="#d8aa7c" />
              <stop offset="0.55" stopColor="#b07a48" />
              <stop offset="0.86" stopColor="#7a4524" />
              <stop offset="1" stopColor="#3b1d0d" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#b07a45" />
              <stop offset="0.45" stopColor="#8a5228" />
              <stop offset="0.82" stopColor="#5a2f14" />
              <stop offset="1" stopColor="#261206" />
            </>
          )}
        </radialGradient>
        <linearGradient id={`${id}handle`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c4b8a5" />
        </linearGradient>
        <linearGradient id={`${id}steel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6f7f8" />
          <stop offset="0.45" stopColor="#a5a9ae" />
          <stop offset="0.55" stopColor="#e8eaec" />
          <stop offset="1" stopColor="#787c81" />
        </linearGradient>
        <filter id={`${id}blur`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id={`${id}soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.35" />
        </filter>
      </defs>

      <circle cx="50" cy="50" r="47" fill={u("saucer")} />
      <circle
        cx="50"
        cy="50"
        r="46.2"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.75"
        strokeWidth="0.7"
      />
      <circle cx="50" cy="50" r="37" fill={u("well")} />
      <circle
        cx="50"
        cy="50"
        r="37"
        fill="none"
        stroke="#9d907c"
        strokeOpacity="0.4"
        strokeWidth="0.6"
      />

      <g transform="translate(1.6 2.2)" opacity="0.3" filter={u("blur")}>
        <ellipse cx="27" cy="74" rx="5.4" ry="3.6" transform="rotate(50 27 74)" />
        <path d="M30 78 L44 92" stroke="#000" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <path d="M30 78 L44 92" stroke={u("steel")} strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="27" cy="74" rx="5.4" ry="3.6" transform="rotate(50 27 74)" fill={u("steel")} />
      <ellipse
        cx="26.4"
        cy="73.2"
        rx="3"
        ry="1.6"
        transform="rotate(50 26.4 73.2)"
        fill="#fff"
        opacity="0.55"
      />

      <circle cx="54" cy="54.5" r="30.5" fill="#000" opacity="0.3" filter={u("blur")} />
      <rect
        x="79"
        y="47.5"
        width="17"
        height="11"
        rx="5.5"
        fill="#000"
        opacity="0.25"
        filter={u("blur")}
      />
      <rect
        x="76"
        y="44.5"
        width="17.5"
        height="11"
        rx="5.5"
        fill={u("handle")}
        stroke="#b9ad9a"
        strokeWidth="0.5"
      />
      <rect x="80.5" y="47.6" width="9" height="4.8" rx="2.4" fill="#ddd3c3" />
      <circle cx="50" cy="50" r="30" fill={u("cup")} />
      <path
        d="M21.7 42.4 A29.3 29.3 0 0 1 57.6 21.7"
        fill="none"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.95"
      />
      <circle cx="50" cy="50" r="27" fill={u("wall")} />
      <circle cx="50" cy="50" r="24.5" fill={u("coffee")} />
      <circle
        cx="50"
        cy="50"
        r="24.5"
        fill="none"
        stroke="#1e0e05"
        strokeOpacity="0.55"
        strokeWidth="0.8"
      />

      {latte ? (
        <g fill="#f5e9d4" filter={u("soft")}>
          {ROSETTA.map((d) => (
            <path key={d} d={d} />
          ))}
          <path d="M50 34.5 C46.5 31.2 45.6 28.6 47.6 27.6 C49 27 50 28.4 50 29.4 C50 28.4 51 27 52.4 27.6 C54.4 28.6 53.5 31.2 50 34.5 Z" />
          <path d="M49.5 30 L50.5 30 L50.35 72 L49.65 72 Z" />
        </g>
      ) : (
        <g filter={u("blur")} opacity="0.55">
          <circle cx="44" cy="45" r="7" fill="#d29a5e" />
          <circle cx="57" cy="55" r="5" fill="#c58c52" />
          <circle cx="47" cy="59" r="3.5" fill="#d29a5e" />
        </g>
      )}
      {!latte &&
        [0, 40, 75, 130, 200, 250, 300].map((a, i) => (
          <circle
            key={a}
            cx={r2(50 + Math.cos((a * Math.PI) / 180) * 22.6)}
            cy={r2(50 + Math.sin((a * Math.PI) / 180) * 22.6)}
            r={0.6 + (i % 3) * 0.35}
            fill="#e2b885"
            opacity="0.7"
          />
        ))}
      <ellipse
        cx="41"
        cy="38"
        rx="9"
        ry="4"
        transform="rotate(-38 41 38)"
        fill="#fff"
        opacity="0.13"
        filter={u("blur")}
      />
    </svg>
  );
}

function Raspberry({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="4.2" fill="#8f0f22" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle
          key={a}
          cx={r2(Math.cos((a * Math.PI) / 180) * 2.4)}
          cy={r2(Math.sin((a * Math.PI) / 180) * 2.4)}
          r="1.5"
          fill="#c4203a"
        />
      ))}
      <circle r="1.4" fill="#d22c46" />
      <circle cx="-1.6" cy="-1.8" r="0.7" fill="#fff" opacity="0.6" />
    </g>
  );
}

function Leaf({
  x,
  y,
  rot,
  s = 1,
  fill,
}: {
  x: number;
  y: number;
  rot: number;
  s?: number;
  fill: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 -9 C5.5 -5 5.5 4 0 9 C-5.5 4 -5.5 -5 0 -9 Z" fill={fill} />
      <path
        d="M0 -8 L0 8 M0 -3 L3 -5.5 M0 -3 L-3 -5.5 M0 1.5 L3.4 -0.8 M0 1.5 L-3.4 -0.8 M0 5.5 L2.6 3.8 M0 5.5 L-2.6 3.8"
        stroke="#bfe6a2"
        strokeOpacity="0.55"
        strokeWidth="0.45"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function LeafGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#74c656" />
      <stop offset="1" stopColor="#25621f" />
    </linearGradient>
  );
}

export function TopDessert({ className = "" }: P) {
  const id = useId();
  const u = (k: string) => `url(#${id}${k})`;
  const slice = "M30 70 L45.7 26.8 A46 46 0 0 1 73.2 54.3 Z";
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      <defs>
        <radialGradient id={`${id}plate`} cx="40%" cy="36%" r="64%">
          <stop offset="0" stopColor="#4a4541" />
          <stop offset="0.7" stopColor="#2b2826" />
          <stop offset="1" stopColor="#151312" />
        </radialGradient>
        <radialGradient id={`${id}top`} gradientUnits="userSpaceOnUse" cx="30" cy="70" r="46">
          <stop offset="0" stopColor="#c98a4a" />
          <stop offset="0.45" stopColor="#9a5a26" />
          <stop offset="0.74" stopColor="#5e2f10" />
          <stop offset="0.92" stopColor="#2e1608" />
          <stop offset="1" stopColor="#170a03" />
        </radialGradient>
        <linearGradient id={`${id}cream`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8ead0" />
          <stop offset="1" stopColor="#dcbd84" />
        </linearGradient>
        <linearGradient id={`${id}steel`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7d8186" />
          <stop offset="0.35" stopColor="#f2f3f5" />
          <stop offset="0.6" stopColor="#b2b6bb" />
          <stop offset="1" stopColor="#6d7176" />
        </linearGradient>
        <LeafGradient id={`${id}leaf`} />
        <clipPath id={`${id}clip`}>
          <path d={slice} />
        </clipPath>
        <filter id={`${id}blur`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <filter id={`${id}mottle`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      <circle cx="50" cy="50" r="47" fill={u("plate")} />
      <circle
        cx="50"
        cy="50"
        r="46.3"
        fill="none"
        stroke="#6a635d"
        strokeOpacity="0.6"
        strokeWidth="0.6"
      />
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke="#000"
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
      <path
        d="M18 34 A35 35 0 0 1 40 14.5"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.12"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {SPECKLES.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity="0.07" />
      ))}

      <g transform="translate(3 3.5)" opacity="0.55" filter={u("blur")}>
        <path d={slice} />
      </g>
      <path d="M30 70 L73.2 54.3 L74.2 59.4 L31.2 75.4 Z" fill={u("cream")} />
      <path d="M30.4 72 L73.6 56.4" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.5" />
      <path d={slice} fill={u("top")} />
      <g clipPath={u("clip")} filter={u("mottle")}>
        <ellipse cx="43" cy="49" rx="5" ry="3.5" fill="#1a0b03" opacity="0.55" />
        <ellipse cx="56" cy="43" rx="6" ry="3" fill="#1a0b03" opacity="0.5" />
        <ellipse cx="50" cy="35" rx="4" ry="2.5" fill="#0f0602" opacity="0.6" />
        <ellipse cx="62" cy="52" rx="4" ry="3" fill="#1a0b03" opacity="0.45" />
        <ellipse cx="40" cy="61" rx="4" ry="2.4" fill="#d9a160" opacity="0.4" />
        <ellipse cx="51" cy="56" rx="5" ry="2.6" fill="#e2ad6c" opacity="0.35" />
      </g>
      <path
        d="M36 62 Q46 52 58 49"
        fill="none"
        stroke="#ffd9a0"
        strokeOpacity="0.22"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <Raspberry x={70} y={73} />
      <Raspberry x={78.5} y={66} />
      <Leaf x={64} y={81} rot={70} s={0.7} fill={u("leaf")} />
      {[
        [60, 70],
        [66, 80],
        [83, 74],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1" fill="#8f0f22" opacity="0.8" />
      ))}

      <g transform="rotate(-8 22 52)">
        <g transform="translate(1.6 2.2)" opacity="0.45" filter={u("blur")}>
          <rect x="19.6" y="46" width="4.8" height="38" rx="2.4" />
          <rect x="18" y="21" width="8" height="22" rx="2" />
        </g>
        <rect x="19.6" y="46" width="4.8" height="38" rx="2.4" fill={u("steel")} />
        <path d="M20.6 47 L21.3 39.5 L22.7 39.5 L23.4 47 Z" fill={u("steel")} />
        <rect x="18" y="33" width="8" height="8" rx="2.4" fill={u("steel")} />
        {[18, 20.2, 22.4, 24.6].map((x) => (
          <rect key={x} x={x} y="20.5" width="1.4" height="15" rx="0.7" fill={u("steel")} />
        ))}
        <rect x="20.7" y="50" width="1" height="30" rx="0.5" fill="#fff" opacity="0.6" />
      </g>
    </svg>
  );
}

export function TopGlass({ className = "" }: P) {
  const id = useId();
  const u = (k: string) => `url(#${id}${k})`;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id={`${id}liquid`} cx="46%" cy="44%" r="56%">
          <stop offset="0" stopColor="#e4f6bd" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#9fd36a" stopOpacity="0.85" />
          <stop offset="0.86" stopColor="#4f9a3f" stopOpacity="0.92" />
          <stop offset="1" stopColor="#2a6227" />
        </radialGradient>
        <linearGradient id={`${id}ice`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id={`${id}flesh`} cx="0" cy="0" r="10" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f3fbc4" />
          <stop offset="1" stopColor="#a6d04a" />
        </radialGradient>
        <linearGradient id={`${id}straw`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#111" />
          <stop offset="0.3" stopColor="#5c5c5c" />
          <stop offset="0.55" stopColor="#1b1b1b" />
          <stop offset="1" stopColor="#0a0a0a" />
        </linearGradient>
        <LeafGradient id={`${id}leaf`} />
        <filter id={`${id}blur`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      <circle cx="50" cy="50" r="45" fill="#fff" fillOpacity="0.05" />
      <circle
        cx="50"
        cy="50"
        r="43"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.16"
        strokeWidth="4"
      />
      <circle cx="50" cy="50" r="40.5" fill={u("liquid")} />
      <circle
        cx="50"
        cy="50"
        r="40.5"
        fill="none"
        stroke="#1d4a1b"
        strokeOpacity="0.5"
        strokeWidth="1"
      />

      {[
        [44, 66, 0.9],
        [58, 42, 0.6],
        [36, 44, 0.7],
        [66, 58, 0.5],
        [52, 76, 0.6],
        [28, 60, 0.5],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="#fff" opacity="0.5" />
      ))}

      {[
        "M27 34 L41 30 L45.5 43 L31.5 47.5 Z",
        "M50 51 L64 48.5 L66.5 62 L52.5 65 Z",
        "M35.5 55 L47.5 57.5 L45.5 69.5 L33.5 66.5 Z",
        "M21.5 50 L31 48.5 L32.5 58 L23.5 60 Z",
        "M61 66.5 L71 62.5 L74 71 L64.5 75 Z",
      ].map((d) => (
        <g key={d}>
          <path
            d={d}
            fill={u("ice")}
            stroke="#fff"
            strokeOpacity="0.75"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
          <path
            d={d}
            fill="none"
            stroke="#2a6227"
            strokeOpacity="0.25"
            strokeWidth="1.6"
            transform="translate(0.8 1)"
          />
        </g>
      ))}

      <Leaf x={30} y={64} rot={-30} fill={u("leaf")} />
      <Leaf x={41} y={23} rot={40} s={0.9} fill={u("leaf")} />
      <Leaf x={73} y={48} rot={100} s={0.95} fill={u("leaf")} />
      <Leaf x={23} y={40} rot={-80} s={0.8} fill={u("leaf")} />

      <g transform="translate(63 33)">
        <circle r="12.5" cx="0.8" cy="1.2" fill="#000" opacity="0.25" filter={u("blur")} />
        <circle r="12.4" fill="#4f8a1e" />
        <circle r="11.4" fill="#e9f0c4" />
        {LIME_SEGMENTS.map((d) => (
          <path key={d} d={d} fill={u("flesh")} />
        ))}
        <circle r="1.6" fill="#eef2cc" />
        <path
          d="M-10.5 -4 A11.3 11.3 0 0 1 -2 -11.2"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.7"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </g>

      <path
        d="M48 53 L55 46"
        stroke="#0c0c0c"
        strokeOpacity="0.45"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <g transform="translate(55 46) rotate(45)">
        <rect x="-1.8" y="-44" width="3.6" height="44" rx="1.8" fill={u("straw")} />
        <rect x="-0.9" y="-42" width="0.7" height="38" rx="0.35" fill="#fff" opacity="0.35" />
        <ellipse cx="0" cy="-44" rx="1.8" ry="0.9" fill="#000" stroke="#444" strokeWidth="0.3" />
      </g>

      <circle cx="50" cy="50" r="45" fill="none" stroke={u("rim")} strokeWidth="1.4" />
      <path
        d="M12.5 38 A39.5 39.5 0 0 1 38 11.8"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.85"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {[110, 150, 330, 20].map((a) => (
        <circle
          key={a}
          cx={r2(50 + Math.cos((a * Math.PI) / 180) * 44)}
          cy={r2(50 + Math.sin((a * Math.PI) / 180) * 44)}
          r="0.9"
          fill="#fff"
          opacity="0.6"
        />
      ))}
    </svg>
  );
}

export function TopShisha({ className = "" }: P) {
  const id = useId();
  const u = (k: string) => `url(#${id}${k})`;
  const hose = "M62 60 C 92 66, 96 90, 70 94 C 40 98, 18 86, 24 70";
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      <defs>
        <radialGradient id={`${id}tray`} cx="38%" cy="32%" r="70%">
          <stop offset="0" stopColor="#fbe7b0" />
          <stop offset="0.35" stopColor="#d6a956" />
          <stop offset="0.75" stopColor="#8e6326" />
          <stop offset="1" stopColor="#4a310e" />
        </radialGradient>
        <radialGradient id={`${id}clay`} cx="40%" cy="36%" r="64%">
          <stop offset="0" stopColor="#c97a4e" />
          <stop offset="0.7" stopColor="#8e4528" />
          <stop offset="1" stopColor="#552815" />
        </radialGradient>
        <radialGradient id={`${id}foil`} cx="38%" cy="34%" r="70%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#d2d5d9" />
          <stop offset="1" stopColor="#8a8e94" />
        </radialGradient>
        <radialGradient id={`${id}coal`}>
          <stop offset="0" stopColor="#fff3b5" />
          <stop offset="0.3" stopColor="#ffb347" />
          <stop offset="0.68" stopColor="#e2551b" />
          <stop offset="1" stopColor="#4a1205" />
        </radialGradient>
        <linearGradient id={`${id}ash`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e2dcd3" />
          <stop offset="1" stopColor="#8f887f" />
        </linearGradient>
        <radialGradient id={`${id}glow`}>
          <stop offset="0" stopColor="#ff7a1a" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}brass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe3a4" />
          <stop offset="0.5" stopColor="#b88a3c" />
          <stop offset="1" stopColor="#5e3f12" />
        </linearGradient>
        <pattern
          id={`${id}holes`}
          width="2.6"
          height="2.6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(20)"
        >
          <circle cx="1.3" cy="1.3" r="0.42" fill="#2a2a2a" />
        </pattern>
        <clipPath id={`${id}foilclip`}>
          <circle cx="50" cy="44" r="16.5" />
        </clipPath>
        <filter id={`${id}blur`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
      </defs>

      <path
        d={hose}
        fill="none"
        stroke="#000"
        strokeOpacity="0.5"
        strokeWidth="7"
        strokeLinecap="round"
        transform="translate(1.5 2.5)"
        filter={u("blur")}
      />
      <path d={hose} fill="none" stroke="#1a1310" strokeWidth="6" strokeLinecap="round" />
      <path
        d={hose}
        fill="none"
        stroke="#4d3d32"
        strokeWidth="6"
        strokeDasharray="1.1 1.5"
        opacity="0.75"
      />
      <path
        d={hose}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.14"
        strokeWidth="1.2"
        transform="translate(-0.9 -1.1)"
      />
      <g transform="translate(24 70) rotate(-75)">
        <rect x="-2.6" y="-1" width="5.2" height="11" rx="2" fill={u("brass")} />
        <rect x="-1.6" y="9" width="3.2" height="5" rx="1.4" fill={u("brass")} />
      </g>

      <circle cx="50" cy="44" r="35" fill={u("tray")} />
      <circle cx="50" cy="44" r="35" fill="none" stroke="#3a260b" strokeWidth="0.8" />
      <circle
        cx="50"
        cy="44"
        r="31"
        fill="none"
        stroke="#5a3d17"
        strokeOpacity="0.55"
        strokeWidth="0.6"
      />
      <circle
        cx="50"
        cy="44"
        r="28"
        fill="none"
        stroke="#6e4c1c"
        strokeWidth="0.9"
        strokeDasharray="1.6 2.4"
      />
      <circle
        cx="50"
        cy="44"
        r="24.5"
        fill="none"
        stroke="#5a3d17"
        strokeOpacity="0.5"
        strokeWidth="0.6"
      />
      <path
        d="M20 30 A32.5 32.5 0 0 1 44 12"
        fill="none"
        stroke="#fff6d8"
        strokeOpacity="0.75"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      <circle cx="52" cy="47" r="20" fill="#000" opacity="0.45" filter={u("blur")} />
      <circle cx="50" cy="44" r="19.2" fill={u("clay")} />
      <circle
        cx="50"
        cy="44"
        r="17.6"
        fill="none"
        stroke="#3d1a0c"
        strokeOpacity="0.6"
        strokeWidth="0.8"
      />
      <circle cx="50" cy="44" r="16.5" fill={u("foil")} />
      <g clipPath={u("foilclip")}>
        <path
          d="M34 38 L46 34 L44 44 Z M52 30 L62 36 L54 40 Z M38 50 L48 47 L46 58 Z M56 48 L66 46 L60 56 Z"
          fill="#fff"
          opacity="0.35"
        />
        <path
          d="M46 34 L52 30 L54 40 L44 44 Z M48 47 L56 48 L60 56 L46 58 Z M62 36 L66 46 L56 48 L54 40 Z"
          fill="#000"
          opacity="0.12"
        />
        <circle cx="50" cy="44" r="16.5" fill={u("holes")} opacity="0.55" />
      </g>

      <g className="hk-coals">
        <circle cx="50" cy="44" r="15" fill={u("glow")} />
        {[
          [44.5, 39, -12],
          [55, 43.5, 18],
          [46, 49.5, 6],
        ].map(([x, y, r]) => (
          <g key={`${x}${y}`} transform={`translate(${x} ${y}) rotate(${r})`}>
            <rect x="-4.4" y="-4.4" width="8.8" height="8.8" rx="1.6" fill={u("coal")} />
            <rect
              x="-2.9"
              y="-2.9"
              width="5.8"
              height="5.8"
              rx="1.1"
              fill={u("ash")}
              opacity="0.6"
            />
            <path
              d="M-3 -0.5 L-0.5 0.6 L1 -1.8 M0.2 3 L1.4 0.8 L3 1.6"
              fill="none"
              stroke="#ff9a3a"
              strokeWidth="0.55"
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

const HEART = "M0 3.2 C-6 -1.2 -4.2 -6.4 0 -3.6 C4.2 -6.4 6 -1.2 0 3.2 Z";

export function TopCards({ className = "" }: P) {
  const id = useId();
  const u = (k: string) => `url(#${id}${k})`;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      <defs>
        <pattern
          id={`${id}back`}
          width="3.2"
          height="3.2"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="3.2" height="3.2" fill="#7a1626" />
          <path d="M0 0 H3.2 M0 0 V3.2" stroke="#d6ad64" strokeOpacity="0.5" strokeWidth="0.35" />
        </pattern>
        <linearGradient id={`${id}paper`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e9e2d4" />
        </linearGradient>
        <radialGradient id={`${id}red`} cx="40%" cy="35%">
          <stop offset="0" stopColor="#e3384f" />
          <stop offset="1" stopColor="#9e0f24" />
        </radialGradient>
        <filter id={`${id}shadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0.8" dy="1.4" stdDeviation="1.1" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>
      {[-24, -8, 8, 24].map((r, i) => (
        <g key={r} transform={`rotate(${r} 50 88)`} filter={u("shadow")}>
          <rect
            x="33"
            y="16"
            width="34"
            height="48"
            rx="3.2"
            fill={u("paper")}
            stroke="#d4cab8"
            strokeWidth="0.4"
          />
          {i === 3 ? (
            <g direction="ltr" fontFamily="Georgia, serif" fontWeight="700" fill="#b3122a">
              <text x="35.6" y="23.6" fontSize="6.4">
                A
              </text>
              <path d={HEART} transform="translate(37.4 27.6) scale(0.42)" />
              <g transform="rotate(180 50 40)">
                <text x="35.6" y="23.6" fontSize="6.4">
                  A
                </text>
                <path d={HEART} transform="translate(37.4 27.6) scale(0.42)" />
              </g>
              <path d={HEART} transform="translate(50 41) scale(1.7)" fill={u("red")} />
            </g>
          ) : (
            <>
              <rect x="35.5" y="18.5" width="29" height="43" rx="2" fill={u("back")} />
              <rect
                x="35.5"
                y="18.5"
                width="29"
                height="43"
                rx="2"
                fill="none"
                stroke="#d6ad64"
                strokeWidth="0.5"
              />
              <circle cx="50" cy="40" r="5.5" fill="#7a1626" stroke="#d6ad64" strokeWidth="0.5" />
              <path d={HEART} transform="translate(50 40.6) scale(0.7)" fill="#d6ad64" />
            </>
          )}
          <rect x="33" y="16" width="34" height="48" rx="3.2" fill="#fff" opacity="0.06" />
        </g>
      ))}
    </svg>
  );
}

export function TopPhone({ className = "" }: P) {
  const id = useId();
  const u = (k: string) => `url(#${id}${k})`;
  return (
    <svg
      viewBox="0 0 60 110"
      className={className}
      aria-hidden
      focusable="false"
      lang="en"
      direction="ltr"
    >
      <defs>
        <linearGradient id={`${id}frame`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6d6f73" />
          <stop offset="0.25" stopColor="#e4e5e7" />
          <stop offset="0.6" stopColor="#7c7e82" />
          <stop offset="1" stopColor="#c9cbce" />
        </linearGradient>
        <linearGradient id={`${id}wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b2414" />
          <stop offset="0.55" stopColor="#1a110b" />
          <stop offset="1" stopColor="#0c0806" />
        </linearGradient>
        <radialGradient id={`${id}warm`} cx="50%" cy="18%" r="60%">
          <stop offset="0" stopColor="#e0a35a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#e0a35a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}glare`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}screen`}>
          <rect x="5" y="4.5" width="50" height="101" rx="7.4" />
        </clipPath>
      </defs>

      <rect x="0.4" y="24" width="2" height="7" rx="1" fill={u("frame")} />
      <rect x="0.4" y="34" width="2" height="10" rx="1" fill={u("frame")} />
      <rect x="57.6" y="30" width="2" height="14" rx="1" fill={u("frame")} />
      <rect x="1.5" y="1.5" width="57" height="107" rx="10" fill={u("frame")} />
      <rect x="3" y="3" width="54" height="104" rx="8.8" fill="#050506" />
      <rect x="5" y="4.5" width="50" height="101" rx="7.4" fill={u("wall")} />
      <rect x="5" y="4.5" width="50" height="101" rx="7.4" fill={u("warm")} />

      <rect x="22" y="8" width="16" height="4.6" rx="2.3" fill="#000" />
      <circle cx="34.6" cy="10.3" r="1" fill="#1b2235" />

      <text
        x="30"
        y="22"
        fontSize="3.4"
        textAnchor="middle"
        fill="#efe7da"
        opacity="0.7"
        fontFamily="Manrope"
        fontWeight="600"
      >
        Friday · Amman
      </text>
      <text
        x="30"
        y="34"
        fontSize="11.5"
        textAnchor="middle"
        fill="#f6efe3"
        fontFamily="Manrope"
        fontWeight="300"
      >
        23:41
      </text>

      <rect
        x="8"
        y="52"
        width="44"
        height="17"
        rx="4"
        fill="#fff"
        fillOpacity="0.13"
        stroke="#fff"
        strokeOpacity="0.1"
        strokeWidth="0.3"
      />
      <g fill="none" stroke="#e0a35a" strokeWidth="1.1" strokeLinecap="round">
        <path d="M11.4 59.2 a5 5 0 0 1 7.2 0" />
        <path d="M12.9 60.8 a2.8 2.8 0 0 1 4.2 0" />
      </g>
      <circle cx="15" cy="62.6" r="0.9" fill="#e0a35a" />
      <text
        x="21"
        y="58.6"
        fontSize="3"
        fill="#efe7da"
        opacity="0.6"
        fontFamily="Manrope"
        fontWeight="600"
      >
        Wi-Fi
      </text>
      <text x="21" y="64.2" fontSize="3.8" fill="#fff" fontFamily="Manrope" fontWeight="700">
        {cafe.wifi}
      </text>

      <circle cx="13" cy="94" r="4" fill="#fff" fillOpacity="0.12" />
      <circle cx="47" cy="94" r="4" fill="#fff" fillOpacity="0.12" />
      <rect x="20" y="101" width="20" height="1.2" rx="0.6" fill="#fff" opacity="0.7" />

      <path d="M5 4.5 H42 L5 66 Z" fill={u("glare")} clipPath={u("screen")} />
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
