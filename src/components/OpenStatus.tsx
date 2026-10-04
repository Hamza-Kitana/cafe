import { useI18n } from "@/i18n";
import { isOpen, useAmmanTime } from "@/lib/hours";

/** Live "open now / closed" pill, computed in Amman time. */
export function OpenStatus({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const now = useAmmanTime();
  if (!now) return <span className={`inline-block h-7 ${className}`} aria-hidden />;
  const open = isOpen(now);
  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-[0.7rem] font-semibold tracking-wider ${
        open ? "border-mint/40 text-mint" : "border-cream/20 text-cream/60"
      } ${className}`}
      role="status"
    >
      <span className="relative flex h-2 w-2" aria-hidden>
        {open && <span className="absolute inset-0 animate-ping rounded-full bg-mint/70" />}
        <span className={`relative h-2 w-2 rounded-full ${open ? "bg-mint" : "bg-cream/40"}`} />
      </span>
      {open ? t.status.open : t.status.closed}
    </span>
  );
}
