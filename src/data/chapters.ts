import { digits, type Lang, type SectionId } from "./cafe";

/** Home-page reading order; `null` marks an interlude rather than a numbered chapter. */
export const CHAPTERS: [SectionId, number | null][] = [
  ["inside", null],
  ["coffee", 1],
  ["drinks", 2],
  ["shisha", 3],
  ["billiards", 4],
  ["cards", 5],
  ["seating", 6],
  ["house", null],
  ["table", 7],
  ["week", null],
  ["menu", 8],
  ["reviews", null],
  ["moments", 9],
  ["clock", 10],
  ["end", 11],
];

export const chapterNumber = (id: SectionId) => CHAPTERS.find(([s]) => s === id)?.[1] ?? null;

export const chapterLabel = (n: number, lang: Lang) => digits(String(n).padStart(2, "0"), lang);
