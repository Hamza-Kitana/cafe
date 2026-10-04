/**
 * Three-quarter view ceramic cup on a saucer. The drink is driven by CSS variables on an ancestor,
 * so GSAP can morph between recipes:
 * --liquid (colour), --crema, --art (latte art), --foam, --ice (0–1 opacities).
 */
export function Cup({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 300" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="cup-glaze" x1="0" x2="1">
          <stop offset="0" stopColor="#8f8578" />
          <stop offset="0.18" stopColor="#d9d1c4" />
          <stop offset="0.36" stopColor="#fffdf8" />
          <stop offset="0.5" stopColor="#f4eee3" />
          <stop offset="0.78" stopColor="#cfc5b6" />
          <stop offset="1" stopColor="#7d7366" />
        </linearGradient>
        <linearGradient id="cup-depth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="cup-inner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d7366" />
          <stop offset="1" stopColor="#e6ded1" />
        </linearGradient>
        <radialGradient id="cup-saucer" cx="45%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset="0.6" stopColor="#e2d9cb" />
          <stop offset="1" stopColor="#8f8578" />
        </radialGradient>
        <radialGradient id="cup-crema" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#d8a066" />
          <stop offset="0.55" stopColor="#b8763e" />
          <stop offset="0.85" stopColor="#7a4521" />
          <stop offset="1" stopColor="#4a2814" />
        </radialGradient>
        <radialGradient id="cup-foam" cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.7" stopColor="#efe2cc" />
          <stop offset="1" stopColor="#c9a882" />
        </radialGradient>
        <radialGradient id="cup-cocoa" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#5a3418" stopOpacity="0.85" />
          <stop offset="1" stopColor="#5a3418" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cup-ice" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#dfeef5" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.6" />
        </linearGradient>
        <clipPath id="cup-mouth">
          <ellipse cx="150" cy="80" rx="87" ry="19" />
        </clipPath>
        <filter id="cup-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="cup-softer" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* saucer */}
      <ellipse
        cx="160"
        cy="262"
        rx="150"
        ry="30"
        fill="#000"
        opacity="0.45"
        filter="url(#cup-soft)"
      />
      <ellipse cx="155" cy="250" rx="148" ry="32" fill="url(#cup-saucer)" />
      <ellipse
        cx="155"
        cy="246"
        rx="140"
        ry="28"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />
      <ellipse cx="155" cy="248" rx="88" ry="17" fill="#cfc5b6" />
      <ellipse
        cx="160"
        cy="246"
        rx="74"
        ry="12"
        fill="#000"
        opacity="0.4"
        filter="url(#cup-soft)"
      />

      {/* handle */}
      <path
        d="M236 104 C 300 96, 304 186, 226 192"
        fill="none"
        stroke="url(#cup-glaze)"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d="M240 112 C 286 108, 290 176, 230 182"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#cup-softer)"
      />

      {/* foot ring + body */}
      <ellipse cx="150" cy="240" rx="42" ry="8" fill="#8f8578" />
      <path
        d="M55 80 C 55 165, 84 222, 112 234 Q 150 244 188 234 C 216 222, 245 165, 245 80 Z"
        fill="url(#cup-glaze)"
      />
      <path
        d="M55 80 C 55 165, 84 222, 112 234 Q 150 244 188 234 C 216 222, 245 165, 245 80 Z"
        fill="url(#cup-depth)"
      />
      <path
        d="M80 98 C 78 150, 94 200, 116 222"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.85"
        strokeWidth="7"
        strokeLinecap="round"
        filter="url(#cup-softer)"
      />
      <path
        d="M224 104 C 226 150, 214 190, 198 214"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.25"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#cup-softer)"
      />

      {/* rim + inside wall */}
      <ellipse cx="150" cy="80" rx="95" ry="23" fill="#fbf8f2" />
      <ellipse cx="150" cy="80" rx="87" ry="19" fill="url(#cup-inner)" />

      {/* the drink */}
      <g clipPath="url(#cup-mouth)">
        <g className="c-surface">
          <ellipse cx="150" cy="86" rx="86" ry="17" style={{ fill: "var(--liquid)" }} />
          <ellipse
            cx="150"
            cy="86"
            rx="84"
            ry="16"
            fill="url(#cup-crema)"
            style={{ opacity: "var(--crema)" }}
          />
          <g style={{ opacity: "var(--foam)" }}>
            <ellipse cx="150" cy="86" rx="86" ry="17" fill="url(#cup-foam)" />
            <ellipse cx="150" cy="86" rx="40" ry="8" fill="url(#cup-cocoa)" />
            {[
              [118, 82, 2.2],
              [170, 90, 1.8],
              [132, 92, 1.4],
              [186, 81, 1.6],
              [104, 89, 1.2],
            ].map(([x, y, r], i) => (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx={r! * 1.6}
                ry={r! * 0.6}
                fill="#fff"
                opacity="0.6"
              />
            ))}
          </g>
          <g
            transform="translate(150 88) scale(1.3 0.27)"
            fill="none"
            stroke="#f7eedc"
            strokeLinecap="round"
            style={{ opacity: "var(--art)" }}
          >
            <path d="M0 52 C -10 20, -10 -20, 0 -58" strokeWidth="5" />
            {[0, 1, 2, 3, 4, 5].map((k) => {
              const y = 40 - k * 17;
              const w = 46 - k * 6;
              return (
                <path
                  key={k}
                  d={`M${-w} ${y - 10} Q 0 ${y + 26} ${w} ${y - 10}`}
                  strokeWidth={9 - k * 0.8}
                />
              );
            })}
            <ellipse cx="0" cy="-56" rx="15" ry="13" fill="#f7eedc" stroke="none" />
          </g>
          <g style={{ opacity: "var(--ice)" }}>
            <g className="c-ice">
              <rect
                x="96"
                y="58"
                width="34"
                height="30"
                rx="7"
                fill="url(#cup-ice)"
                transform="rotate(-14 113 73)"
              />
              <rect
                x="146"
                y="54"
                width="38"
                height="32"
                rx="8"
                fill="url(#cup-ice)"
                transform="rotate(9 165 70)"
              />
              <rect
                x="186"
                y="66"
                width="28"
                height="24"
                rx="6"
                fill="url(#cup-ice)"
                transform="rotate(24 200 78)"
              />
              <path
                d="M101 62 L 125 57"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                d="M152 58 L 178 62"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>
          </g>
          <ellipse
            cx="112"
            cy="80"
            rx="22"
            ry="4"
            fill="#fff"
            opacity="0.18"
            filter="url(#cup-softer)"
          />
          {[0, 1].map((k) => (
            <ellipse
              key={k}
              className="c-ripple"
              cx="150"
              cy="86"
              rx="12"
              ry="3"
              fill="none"
              stroke="#fff"
              strokeOpacity="0.55"
              strokeWidth="1.5"
              opacity="0"
            />
          ))}
        </g>
        <ellipse
          cx="150"
          cy="80"
          rx="87"
          ry="19"
          fill="none"
          stroke="#000"
          strokeOpacity="0.35"
          strokeWidth="8"
          filter="url(#cup-softer)"
        />
      </g>
      <ellipse
        cx="150"
        cy="80"
        rx="95"
        ry="23"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.7"
        strokeWidth="1.5"
      />

      {/* splash droplets for the ice drop */}
      <g className="c-drops" fill="var(--liquid)">
        {[
          [124, 76, 4],
          [150, 72, 3],
          [176, 76, 3.5],
          [138, 74, 2.5],
          [164, 74, 2.5],
        ].map(([x, y, r], i) => (
          <circle key={i} className="c-drop" cx={x} cy={y} r={r} opacity="0" />
        ))}
      </g>
    </svg>
  );
}

/** Roasted bean: glossy oval with the S-shaped centre cut. */
export function Bean({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 56" className={className} aria-hidden focusable="false">
      <ellipse cx="20" cy="28" rx="18" ry="26" fill="url(#bean-body)" />
      <path
        d="M20 4 C 11 18, 29 36, 20 52"
        stroke="#120a05"
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M22 6 C 14 19, 31 36, 23 51"
        stroke="#b07a52"
        strokeOpacity="0.35"
        strokeWidth="1"
        fill="none"
      />
      <ellipse
        cx="12"
        cy="17"
        rx="3.5"
        ry="8"
        fill="#fff"
        opacity="0.2"
        transform="rotate(-12 12 17)"
      />
    </svg>
  );
}

export function BeanDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <radialGradient id="bean-body" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#9a6640" />
          <stop offset="0.45" stopColor="#5a3219" />
          <stop offset="1" stopColor="#1b0f08" />
        </radialGradient>
      </defs>
    </svg>
  );
}
