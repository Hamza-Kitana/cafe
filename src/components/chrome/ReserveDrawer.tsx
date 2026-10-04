import { useState, type FormEvent } from "react";
import { Drawer } from "@/components/Drawer";
import { useI18n } from "@/i18n";
import { useUI } from "@/lib/ui";
import { cafe } from "@/data/cafe";

const TIMES = Array.from({ length: 20 }, (_, i) => {
  const mins = 16 * 60 + i * 30;
  const h = Math.floor(mins / 60) % 24;
  return `${String(h).padStart(2, "0")}:${mins % 60 === 0 ? "00" : "30"}`;
});

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Guests often type Arabic-Indic or Persian digits on Arabic keyboards. */
const latinDigits = (s: string) => s.replace(/[٠-٩۰-۹]/g, (c) => String(c.charCodeAt(0) & 0xf));

/** Frontend-only reservation: composes a WhatsApp message the guest sends to the café. */
export function ReserveDrawer() {
  const { t } = useI18n();
  const { reserveOpen, setReserveOpen } = useUI();
  const r = t.reserve;
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: today(),
    time: "20:00",
    guests: 2,
    area: 0,
    notes: "",
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [sent, setSent] = useState(false);

  const close = () => setReserveOpen(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = r.required;
    const phone = latinDigits(form.phone.trim());
    if (!/^\+?[\d\s-]{8,15}$/.test(phone)) next.phone = r.invalidPhone;
    setErrors(next);
    if (Object.keys(next).length) return;
    const text = r.message({ ...form, phone, area: r.areas[form.area]! });
    window.open(
      `${cafe.whatsapp.href}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  };

  const field =
    "w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-lg text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-amber";

  return (
    <Drawer open={reserveOpen} onClose={close} title={r.title} kicker={t.brand}>
      {sent ? (
        <div className="flex h-full flex-col justify-center py-10">
          <div className="display text-5xl neon-text">{r.success}</div>
          <p className="mt-4 max-w-sm text-muted-foreground">{r.successSub}</p>
          <button
            onClick={() => setSent(false)}
            className="link-underline mt-8 self-start text-sm text-amber"
          >
            {r.again}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-7">
          <p className="text-sm text-muted-foreground">{r.sub}</p>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {r.name}
            </span>
            <input
              className={field}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="name"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <span className="mt-1 block text-xs text-destructive">{errors.name}</span>
            )}
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {r.phone}
            </span>
            <input
              className={field}
              dir="ltr"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              autoComplete="tel"
              placeholder="+962 7…"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <span className="mt-1 block text-xs text-destructive">{errors.phone}</span>
            )}
          </label>
          <div className="grid grid-cols-2 gap-6">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {r.date}
              </span>
              <input
                type="date"
                className={`${field} [color-scheme:dark]`}
                min={today()}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {r.time}
              </span>
              <select
                className={`${field} [color-scheme:dark]`}
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                dir="ltr"
              >
                {TIMES.map((tm) => (
                  <option key={tm} value={tm} className="bg-charcoal">
                    {tm}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <span
              className="text-xs uppercase tracking-widest text-muted-foreground"
              id="guests-label"
            >
              {r.guests}
            </span>
            <div
              className="mt-3 flex items-center gap-5"
              role="group"
              aria-labelledby="guests-label"
            >
              <button
                type="button"
                aria-label="−"
                onClick={() => setForm({ ...form, guests: Math.max(1, form.guests - 1) })}
                className="h-11 w-11 rounded-full border border-border text-xl transition-colors hover:border-amber"
              >
                −
              </button>
              <span className="display w-10 text-center text-4xl tabular-nums" aria-live="polite">
                {form.guests}
              </span>
              <button
                type="button"
                aria-label="+"
                onClick={() => setForm({ ...form, guests: Math.min(16, form.guests + 1) })}
                className="h-11 w-11 rounded-full border border-border text-xl transition-colors hover:border-amber"
              >
                +
              </button>
            </div>
          </div>
          <fieldset>
            <legend className="text-xs uppercase tracking-widest text-muted-foreground">
              {r.area}
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {r.areas.map((a, i) => (
                <label
                  key={a}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber ${form.area === i ? "border-amber bg-amber text-ink" : "border-border hover:border-cream/50"}`}
                >
                  <input
                    type="radio"
                    name="area"
                    className="sr-only"
                    checked={form.area === i}
                    onChange={() => setForm({ ...form, area: i })}
                  />
                  {a}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {r.notes}
            </span>
            <textarea
              rows={2}
              className={`${field} resize-none`}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>
          <button type="submit" className="fill-btn fill-btn--solid w-full justify-center !py-4">
            <span className="fill-btn__bg" aria-hidden />
            <span className="relative z-10">{r.submit}</span>
          </button>
        </form>
      )}
    </Drawer>
  );
}
