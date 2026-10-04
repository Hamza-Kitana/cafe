import type { MenuItem } from "@/data/menu";
import { digits, fmtPrice } from "@/data/cafe";
import { useI18n } from "@/i18n";

/** Editorial menu rows: name in both languages, a short line, and a dotted price leader. */
export function MenuList({
  items,
  compact = false,
  rowClass = "",
}: {
  items: MenuItem[];
  compact?: boolean;
  rowClass?: string;
}) {
  const { lang, t } = useI18n();
  const other = lang === "en" ? "ar" : "en";
  return (
    <ol className="divide-y divide-border">
      {items.map((item, i) => (
        <li
          key={item.id}
          className={`group grid grid-cols-[2rem_1fr] gap-x-3 ${compact ? "py-4" : "py-5 md:py-6"} ${rowClass}`}
        >
          <span className="pt-2 text-xs tabular-nums text-[var(--accent,var(--amber))]">
            {digits(String(i + 1).padStart(2, "0"), lang)}
          </span>
          <div className="min-w-0">
            <div className="flex items-baseline gap-3">
              <h3
                className={`display min-w-0 ${compact ? "text-2xl" : "text-2xl md:text-4xl"} transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1`}
              >
                {item.name[lang]}
              </h3>
              <span className="leader" aria-hidden />
              <span className="shrink-0 font-body text-base tabular-nums text-gold md:text-lg">
                {fmtPrice(item.price, lang)}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span
                lang={other}
                dir={other === "ar" ? "rtl" : "ltr"}
                className={`text-sm text-cream/55 ${other === "ar" ? "font-arabic" : "font-latin italic"}`}
              >
                {item.name[other]}
              </span>
              {item.signature && (
                <span className="rounded-full border border-[var(--accent,var(--amber))] px-2 py-px text-[0.6rem] uppercase tracking-widest text-[var(--accent,var(--amber))]">
                  {t.menu.signature}
                </span>
              )}
            </div>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">{item.desc[lang]}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
