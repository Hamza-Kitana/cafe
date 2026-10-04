// Real-world café details. Replace these placeholders with the actual information.

export type Lang = "en" | "ar";
export type Localized = { en: string; ar: string };

export type SectionId =
  | "entrance"
  | "inside"
  | "coffee"
  | "drinks"
  | "shisha"
  | "billiards"
  | "cards"
  | "seating"
  | "house"
  | "table"
  | "week"
  | "menu"
  | "reviews"
  | "moments"
  | "clock"
  | "end"
  | "faq";

type PagePath = "/menu" | "/contact";
/** Navigation targets: a scene on the home page, or a page of its own. */
export type NavTarget = SectionId | PagePath;

export const cafe = {
  established: 2026,
  address: {
    en: "24 Rainbow St., Jabal Amman, Amman",
    ar: "٢٤ شارع الرينبو، جبل عمّان، عمّان",
  } satisfies Localized,
  hours: {
    en: "Daily · 4 PM — 2 AM",
    ar: "يوميًا · ٤ العصر — ٢ الفجر",
  } satisfies Localized,
  phone: { display: "+962 79 000 0000", href: "tel:+962790000000" },
  email: { display: "hello@layali.jo", href: "mailto:hello@layali.jo" },
  mapEmbed: "https://www.google.com/maps?q=Rainbow+Street,+Jabal+Amman,+Amman&z=16&output=embed",
  whatsapp: { number: "962790000000", href: "https://wa.me/962790000000" },
  instagram: { handle: "@layali.amman", href: "https://instagram.com/layali.amman" },
  tiktok: { handle: "@layali.amman", href: "https://tiktok.com/@layali.amman" },
  maps: { href: "https://maps.google.com/?q=Rainbow+Street+Jabal+Amman" },
  wifi: "Layali-Guest",
  billiards: { tables: 4, pricePerHour: 5 },
  rating: {
    score: 4.8,
    count: 1240,
    href: "https://maps.google.com/?q=Layali+Cafe+Rainbow+Street",
  },
  currency: { en: "JOD", ar: "د.أ" } satisfies Localized,
};

export const fmtPrice = (price: number, lang: Lang) => `${price.toFixed(2)} ${cafe.currency[lang]}`;

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export const digits = (value: string | number, lang: Lang) =>
  lang === "ar" ? String(value).replace(/\d/g, (d) => AR_DIGITS[Number(d)]!) : String(value);
