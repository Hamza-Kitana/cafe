import { useEffect, useId, useRef, useState } from "react";
import { gsap, useScene, ScrollTrigger } from "@/lib/motion";
import { useI18n } from "@/i18n";
import { cafe, digits } from "@/data/cafe";
import { FillButton } from "@/components/Magnetic";
import { OpenStatus } from "@/components/OpenStatus";

/* Practical answers before you leave the house. */
export function Faq() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  const uid = useId();
  const f = t.faq;

  useScene(root, () => {
    gsap.fromTo(
      ".fq-item",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".fq-list", start: "top 85%", once: true },
      },
    );
    gsap.fromTo(
      ".fq-head > *",
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".fq-head", start: "top 85%", once: true },
      },
    );
  }, [lang]);

  // Heights change after the grid-rows transition; triggers below need fresh offsets.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 520);
    return () => window.clearTimeout(id);
  }, [open]);

  return (
    <section
      ref={root}
      id="faq"
      aria-label={f.title}
      className="relative overflow-hidden bg-[#06070b] py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 px-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-20 md:px-12">
        <div className="fq-head md:sticky md:top-28 md:self-start">
          <div className="kicker">{f.kicker}</div>
          <h2 className="display mt-5 text-5xl md:text-7xl">{f.title}</h2>
          <p className="mt-6 max-w-sm text-cream/65">{f.sub}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <FillButton href={cafe.whatsapp.href} external>
              {f.ask}
            </FillButton>
            <OpenStatus />
          </div>
        </div>

        <ul className="fq-list border-b border-border">
          {f.items.map((item, i) => {
            const isOpen = open === i;
            const panel = `${uid}-p${i}`;
            return (
              <li
                key={item.q}
                className={`fq-item relative border-t border-border transition-colors duration-500 ${isOpen ? "bg-cream/[0.03]" : ""}`}
              >
                <span
                  className={`absolute inset-y-0 start-0 w-px bg-amber shadow-[0_0_18px_2px_var(--amber)] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
                  aria-hidden
                />
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="group flex w-full items-center gap-5 py-6 ps-5 text-start md:py-7"
                  >
                    <span className="text-[0.7rem] tabular-nums text-amber/70">
                      {digits(String(i + 1).padStart(2, "0"), lang)}
                    </span>
                    <span
                      className={`flex-1 text-lg font-semibold transition-colors md:text-2xl ${isOpen ? "text-cream" : "text-cream/75 group-hover:text-cream"}`}
                    >
                      {item.q}
                    </span>
                    <span
                      className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ${isOpen ? "rotate-[135deg] border-amber bg-amber text-ink" : "border-border text-cream group-hover:border-cream/50"}`}
                      aria-hidden
                    >
                      <span className="absolute h-px w-3.5 bg-current" />
                      <span className="absolute h-3.5 w-px bg-current" />
                    </span>
                  </button>
                </h3>
                <div
                  id={panel}
                  role="region"
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p
                      className={`max-w-2xl pb-7 pe-14 ps-[3.25rem] leading-relaxed text-cream/65 transition-[opacity,transform] duration-500 ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
