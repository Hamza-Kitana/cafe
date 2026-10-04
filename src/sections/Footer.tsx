import { useI18n } from "@/i18n";
import { cafe, digits } from "@/data/cafe";
import { Link } from "@tanstack/react-router";
import { toTop } from "@/lib/nav";
import { LangSwitch } from "@/components/chrome/Nav";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  const { t, lang } = useI18n();
  return (
    <footer className="relative overflow-hidden border-t border-border bg-ink px-6 pb-8 pt-20 md:px-12">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-0.2em] select-none text-center font-display text-[30vw] font-semibold leading-none text-cream/[0.035]"
        aria-hidden
      >
        {t.brand}
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo size="md" className="[&_.logo-word]:text-4xl" />
          <p className="mt-3 text-sm text-muted-foreground">{t.footer.phrase}</p>
          <nav aria-label={t.pages.label} className="mt-8 flex gap-6">
            {(["/", "/menu", "/contact"] as const).map((to) => (
              <Link
                key={to}
                to={to}
                className="display text-2xl text-cream/80 transition-colors hover:text-amber [&.active]:text-amber"
              >
                {t.pages[to]}
              </Link>
            ))}
          </nav>
        </div>
        <nav aria-label="Social" className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <a
            href={cafe.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            Instagram
          </a>
          <a
            href={cafe.tiktok.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            TikTok
          </a>
          <a
            href={cafe.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            WhatsApp
          </a>
          <a
            href={cafe.maps.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            {cafe.address[lang]}
          </a>
        </nav>
      </div>
      <div className="relative mx-auto mt-16 flex max-w-6xl flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {digits(cafe.established, lang)} {t.brand}. {t.footer.rights}
        </span>
        <div className="flex items-center gap-4">
          <button onClick={toTop} className="link-underline">
            {t.footer.top} ↑
          </button>
          <LangSwitch />
        </div>
      </div>
    </footer>
  );
}
