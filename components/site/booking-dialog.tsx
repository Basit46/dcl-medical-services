"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
    .toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(
      /\s?([ap])m/i,
      (_, meridiem: string) => ` ${meridiem.toLowerCase()}m`,
    );
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

export function BookingDialog({
  children,
  open: controlledOpen,
  onOpenChange: onControlledOpenChange,
}: {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BookingForm, string>>
  >({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const branch = branches.find((b) => b.id === form.branchId) ?? branches[0];

  const set = <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onOpenChange = (next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next);
    onControlledOpenChange?.(next);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader className="flex-none border-b border-border bg-primary-50 px-5 py-5 pr-14 sm:px-6">
          <DialogTitle className="font-display text-[26px] leading-tight font-normal text-primary-900">
            Book an appointment
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-[1.6] text-primary-800">
            Fill this in and we will open WhatsApp with your details ready to
            send to the {branch.name} front desk.
          </DialogDescription>
        </DialogHeader>

        {sentUrl ? (
          <div className="flex flex-col gap-4 px-5 py-8 sm:px-6">
            <p className="m-0 text-[15.5px] leading-[1.7] text-slate">
              WhatsApp should be opening in a new tab with your request to the{" "}
              <strong>{branch.name}</strong> branch on {branch.tel.label}. Press
              send there and the front desk will confirm your slot.
            </p>
            <Button asChild size="lg" className="h-12 text-base">
              <a href={sentUrl} target="_blank" rel="noopener noreferrer">
                Open WhatsApp again
              </a>
            </Button>
            <p className="m-0 text-[13px] leading-[1.7] text-moss">
              Nothing happened? Your browser may have blocked the new tab — use
              the button above, or call {branch.name} on{" "}
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
              <legend className="mb-2 text-sm font-semibold text-ink">
                Which branch?
              </legend>
              <RadioGroup
                aria-label="Which branch?"
                value={form.branchId}
                onValueChange={(value) => set("branchId", value)}
                className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2"
              >
                {branches.map((option) => (
                  <Label
                    key={option.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors ${
                      form.branchId === option.id
                        ? "border-primary-600 bg-primary-50"
                        : "border-border hover:border-primary-400"
                    }`}
                  >
                    <RadioGroupItem value={option.id} className="mt-0.5" />
                    <span className="flex flex-col gap-1">
                      <span className="text-base font-bold text-ink">
                        {option.name}
                      </span>
                      <span className="text-[12.5px] leading-[1.5] text-moss">
                        {option.address}
                      </span>
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </fieldset>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">Full name</span>
                <Input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && (
                  <span className="text-[12.5px] text-red-700">
                    {errors.name}
                  </span>
                )}
              </Label>

              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">
                  Phone number
                </span>
                <Input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0803 000 0000"
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && (
                  <span className="text-[12.5px] text-red-700">
                    {errors.phone}
                  </span>
                )}
              </Label>
            </div>

            <Label className="flex flex-col items-start gap-1.5">
              <span className="text-sm font-medium text-ink">
                What do you need?
              </span>
              <Select
                value={form.service}
                onValueChange={(value) => set("service", value)}
              >
                <SelectTrigger aria-label="What do you need?">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.num} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Label>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">
                  Preferred date
                </span>
                <Input
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  aria-invalid={Boolean(errors.date)}
                />
                {errors.date && (
                  <span className="text-[12.5px] text-red-700">
                    {errors.date}
                  </span>
                )}
              </Label>

              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">
                  Preferred time
                </span>
                <Input
                  value={form.time}
                  onChange={(e) => set("time", e.target.value)}
                  type="time"
                />
                {errors.time && (
                  <span className="text-[12.5px] text-red-700">
                    {errors.time}
                  </span>
                )}
              </Label>
            </div>

            <p className="m-0 -mt-2 text-[12.5px] leading-[1.6] text-moss">
              {clinic.openingHours}
            </p>

            <Label className="flex flex-col items-start gap-1.5">
              <span className="text-sm font-medium text-ink">
                HMO plan (optional)
              </span>
              <Input
                value={form.hmo}
                onChange={(e) => set("hmo", e.target.value)}
                list="dcl-hmo-plans"
                placeholder="e.g. AXA Mansard"
              />
              <datalist id="dcl-hmo-plans">
                {hmoPlans.map((plan) => (
                  <option key={plan} value={plan} />
                ))}
              </datalist>
            </Label>

            <Label className="flex flex-col items-start gap-1.5">
              <span className="text-sm font-medium text-ink">
                Anything else? (optional)
              </span>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
                placeholder="A short note about what you need to see the doctor for."
                className="min-h-[88px] resize-y"
              />
            </Label>

            <Button type="submit" size="lg" className="h-12 text-base">
              Send on WhatsApp
            </Button>
            <p className="m-0 text-center text-[12.5px] leading-[1.6] text-moss">
              Please do not share medical details you would rather discuss in
              person.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
