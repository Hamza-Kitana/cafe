const HOLES = Array.from({ length: 22 }, (_, k) => {
  const ring = k < 8 ? 0 : k < 16 ? 1 : 2;
  const i = ring === 0 ? k : ring === 1 ? k - 8 : k - 16;
  const n = ring === 2 ? 6 : 8;
  const a = (i / n) * Math.PI * 2 + ring * 0.4;
  const r = [26, 17, 8][ring]!;
  return {
    x: Math.round((120 + Math.cos(a) * r) * 10) / 10,
    y: Math.round((38 + Math.sin(a) * r * 0.18) * 10) / 10,
  };
});

const BUBBLES = [
  { x: 118, r: 3.2, d: 1.5, dl: 0 },
  { x: 123, r: 2.2, d: 1.2, dl: -0.4 },
  { x: 115, r: 1.6, d: 1.8, dl: -0.9 },
  { x: 126, r: 2.8, d: 1.4, dl: -1.1 },
  { x: 120, r: 1.8, d: 1.7, dl: -0.2 },
  { x: 112, r: 2.4, d: 1.3, dl: -0.7 },
];

/** Front-view hookah. The glass base picks up the lounge's ambient colour via --amb. */
export function Hookah({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 520" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="hk-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#4f3412" />
          <stop offset="0.2" stopColor="#a87a34" />
          <stop offset="0.38" stopColor="#f0d08a" />
          <stop offset="0.46" stopColor="#fff6dc" />
          <stop offset="0.56" stopColor="#d9ac5c" />
          <stop offset="0.8" stopColor="#8a6024" />
          <stop offset="1" stopColor="#3e290e" />
        </linearGradient>
        <linearGradient id="hk-gold-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff1c9" />
          <stop offset="0.5" stopColor="#c99a4c" />
          <stop offset="1" stopColor="#4f3412" />
        </linearGradient>
        <linearGradient id="hk-glass" x1="0" x2="1">
          <stop offset="0" style={{ stopColor: "var(--amb)", stopOpacity: 0.6 }} />
          <stop offset="0.12" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.24" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.34" style={{ stopColor: "var(--amb)", stopOpacity: 0.12 }} />
          <stop offset="0.7" style={{ stopColor: "var(--amb)", stopOpacity: 0.18 }} />
          <stop offset="0.86" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="1" style={{ stopColor: "var(--amb)", stopOpacity: 0.7 }} />
        </linearGradient>
        <linearGradient id="hk-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--amb)", stopOpacity: 0.45 }} />
          <stop offset="1" style={{ stopColor: "var(--amb)", stopOpacity: 0.9 }} />
        </linearGradient>
        <linearGradient id="hk-water-x" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="0.25" stopColor="#000" stopOpacity="0" />
          <stop offset="0.38" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="hk-clay" x1="0" x2="1">
          <stop offset="0" stopColor="#3a180e" />
          <stop offset="0.3" stopColor="#8e4630" />
          <stop offset="0.45" stopColor="#c4704e" />
          <stop offset="0.7" stopColor="#7a3a24" />
          <stop offset="1" stopColor="#2e130a" />
        </linearGradient>
        <linearGradient id="hk-foil" x1="0" x2="1">
          <stop offset="0" stopColor="#7d7a76" />
          <stop offset="0.4" stopColor="#efece6" />
          <stop offset="0.6" stopColor="#b9b5ae" />
          <stop offset="1" stopColor="#6a6762" />
        </linearGradient>
        <linearGradient id="hk-coal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bdb6ad" />
          <stop offset="0.35" stopColor="#6d655d" />
          <stop offset="0.36" stopColor="#3a1a10" />
          <stop offset="1" stopColor="#1a0a05" />
        </linearGradient>
        <radialGradient id="hk-ember" cx="50%" cy="60%" r="60%">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="0.35" stopColor="#ffa040" />
          <stop offset="0.75" stopColor="#d43d0c" stopOpacity="0.8" />
          <stop offset="1" stopColor="#5a1405" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hk-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff8a2a" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ff8a2a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hk-caustic" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" style={{ stopColor: "var(--amb)", stopOpacity: 0 }} />
        </radialGradient>
        <clipPath id="hk-vase">
          <path d="M104 278 C 104 320, 40 360, 40 430 C 40 486, 78 510, 120 510 C 162 510, 200 486, 200 430 C 200 360, 136 320, 136 278 Z" />
        </clipPath>
        <filter id="hk-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <filter id="hk-blur-lg" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* floor shadow */}
      <ellipse
        cx="124"
        cy="512"
        rx="96"
        ry="9"
        fill="#000"
        opacity="0.55"
        filter="url(#hk-blur-lg)"
      />

      {/* hose: braided wrap, a highlight and a gold mouthpiece */}
      <path
        d="M150 250 C 215 260, 230 330, 214 400 S 170 492, 124 500"
        fill="none"
        stroke="#140e0b"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M150 250 C 215 260, 230 330, 214 400 S 170 492, 124 500"
        fill="none"
        stroke="#4b3a2e"
        strokeWidth="9"
        strokeDasharray="2.5 3.5"
      />
      <path
        d="M152 247 C 213 256, 226 330, 210 400 S 168 488, 124 496"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.18"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M126 500 L 92 506" stroke="url(#hk-gold-v)" strokeWidth="9" strokeLinecap="round" />
      <path d="M94 506 L 76 509" stroke="#e8c27a" strokeWidth="5" strokeLinecap="round" />
      <rect
        x="140"
        y="244"
        width="16"
        height="12"
        rx="2"
        fill="url(#hk-gold)"
        transform="rotate(12 148 250)"
      />

      {/* ember glow + coals on perforated foil */}
      <ellipse cx="120" cy="30" rx="54" ry="22" fill="url(#hk-glow)" className="hk-ember" />
      <path d="M86 38 L 154 38 L 139 76 L 101 76 Z" fill="url(#hk-clay)" />
      <path
        d="M96 42 L 102 72"
        stroke="#fff"
        strokeOpacity="0.25"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#hk-blur)"
      />
      <ellipse cx="120" cy="38" rx="36" ry="7" fill="#5a2a18" />
      <ellipse cx="120" cy="37.5" rx="33" ry="5.6" fill="url(#hk-foil)" />
      {HOLES.map((h, i) => (
        <circle key={i} cx={h.x} cy={h.y} r="0.9" fill="#2a2522" />
      ))}
      <g>
        {[
          [93, 22, 21, 14, 0],
          [119, 19, 22, 15, -0.6],
          [131, 26, 18, 11, -1.1],
        ].map(([x, y, w, h, dl], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} rx="2.5" fill="url(#hk-coal)" />
            <rect
              x={x! + 1.5}
              y={y! + h! * 0.4}
              width={w! - 3}
              height={h! * 0.55}
              rx="2"
              fill="url(#hk-ember)"
              className="hk-ember"
              style={{ ["--dl" as string]: `${dl}s` }}
            />
            <path
              d={`M${x! + 3} ${y! + h! * 0.6} l ${w! * 0.3} 2 l ${w! * 0.25} -3 l ${w! * 0.3} 2`}
              stroke="#ffd27a"
              strokeWidth="0.8"
              fill="none"
              className="hk-ember"
              style={{ ["--dl" as string]: `${(dl as number) - 0.5}s` }}
            />
          </g>
        ))}
      </g>

      {/* tray */}
      <ellipse cx="120" cy="98" rx="66" ry="11" fill="#2a1a0a" />
      <ellipse cx="120" cy="95" rx="66" ry="10" fill="url(#hk-gold)" />
      <ellipse cx="120" cy="93" rx="58" ry="6" fill="#2a1d10" opacity="0.55" />
      <ellipse
        cx="104"
        cy="92"
        rx="26"
        ry="2.5"
        fill="#fff"
        opacity="0.25"
        filter="url(#hk-blur)"
      />

      {/* stem with engraved rings */}
      <rect x="112" y="76" width="16" height="200" fill="url(#hk-gold)" />
      <rect
        x="117"
        y="76"
        width="2.5"
        height="200"
        fill="#fff"
        opacity="0.45"
        filter="url(#hk-blur)"
      />
      {[110, 146, 190, 236, 252].map((y) => (
        <path
          key={y}
          d={`M112 ${y} Q 120 ${y + 3} 128 ${y}`}
          stroke="#3e290e"
          strokeOpacity="0.7"
          fill="none"
        />
      ))}
      <ellipse cx="120" cy="128" rx="17" ry="11" fill="url(#hk-gold)" />
      <ellipse cx="114" cy="124" rx="4" ry="5" fill="#fff" opacity="0.4" filter="url(#hk-blur)" />
      <ellipse cx="120" cy="168" rx="13" ry="16" fill="url(#hk-gold)" />
      <ellipse cx="115" cy="162" rx="3" ry="7" fill="#fff" opacity="0.45" filter="url(#hk-blur)" />
      <ellipse cx="120" cy="212" rx="19" ry="8" fill="url(#hk-gold)" />
      <path d="M101 212 Q 120 220 139 212" stroke="#3e290e" strokeOpacity="0.6" fill="none" />
      <rect x="104" y="262" width="32" height="14" rx="3" fill="url(#hk-gold)" />
      <path d="M104 269 H 136" stroke="#3e290e" strokeOpacity="0.5" />

      {/* glass base */}
      <path
        d="M104 278 C 104 320, 40 360, 40 430 C 40 486, 78 510, 120 510 C 162 510, 200 486, 200 430 C 200 360, 136 320, 136 278 Z"
        fill="url(#hk-glass)"
      />
      <g clipPath="url(#hk-vase)">
        {/* downstem above, then refracted (shifted + magnified) under the water */}
        <rect x="116" y="276" width="8" height="124" fill="#8a6024" opacity="0.8" />
        <rect x="117" y="276" width="2" height="124" fill="#fff1c9" opacity="0.5" />
        <path d="M0 400 H240 V520 H0Z" fill="url(#hk-water)" />
        <rect x="117" y="400" width="11" height="72" rx="2" fill="#6b4a1e" opacity="0.65" />
        <rect x="119" y="400" width="2.5" height="72" fill="#fff1c9" opacity="0.35" />
        {BUBBLES.map((b, i) => (
          <circle
            key={i}
            className="hk-bub"
            cx={b.x}
            cy="470"
            r={b.r}
            fill="#fff"
            fillOpacity="0.15"
            stroke="#fff"
            strokeOpacity="0.8"
            strokeWidth="0.7"
            style={{
              ["--d" as string]: `${b.d}s`,
              ["--dl" as string]: `${b.dl}s`,
              ["--h" as string]: "68px",
            }}
          />
        ))}
        <path d="M0 400 H240 V520 H0Z" fill="url(#hk-water-x)" />
        <ellipse cx="120" cy="492" rx="44" ry="8" fill="url(#hk-caustic)" />
        <ellipse cx="120" cy="400" rx="80" ry="6" fill="#fff" opacity="0.14" />
        <path
          d="M40 400 Q 120 412 200 400"
          stroke="#fff"
          strokeOpacity="0.45"
          strokeWidth="1.2"
          fill="none"
        />
      </g>
      {/* cut-glass facets */}
      <g stroke="#fff" strokeOpacity="0.16" strokeWidth="1" fill="none" clipPath="url(#hk-vase)">
        <path d="M62 380 L 120 470 L 178 380" />
        <path d="M70 430 L 120 360 L 170 430" />
        <path d="M88 330 L 120 300 L 152 330" />
        <path d="M120 300 L 120 504" />
      </g>
      <path
        d="M66 360 C 56 392, 56 432, 70 472"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        filter="url(#hk-blur)"
      />
      <path
        d="M76 366 C 68 396, 68 430, 78 462"
        stroke="#fff"
        strokeOpacity="0.2"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M186 392 C 192 430, 186 462, 172 482"
        stroke="#fff"
        strokeOpacity="0.25"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        filter="url(#hk-blur)"
      />
      <path
        d="M110 284 C 110 304, 98 318, 86 330"
        stroke="#fff"
        strokeOpacity="0.4"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M104 278 C 104 320, 40 360, 40 430 C 40 486, 78 510, 120 510 C 162 510, 200 486, 200 430 C 200 360, 136 320, 136 278"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <ellipse cx="120" cy="278" rx="16" ry="3" fill="none" stroke="#fff" strokeOpacity="0.5" />
    </svg>
  );
}
