const COLORS = [
  "#f4efe2",
  "#f2c230",
  "#1f4fb5",
  "#c8282d",
  "#5b2a86",
  "#e8742a",
  "#1d7a46",
  "#7a1f24",
  "#151515",
];

/** Shared SVG gradients for every ball on the page. Render once. */
export function BallDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <radialGradient id="ball-shine" cx="34%" cy="28%" r="34%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ball-shade" cx="38%" cy="32%" r="72%">
          <stop offset="45%" stopColor="#000" stopOpacity="0" />
          <stop offset="85%" stopColor="#000" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.75" />
        </radialGradient>
        <radialGradient id="ball-bounce" cx="68%" cy="80%" r="38%">
          <stop offset="0%" stopColor="#9fe6b4" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#9fe6b4" stopOpacity="0" />
        </radialGradient>
        <clipPath id="ball-clip">
          <circle cx="50" cy="50" r="49" />
        </clipPath>
        <filter id="ball-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
    </svg>
  );
}

export function Ball({ n, className = "" }: { n: number; className?: string }) {
  const color = COLORS[n > 8 ? n - 8 : n]!;
  const stripe = n > 8;
  return (
    <svg viewBox="0 0 100 100" lang="en" className={className} aria-hidden focusable="false">
      <circle cx="50" cy="50" r="49" fill={stripe ? color : COLORS[n]} />
      <g clipPath="url(#ball-clip)">
        {stripe && (
          <>
            <path className="bp-cap0" d="" fill={COLORS[0]} />
            <path className="bp-cap1" d="" fill={COLORS[0]} />
          </>
        )}
        <g className="bp-static">
          {stripe && (
            <>
              <rect x="0" y="0" width="100" height="27" fill={COLORS[0]} />
              <rect x="0" y="73" width="100" height="27" fill={COLORS[0]} />
            </>
          )}
          {n > 0 && <circle cx="50" cy="50" r="20" fill={COLORS[0]} />}
        </g>
        {n > 0 && (
          <>
            <path className="bp-disc" d="" fill={COLORS[0]} />
            <text
              className="bp-num"
              transform="translate(50 50)"
              x="0"
              y="0"
              dy="0.36em"
              textAnchor="middle"
              fontSize="23"
              fontWeight="800"
              fill="#151515"
              fontFamily="Manrope, sans-serif"
            >
              {n}
            </text>
          </>
        )}
      </g>
      <circle cx="50" cy="50" r="49" fill="url(#ball-shade)" />
      <circle cx="50" cy="50" r="49" fill="url(#ball-bounce)" />
      <circle cx="50" cy="50" r="49" fill="url(#ball-shine)" />
      <path
        d="M24 30 C 28 20, 38 15, 48 15"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        filter="url(#ball-soft)"
      />
      <ellipse
        cx="34"
        cy="27"
        rx="6"
        ry="4"
        fill="#fff"
        opacity="0.95"
        transform="rotate(-35 34 27)"
      />
      <circle cx="50" cy="50" r="48.5" fill="none" stroke="#000" strokeOpacity="0.35" />
    </svg>
  );
}
