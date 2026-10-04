import { useId } from "react";
import { useI18n } from "@/i18n";

/** The Layali mark: a doorway at night — crescent moon above, a cup and its steam below. */
export function Emblem({ className = "", mono = false }: { className?: string; mono?: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gold = `lg-gold-${id}`;
  const moon = `lg-moon-${id}`;
  const paint = mono ? "currentColor" : `url(#${gold})`;
  return (
    <svg viewBox="0 0 48 58" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe7b0" />
          <stop offset="0.45" stopColor="#e9b25a" />
          <stop offset="1" stopColor="#a8722a" />
        </linearGradient>
        <mask id={moon}>
          <rect width="48" height="58" fill="#fff" />
          <circle cx="27.4" cy="17.6" r="5.6" fill="#000" />
        </mask>
      </defs>
      <g fill="none" stroke={paint} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 55 V23 A19 19 0 0 1 43 23 V55" strokeWidth="2.2" />
        <path d="M9.5 55 V23.5 A14.5 14.5 0 0 1 38.5 23.5 V55" strokeWidth="0.9" opacity="0.55" />
        <path d="M2 55.5 H46" strokeWidth="2.2" />
        <g className="logo-steam" strokeWidth="1.4">
          <path d="M20.5 36 C 18.6 33.8, 22.4 32.4, 20.5 29.8" />
          <path d="M26 36 C 24.1 33.8, 27.9 32.4, 26 29.8" />
        </g>
        <path d="M30.6 41.4 C 35.2 41.4, 35.2 47, 29.8 47" strokeWidth="1.6" />
        <path d="M14 51.2 H33" strokeWidth="1.6" />
      </g>
      <g fill={paint}>
        <circle cx="24" cy="20" r="6.4" mask={`url(#${moon})`} />
        <path d="M15.5 39.2 H31 C 31 45.6, 27.6 49.4, 23.25 49.4 C 18.9 49.4, 15.5 45.6, 15.5 39.2 Z" />
        <path
          className="logo-star"
          d="M33.6 25.4 L 34.3 27.3 L 36.2 28 L 34.3 28.7 L 33.6 30.6 L 32.9 28.7 L 31 28 L 32.9 27.3 Z"
        />
      </g>
    </svg>
  );
}

/** Emblem + wordmark in the current language. Nothing else beside it, on purpose. */
export function Logo({
  className = "",
  size = "md",
  word = true,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  word?: boolean;
}) {
  const { t, lang } = useI18n();
  const mark = { sm: "h-9", md: "h-11", lg: "h-20" }[size];
  const text =
    lang === "ar"
      ? { sm: "text-[1.85rem]", md: "text-[2.2rem]", lg: "text-6xl" }[size]
      : { sm: "text-[1.05rem]", md: "text-xl", lg: "text-4xl" }[size];
  return (
    <span className={`logo group/logo inline-flex items-center gap-2.5 ${className}`}>
      <Emblem className={`${mark} w-auto shrink-0 drop-shadow-[0_0_10px_rgb(255_180_80/0.35)]`} />
      {word && (
        <span
          className={`logo-word ${lang === "ar" ? "logo-word--ar" : "logo-word--en"} ${text} leading-none`}
        >
          {t.brand}
        </span>
      )}
    </span>
  );
}
