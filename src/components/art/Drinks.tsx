export type Deco =
  "lime" | "lemon" | "orange" | "mint" | "ice" | "cookie" | "cream" | "berry" | "peach" | "bubble";
export type CitrusKind = "lime" | "lemon" | "orange";

const CITRUS: Record<
  CitrusKind,
  { rind: [string, string]; pith: string; flesh: [string, string] }
> = {
  lime: { rind: ["#6aa632", "#2f6514"], pith: "#eef3cf", flesh: ["#e4f4a0", "#9ccb3e"] },
  lemon: { rind: ["#f5d73a", "#c3920e"], pith: "#fbf6dc", flesh: ["#fff4a6", "#f0cf38"] },
  orange: { rind: ["#f4952e", "#bf530c"], pith: "#fbecd0", flesh: ["#ffd18e", "#ef8a22"] },
};

const r1 = (n: number) => Math.round(n * 10) / 10;
const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return `${r1(50 + r * Math.cos(a))} ${r1(50 + r * Math.sin(a))}`;
};

const SEGMENTS = Array.from({ length: 9 }, (_, k) => {
  const a0 = k * 40 + 2.5;
  const a1 = (k + 1) * 40 - 2.5;
  return `M${polar(6, a0)} L${polar(37, a0)} A37 37 0 0 1 ${polar(37, a1)} L${polar(6, a1)} Z`;
});
const VESICLES = Array.from({ length: 27 }, (_, k) => {
  const seg = Math.floor(k / 3);
  const deg = seg * 40 + 12 + (k % 3) * 8;
  const r = 14 + ((k * 7) % 3) * 7;
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: r1(50 + r * Math.cos(a)), y: r1(50 + r * Math.sin(a)), rot: r1(deg) };
});

const LEAF = (() => {
  const pts: string[] = [];
  const N = 14;
  for (const s of [1, -1]) {
    for (let i = 0; i <= N; i++) {
      const t = s > 0 ? i / N : 1 - i / N;
      const y = 6 + t * 86;
      const w = Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.1)), 0.85) * 36 * (i % 2 ? 1 : 0.86);
      pts.push(`${r1(50 + s * w)} ${r1(y)}`);
    }
  }
  return `M${pts.join(" L")}Z`;
})();

/** Shared gradients for every drink illustration; render once per page. */
export function DrinkDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        {(Object.keys(CITRUS) as CitrusKind[]).map((k) => (
          <g key={k}>
            <radialGradient id={`dk-rind-${k}`} cx="40%" cy="35%" r="70%">
              <stop offset="0" stopColor={CITRUS[k].rind[0]} />
              <stop offset="1" stopColor={CITRUS[k].rind[1]} />
            </radialGradient>
            <radialGradient
              id={`dk-flesh-${k}`}
              gradientUnits="userSpaceOnUse"
              cx="50"
              cy="50"
              r="38"
            >
              <stop offset="0" stopColor={CITRUS[k].flesh[0]} />
              <stop offset="1" stopColor={CITRUS[k].flesh[1]} />
            </radialGradient>
          </g>
        ))}
        <radialGradient id="dk-leaf" cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor="#6fcf6c" />
          <stop offset="0.6" stopColor="#3a9a46" />
          <stop offset="1" stopColor="#1f6a2c" />
        </radialGradient>
        <radialGradient id="dk-berry" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#ff6b6b" />
          <stop offset="0.55" stopColor="#d21f30" />
          <stop offset="1" stopColor="#7a0c16" />
        </radialGradient>
        <radialGradient id="dk-cookie" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#3d2e28" />
          <stop offset="1" stopColor="#110b09" />
        </radialGradient>
        <linearGradient id="dk-peach" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2603a" />
          <stop offset="0.25" stopColor="#f6a65e" />
          <stop offset="1" stopColor="#ffd99a" />
        </linearGradient>
        <linearGradient id="dk-ice-l" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2fbff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#a9d8ef" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="dk-ice-r" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#8cc6e2" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="dk-bubble" cx="50%" cy="50%" r="50%">
          <stop offset="0.7" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="0.93" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.7" />
        </radialGradient>
        <radialGradient id="dk-cream" cx="40%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fffdf6" />
          <stop offset="0.7" stopColor="#f1e5d0" />
          <stop offset="1" stopColor="#cdb592" />
        </radialGradient>
        <radialGradient id="dk-cherry" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#ff7a7a" />
          <stop offset="0.5" stopColor="#c0111f" />
          <stop offset="1" stopColor="#5a0610" />
        </radialGradient>
        {/* glass */}
        <linearGradient id="dk-liq-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.38" />
        </linearGradient>
        <linearGradient id="dk-cyl" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="0.18" stopColor="#000" stopOpacity="0" />
          <stop offset="0.32" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="dk-glass-ice" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#e6f6ff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.5" />
        </linearGradient>
        <clipPath id="dk-inside">
          <path d="M24 40 L37 300 A63 10 0 0 0 163 300 L176 40 Z" />
        </clipPath>
        <filter id="dk-blur1" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <filter id="dk-blur6" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
    </svg>
  );
}

function Citrus({
  kind,
  ...pos
}: {
  kind: CitrusKind;
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
}) {
  const c = CITRUS[kind];
  return (
    <svg
      viewBox="0 0 100 100"
      className={pos.width === undefined ? "h-full w-full overflow-visible" : "overflow-visible"}
      {...pos}
    >
      <circle cx="50" cy="50" r="48" fill={`url(#dk-rind-${kind})`} />
      <circle cx="50" cy="50" r="44.5" fill={c.pith} />
      <circle cx="50" cy="50" r="40" fill={c.pith} stroke="#000" strokeOpacity="0.06" />
      {SEGMENTS.map((d, i) => (
        <path key={i} d={d} fill={`url(#dk-flesh-${kind})`} strokeLinejoin="round" />
      ))}
      {VESICLES.map((v, i) => (
        <ellipse
          key={i}
          cx={v.x}
          cy={v.y}
          rx="1.3"
          ry="4"
          fill="#fff"
          opacity="0.35"
          transform={`rotate(${v.rot} ${v.x} ${v.y})`}
        />
      ))}
      <circle cx="50" cy="50" r="4.5" fill={c.pith} />
      <ellipse
        cx="34"
        cy="28"
        rx="17"
        ry="7"
        fill="#fff"
        opacity="0.28"
        transform="rotate(-38 34 28)"
      />
      <circle cx="50" cy="50" r="48" fill="none" stroke="#000" strokeOpacity="0.18" />
    </svg>
  );
}

export function DecoShape({ type }: { type: Deco }) {
  switch (type) {
    case "lime":
    case "lemon":
    case "orange":
      return <Citrus kind={type} />;
    case "peach":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path d="M8 62 Q 50 -12 92 62 Q 50 42 8 62Z" fill="url(#dk-peach)" />
          <path
            d="M20 56 Q 50 12 80 56 M30 54 Q 50 24 70 54"
            stroke="#fff"
            strokeOpacity="0.25"
            fill="none"
          />
          <path d="M8 62 Q 50 42 92 62" stroke="#a8361c" strokeWidth="3" fill="none" />
          <ellipse
            cx="38"
            cy="30"
            rx="10"
            ry="4"
            fill="#fff"
            opacity="0.3"
            transform="rotate(-30 38 30)"
          />
        </svg>
      );
    case "mint":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path d={LEAF} fill="url(#dk-leaf)" strokeLinejoin="round" />
          <g stroke="#b8ecaa" strokeOpacity="0.7" fill="none" strokeLinecap="round">
            <path d="M50 8 Q 52 50 50 96" strokeWidth="2" />
            {[22, 36, 50, 64].map((y, i) => (
              <g key={y} strokeWidth="1.2">
                <path d={`M50 ${y + 8} Q ${70 - i * 2} ${y + 2} ${80 - i * 4} ${y - 8}`} />
                <path d={`M50 ${y + 8} Q ${30 + i * 2} ${y + 2} ${20 + i * 4} ${y - 8}`} />
              </g>
            ))}
          </g>
          <path d="M50 92 L 50 100" stroke="#2d6b2f" strokeWidth="3" strokeLinecap="round" />
          <ellipse
            cx="38"
            cy="34"
            rx="8"
            ry="16"
            fill="#fff"
            opacity="0.14"
            transform="rotate(20 38 34)"
          />
        </svg>
      );
    case "berry":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path d="M50 96 C 12 72, 8 30, 50 26 C 92 30, 88 72, 50 96Z" fill="url(#dk-berry)" />
          {[
            [36, 40],
            [52, 38],
            [66, 42],
            [30, 54],
            [44, 52],
            [60, 54],
            [72, 56],
            [38, 66],
            [54, 66],
            [66, 68],
            [46, 78],
            [58, 80],
          ].map(([x, y], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y! + 0.8} rx="2.4" ry="3.2" fill="#6e0a14" opacity="0.6" />
              <ellipse cx={x} cy={y} rx="1.3" ry="2.1" fill="#f4d472" />
            </g>
          ))}
          <path
            d="M50 28 L 30 18 L 42 24 L 34 8 L 50 20 L 66 8 L 58 24 L 70 18Z"
            fill="#3a9a46"
            stroke="#1f6a2c"
            strokeLinejoin="round"
          />
          <path d="M50 20 L 52 4" stroke="#2d6b2f" strokeWidth="3" strokeLinecap="round" />
          <ellipse
            cx="34"
            cy="44"
            rx="6"
            ry="12"
            fill="#fff"
            opacity="0.25"
            transform="rotate(25 34 44)"
          />
        </svg>
      );
    case "cookie":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="47" fill="url(#dk-cookie)" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#2c211d"
            strokeWidth="3"
            strokeDasharray="2 3"
          />
          {[37, 23].map((r) => (
            <g key={r} fill="none" strokeWidth="3">
              <circle
                cx="51"
                cy="51"
                r={r}
                stroke="#000"
                strokeOpacity="0.6"
                strokeDasharray="4 5"
              />
              <circle cx="49.5" cy="49.5" r={r} stroke="#4a3933" strokeDasharray="4 5" />
            </g>
          ))}
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse
              key={a}
              cx="50"
              cy="35"
              rx="3"
              ry="6"
              fill="#3e2f29"
              stroke="#000"
              strokeOpacity="0.5"
              transform={`rotate(${a} 50 50)`}
            />
          ))}
          <ellipse
            cx="34"
            cy="28"
            rx="14"
            ry="5"
            fill="#fff"
            opacity="0.08"
            transform="rotate(-35 34 28)"
          />
        </svg>
      );
    case "cream":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path
            d="M10 70 C 2 50, 22 40, 30 44 C 30 22, 54 14, 62 28 C 74 18, 96 32, 88 50 C 100 58, 96 78, 82 80 L 18 80 C 8 80, 6 74, 10 70Z"
            fill="url(#dk-cream)"
          />
          <path
            d="M22 66 C 36 56, 60 60, 76 52 M34 46 C 44 38, 58 40, 66 34"
            stroke="#cdb592"
            strokeOpacity="0.6"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="44" cy="30" rx="8" ry="4" fill="#fff" opacity="0.8" />
        </svg>
      );
    case "bubble":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="46" fill="url(#dk-bubble)" />
          <ellipse
            cx="34"
            cy="30"
            rx="12"
            ry="7"
            fill="#fff"
            opacity="0.8"
            transform="rotate(-35 34 30)"
          />
          <circle cx="70" cy="72" r="4" fill="#fff" opacity="0.5" />
        </svg>
      );
    case "ice":
    default:
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <g stroke="#fff" strokeOpacity="0.55" strokeWidth="3" strokeLinejoin="round">
            <path d="M50 8 L 90 28 L 50 48 L 10 28Z" fill="#fff" fillOpacity="0.5" />
            <path d="M10 28 L 50 48 L 50 92 L 10 72Z" fill="url(#dk-ice-l)" />
            <path d="M50 48 L 90 28 L 90 72 L 50 92Z" fill="url(#dk-ice-r)" />
          </g>
          <ellipse
            cx="50"
            cy="56"
            rx="18"
            ry="14"
            fill="#fff"
            opacity="0.25"
            filter="url(#dk-blur6)"
          />
          <circle cx="36" cy="60" r="2" fill="#fff" opacity="0.7" />
          <circle cx="62" cy="66" r="1.4" fill="#fff" opacity="0.6" />
          <path
            d="M22 30 L 48 16"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>
      );
  }
}

const SURFACE = 92;
const wallX = (y: number) => 20 + (14 * (y - 40)) / 290;

const DROPS = Array.from({ length: 28 }, (_, k) => {
  const y = 112 + ((k * 53) % 190);
  const l = wallX(y) + 8;
  const w = 200 - 2 * l;
  return { x: r1(l + (((k * 37) % 100) / 100) * w), y, r: 1.4 + ((k * 7) % 5) * 0.5 };
});
const BUBBLES = Array.from({ length: 9 }, (_, k) => ({
  x: 50 + ((k * 41) % 100),
  r: 1.2 + (k % 3) * 0.9,
  d: 2.6 + ((k * 13) % 10) / 4,
  dl: -((k * 0.73) % 4),
}));

/**
 * Tapered tumbler with thick walls and base, cylindrical shading, a level-keeping liquid
 * (`.gl-level`, counter-rotated by the scene), refraction at the surface, condensation and a garnish.
 */
export function Glass({
  color,
  cream = false,
  ice = true,
  garnish,
  className = "",
}: {
  color: string;
  cream?: boolean | undefined;
  ice?: boolean;
  garnish?: CitrusKind | undefined;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 -70 200 430"
      className={`overflow-visible ${className}`}
      aria-hidden
      focusable="false"
    >
      {/* shadow + light passing through the drink */}
      <ellipse
        cx="104"
        cy="342"
        rx="92"
        ry="13"
        fill="#000"
        opacity="0.45"
        filter="url(#dk-blur6)"
      />
      <ellipse
        cx="118"
        cy="344"
        rx="70"
        ry="9"
        fill={color}
        opacity="0.55"
        filter="url(#dk-blur6)"
      />

      {/* back of the glass */}
      <path d="M20 40 L34 330 A66 11 0 0 0 166 330 L180 40 Z" fill="#fff" fillOpacity="0.06" />
      <ellipse cx="100" cy="40" rx="80" ry="14" fill="#fff" fillOpacity="0.04" />

      {/* the drink, kept level */}
      <g clipPath="url(#dk-inside)">
        <g className="gl-level">
          <rect x="-80" y={SURFACE} width="360" height="320" fill={color} />
          <rect x="-80" y={SURFACE} width="360" height="220" fill="url(#dk-liq-v)" />
          <g opacity="0.75">
            <line x1="128" y1={SURFACE} x2="104" y2="296" stroke="#f4efe2" strokeWidth="9" />
            <line
              x1="128"
              y1={SURFACE}
              x2="104"
              y2="296"
              stroke="#d43a3a"
              strokeWidth="9"
              strokeDasharray="9 9"
            />
          </g>
          {cream && (
            <g stroke="#3b2318" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8">
              <path d="M30 60 C 34 110, 28 150, 36 200" />
              <path d="M170 60 C 166 100, 172 130, 164 170" />
              <path d="M96 60 C 92 80, 100 96, 96 120" />
            </g>
          )}
          {BUBBLES.map((b, i) => (
            <circle
              key={i}
              className="gl-bub"
              cx={b.x}
              cy="296"
              r={b.r}
              fill="none"
              stroke="#fff"
              strokeOpacity="0.7"
              strokeWidth="0.8"
              style={{ ["--d" as string]: `${b.d}s`, ["--dl" as string]: `${b.dl}s` }}
            />
          ))}
          {ice &&
            [
              [44, 96, 40, -14],
              [96, 102, 44, 10],
              [58, 150, 36, 28],
            ].map(([x, y, s, a], i) => (
              <g key={i} transform={`rotate(${a} ${x! + s! / 2} ${y! + s! / 2})`}>
                <rect
                  x={x}
                  y={y}
                  width={s}
                  height={s! * 0.9}
                  rx="8"
                  fill="url(#dk-glass-ice)"
                  stroke="#fff"
                  strokeOpacity="0.6"
                  strokeWidth="1.2"
                />
                <path
                  d={`M${x! + 6} ${y! + 6} L ${x! + s! - 10} ${y! + 4}`}
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <rect
                  x={x! + s! * 0.3}
                  y={y! + s! * 0.3}
                  width={s! * 0.4}
                  height={s! * 0.3}
                  rx="4"
                  fill="#fff"
                  opacity="0.18"
                />
              </g>
            ))}
          <ellipse cx="100" cy={SURFACE} rx="78" ry="12" fill={color} />
          <ellipse cx="100" cy={SURFACE} rx="78" ry="12" fill="#fff" opacity="0.22" />
          {ice && (
            <g fill="#fff" opacity="0.5">
              <rect
                x="50"
                y={SURFACE - 8}
                width="26"
                height="10"
                rx="4"
                transform={`rotate(-14 63 ${SURFACE})`}
              />
              <rect
                x="104"
                y={SURFACE - 7}
                width="30"
                height="9"
                rx="4"
                transform={`rotate(10 119 ${SURFACE})`}
              />
            </g>
          )}
          <ellipse
            cx="100"
            cy={SURFACE}
            rx="77"
            ry="11.5"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.5"
            strokeWidth="1.4"
          />
        </g>
        <rect x="0" y="40" width="200" height="270" fill="url(#dk-cyl)" />
      </g>

      {/* straw above the surface (refraction offsets the submerged part) */}
      <g strokeLinecap="butt">
        <line x1="140" y1="-60" x2="122" y2={SURFACE} stroke="#f4efe2" strokeWidth="9" />
        <line
          x1="140"
          y1="-60"
          x2="122"
          y2={SURFACE}
          stroke="#d43a3a"
          strokeWidth="9"
          strokeDasharray="9 9"
        />
        <line
          x1="137.5"
          y1="-58"
          x2="119.5"
          y2={SURFACE}
          stroke="#fff"
          strokeOpacity="0.5"
          strokeWidth="2"
        />
        <ellipse
          cx="140"
          cy="-60"
          rx="4.5"
          ry="1.8"
          fill="#9a2a2a"
          transform="rotate(-7 140 -60)"
        />
      </g>

      {/* solid base */}
      <path
        d="M37 300 L34 330 A66 11 0 0 0 166 330 L163 300 A63 10 0 0 1 37 300Z"
        fill="#fff"
        fillOpacity="0.1"
      />
      <ellipse cx="100" cy="300" rx="63" ry="10" fill="none" stroke="#fff" strokeOpacity="0.35" />
      <ellipse
        cx="100"
        cy="318"
        rx="44"
        ry="6"
        fill={color}
        opacity="0.5"
        filter="url(#dk-blur1)"
      />
      <path
        d="M44 330 A62 9 0 0 0 112 340"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="2"
      />

      {/* condensation */}
      <g>
        {DROPS.map((d, i) => (
          <g
            key={i}
            className={i % 9 === 4 ? "gl-drip" : undefined}
            style={{ ["--dl" as string]: `${-i * 0.6}s` }}
          >
            <ellipse
              cx={d.x}
              cy={d.y}
              rx={d.r}
              ry={d.r * 1.25}
              fill="#fff"
              fillOpacity="0.12"
              stroke="#fff"
              strokeOpacity="0.35"
              strokeWidth="0.6"
            />
            <circle
              cx={d.x - d.r * 0.35}
              cy={d.y - d.r * 0.45}
              r={d.r * 0.32}
              fill="#fff"
              opacity="0.9"
            />
          </g>
        ))}
      </g>

      {/* walls + rim */}
      <path
        d="M31 52 L43 318"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="5"
        strokeLinecap="round"
        filter="url(#dk-blur1)"
      />
      <path
        d="M40 54 L50 316"
        stroke="#fff"
        strokeOpacity="0.22"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M171 52 L159 318"
        stroke="#fff"
        strokeOpacity="0.3"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#dk-blur1)"
      />
      <path
        d="M20 40 L34 330 A66 11 0 0 0 166 330 L180 40"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.3"
        strokeWidth="1.2"
      />
      <ellipse
        cx="100"
        cy="40"
        rx="80"
        ry="14"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.75"
        strokeWidth="2.5"
      />
      <ellipse cx="100" cy="40" rx="75" ry="11.5" fill="none" stroke="#fff" strokeOpacity="0.22" />

      {cream && (
        <g>
          <path
            d="M16 46 C 4 22, 34 6, 48 14 C 52 -12, 88 -20, 100 -8 C 114 -34, 154 -20, 150 4 C 176 0, 196 24, 184 46 C 150 56, 50 56, 16 46Z"
            fill="url(#dk-cream)"
          />
          <path
            d="M30 38 C 60 26, 110 34, 168 26 M56 14 C 74 4, 110 8, 132 0"
            stroke="#cdb592"
            strokeOpacity="0.55"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="74" cy="0" rx="12" ry="5" fill="#fff" opacity="0.85" />
          <path
            d="M112 -34 C 116 -50, 126 -58, 136 -62"
            stroke="#4a2a16"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="112" cy="-26" r="13" fill="url(#dk-cherry)" />
          <ellipse cx="107" cy="-31" rx="4" ry="2.5" fill="#fff" opacity="0.7" />
        </g>
      )}

      {garnish && (
        <g transform="rotate(-8 34 30)">
          <Citrus kind={garnish} x={0} y={-4} width={68} height={68} />
        </g>
      )}
    </svg>
  );
}
