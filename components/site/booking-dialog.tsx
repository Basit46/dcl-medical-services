"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Dialog } from "radix-ui";
import { branches, clinic, hmoPlans, services } from "@/lib/clinic";

type BookingForm = {
  branchId: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  hmo: string;
  notes: string;
};

const emptyForm: BookingForm = {
  branchId: branches[0].id,
  name: "",
  phone: "",
  service: services[0].name,
  date: "",
  time: "",
  hmo: "",
  notes: "",
};

const required: { field: keyof BookingForm; message: string }[] = [
  { field: "name", message: "Please tell us your full name." },
  { field: "phone", message: "We need a phone number to confirm on." },
  { field: "date", message: "Choose a preferred date." },
  { field: "time", message: "Choose a preferred time." },
];

function formatDate(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value: string) {
  const parsed = new Date(`1970-01-01T${value}`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed
    .toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true })
    .replace(/\s?([ap])m/i, (_, meridiem: string) => ` ${meridiem.toLowerCase()}m`);
}

function buildWhatsappUrl(form: BookingForm) {
  const branch = branches.find((b) => b.id === form.branchId) ?? branches[0];
  const lines = [
    `Appointment request — ${clinic.name}`,
    "",
    `Branch: ${branch.name}`,
    `Name: ${form.name.trim()}`,
    `Phone: ${form.phone.trim()}`,
    `Service: ${form.service}`,
    `Preferred date: ${formatDate(form.date)}`,
    `Preferred time: ${formatTime(form.time)}`,
  ];
  if (form.hmo.trim()) lines.push(`HMO plan: ${form.hmo.trim()}`);
  if (form.notes.trim()) lines.push("", `Notes: ${form.notes.trim()}`);
  return `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}

const labelClass = "text-[11px] tracking-[0.18em] uppercase text-sage";
const fieldClass =
  "min-h-11 w-full border border-ink/25 bg-paper px-3 py-2.5 text-[15px] text-ink outline-none focus-visible:border-pine";

export function BookingDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingForm, string>>>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const branch = branches.find((b) => b.id === form.branchId) ?? branches[0];

  const set = <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setForm(emptyForm);
      setErrors({});
      setSentUrl(null);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found: Partial<Record<keyof BookingForm, string>> = {};
    for (const { field, message } of required) {
      if (!form[field].trim()) found[field] = message;
    }
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const url = buildWhatsappUrl(form);
    setSentUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-100 bg-ink/55 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-100 flex max-h-[calc(100dvh-32px)] w-[min(560px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 animate-rise flex-col overflow-hidden border border-ink/30 bg-surface shadow-panel">
          <div className="flex flex-none items-start justify-between gap-4 bg-forest px-5 py-4 text-surface sm:px-6">
            <div>
              <Dialog.Title className="m-0 font-display text-[26px] leading-tight font-normal text-surface">
                Book an appointment
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-[13px] leading-[1.6] text-cream">
                Fill this in and we will open WhatsApp with your details ready to send to the{" "}
                {branch.name} front desk.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close"
              className="size-8 flex-none border border-white/30 text-base leading-none text-surface hover:bg-white/10"
            >
              ×
            </Dialog.Close>
          </div>

          {sentUrl ? (
            <div className="flex flex-col gap-4 px-5 py-8 sm:px-6">
              <p className="m-0 text-[15.5px] leading-[1.7] text-slate">
                WhatsApp should be opening in a new tab with your request to the{" "}
                <strong>{branch.name}</strong> branch on {branch.tel.label}. Press send there and
                the front desk will confirm your slot.
              </p>
              <a
                href={sentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center border border-gold bg-gold px-6 text-[17px] font-bold text-ink no-underline hover:bg-gold-deep"
              >
                Open WhatsApp again
              </a>
              <p className="m-0 text-[13px] leading-[1.7] text-moss">
                Nothing happened? Your browser may have blocked the new tab — use the button
                above, or call {branch.name} on{" "}
                <a href={branch.tel.href} className="tnum text-pine">
                  {branch.tel.label}
                </a>
                .
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-6"
            >
              <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
                <legend className={labelClass}>Which branch?</legend>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
                  {branches.map((option) => (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer flex-col gap-1 border p-3.5 ${
                        form.branchId === option.id
                          ? "border-pine bg-pine/8"
                          : "border-ink/20 hover:border-pine/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="branch"
                        value={option.id}
                        checked={form.branchId === option.id}
                        onChange={() => set("branchId", option.id)}
                        className="sr-only"
                      />
                      <span className="text-base font-bold text-ink">{option.name}</span>
                      <span className="text-[12.5px] leading-[1.5] text-moss">
                        {option.address}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Full name</span>
                  <input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    autoComplete="name"
                    className={fieldClass}
                  />
                  {errors.name && <span className="text-[12.5px] text-red-700">{errors.name}</span>}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Phone number</span>
                  <input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="0803 000 0000"
                    className={fieldClass}
                  />
                  {errors.phone && (
                    <span className="text-[12.5px] text-red-700">{errors.phone}</span>
                  )}
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>What do you need?</span>
                <select
                  value={form.service}
                  onChange={(e) => set("service", e.target.value)}
                  className={fieldClass}
                >
                  {services.map((service) => (
                    <option key={service.num} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Preferred date</span>
                  <input
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    className={fieldClass}
                  />
                  {errors.date && <span className="text-[12.5px] text-red-700">{errors.date}</span>}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Preferred time</span>
                  <input
                    value={form.time}
                    onChange={(e) => set("time", e.target.value)}
                    type="time"
                    className={fieldClass}
                  />
                  {errors.time && <span className="text-[12.5px] text-red-700">{errors.time}</span>}
                </label>
              </div>

              <p className="m-0 -mt-2 text-[12.5px] leading-[1.6] text-moss">
                {clinic.openingHours}
              </p>

              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>HMO plan (optional)</span>
                <input
                  value={form.hmo}
                  onChange={(e) => set("hmo", e.target.value)}
                  list="dcl-hmo-plans"
                  placeholder="e.g. AXA Mansard"
                  className={fieldClass}
                />
                <datalist id="dcl-hmo-plans">
                  {hmoPlans.map((plan) => (
                    <option key={plan} value={plan} />
                  ))}
                </datalist>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Anything else? (optional)</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={3}
                  placeholder="A short note about what you need to see the doctor for."
                  className={`${fieldClass} min-h-[88px] resize-y`}
                />
              </label>

              <button
                type="submit"
                className="min-h-12.5 border border-gold bg-gold px-6 text-[17px] font-bold text-ink hover:bg-gold-deep"
              >
                Send on WhatsApp
              </button>
              <p className="m-0 text-center text-[12.5px] leading-[1.6] text-moss">
                Please do not share medical details you would rather discuss in person.
              </p>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
