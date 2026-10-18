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
import {
  bookableServices,
  branches,
  clinic,
  OTHER_SERVICE,
} from "@/lib/clinic";
import { useHmoPlans } from "@/components/site/hmo-plans-provider";
import { cn } from "@/lib/utils";

type BookingForm = {
  branchId: string;
  name: string;
  phone: string;
  service: string;
  otherService: string;
  date: string;
  time: string;
  usesHmo: boolean;
  hmoProvider: string;
  enrolleeId: string;
  notes: string;
};

type BookingErrors = Partial<Record<keyof BookingForm, string>>;

const emptyForm: BookingForm = {
  branchId: branches[0].id,
  name: "",
  phone: "",
  service: "",
  otherService: "",
  date: "",
  time: "",
  usesHmo: false,
  hmoProvider: "",
  enrolleeId: "",
  notes: "",
};

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
  const service =
    form.service === OTHER_SERVICE
      ? `${OTHER_SERVICE}: ${form.otherService.trim()}`
      : form.service;

  const lines = [
    `Appointment request — ${clinic.name}`,
    "",
    `Branch: ${branch.name}`,
    `Name: ${form.name.trim()}`,
    `Phone: ${form.phone.trim()}`,
    `Service: ${service}`,
    `Preferred date: ${formatDate(form.date)}`,
    `Preferred time: ${formatTime(form.time)}`,
    `Paying through HMO: ${form.usesHmo ? "YES" : "NO"}`,
  ];
  if (form.usesHmo && form.hmoProvider.trim()) {
    lines.push(`HMO provider: ${form.hmoProvider.trim()}`);
  }
  if (form.usesHmo && form.enrolleeId.trim()) {
    lines.push(`HMO enrollee ID: ${form.enrolleeId.trim()}`);
  }
  if (form.notes.trim()) lines.push("", `Notes: ${form.notes.trim()}`);
  return `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function validate(form: BookingForm): BookingErrors {
  const errors: BookingErrors = {};
  if (!form.name.trim()) errors.name = "Please tell us your name.";
  if (form.phone.trim().length < 10) {
    errors.phone = "Please enter a phone number we can reach you on.";
  }
  if (!form.service) errors.service = "Please choose a service.";
  if (form.service === OTHER_SERVICE && !form.otherService.trim()) {
    errors.otherService = "Please tell us which service you need.";
  }
  if (!form.date) errors.date = "Choose a preferred date.";
  if (!form.time) errors.time = "Choose a preferred time.";
  if (form.usesHmo && !form.hmoProvider.trim()) {
    errors.hmoProvider = "Please choose your HMO provider.";
  }
  if (form.usesHmo && !form.enrolleeId.trim()) {
    errors.enrolleeId = "Please enter your HMO enrollee ID.";
  }
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={id} role="alert" className="text-[12.5px] text-red-700">
      {message}
    </span>
  );
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
  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const hmoPlans = useHmoPlans();

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
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const url = buildWhatsappUrl(form);
    setSentUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader className="flex-none border-b border-border bg-primary-50 px-5 py-5 pr-14 sm:px-6">
          <DialogTitle className="font-display text-[26px] leading-tight font-normal text-primary-900">
            Request a specialist appointment
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-[1.6] text-primary-800">
            This form is for our specialist clinics only.
          </DialogDescription>
        </DialogHeader>

        {sentUrl ? (
          <div className="flex flex-col gap-4 px-5 py-8 sm:px-6">
            <p className="m-0 text-[15.5px] leading-[1.7] text-slate">
              WhatsApp should be opening in a new tab with your request to the{" "}
              <strong>{branch.name}</strong> branch on {branch.tel.label}.
            </p>
            <Button asChild size="lg" className="h-12 text-base">
              <a href={sentUrl} target="_blank" rel="noopener noreferrer">
                Open WhatsApp again
              </a>
            </Button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="flex min-w-0 flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-6"
          >
            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
              <legend className="mb-2 text-sm font-semibold text-ink">
                Which branch?
              </legend>
              <RadioGroup
                aria-label="Which branch?"
                value={form.branchId}
                onValueChange={(value) => set("branchId", value)}
                className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-2"
              >
                {branches.map((option) => (
                  <Label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors",
                      form.branchId === option.id
                        ? "border-primary-600 bg-primary-50"
                        : "border-border hover:border-primary-400",
                    )}
                  >
                    <RadioGroupItem value={option.id} className="mt-0.5" />
                    <span className="flex min-w-0 flex-col gap-1 break-words">
                      <span className="text-base font-bold text-ink">
                        {option.name}
                      </span>
                      <span className="text-[12.5px] leading-[1.5] text-moss">
                        {option.address}
                        <br />
                        Post Code: {option.postcode}
                      </span>
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </fieldset>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-4">
              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">
                  Full name *
                </span>
                <Input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  placeholder="Enter your name"
                />
                <FieldError id="name-error" message={errors.name} />
              </Label>

              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">
                  Phone number *
                </span>
                <Input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Enter your phone number"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                <FieldError id="phone-error" message={errors.phone} />
              </Label>
            </div>

            <Label className="flex flex-col items-start gap-1.5">
              <span className="text-sm font-medium text-ink">
                Which specialist service? *
              </span>
              <Select
                value={form.service}
                onValueChange={(value) => set("service", value)}
              >
                <SelectTrigger
                  aria-label="Which specialist service?"
                  aria-invalid={Boolean(errors.service)}
                  aria-describedby={
                    errors.service ? "service-error" : undefined
                  }
                  className="w-full"
                >
                  <SelectValue placeholder="Choose a specialist" />
                </SelectTrigger>
                <SelectContent>
                  {bookableServices.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError id="service-error" message={errors.service} />
            </Label>

            {form.service === OTHER_SERVICE ? (
              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">
                  Which service do you need? *
                </span>
                <Input
                  value={form.otherService}
                  onChange={(e) => set("otherService", e.target.value)}
                  placeholder="Tell us what you would like to be seen for"
                  aria-invalid={Boolean(errors.otherService)}
                  aria-describedby={
                    errors.otherService ? "otherService-error" : undefined
                  }
                />
                <FieldError
                  id="otherService-error"
                  message={errors.otherService}
                />
              </Label>
            ) : null}

            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-4">
              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">
                  Preferred date *
                </span>
                <Input
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  type="date"
                  min={today}
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={errors.date ? "date-error" : undefined}
                />
                <FieldError id="date-error" message={errors.date} />
              </Label>

              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">
                  Preferred time *
                </span>
                <Input
                  value={form.time}
                  onChange={(e) => set("time", e.target.value)}
                  type="time"
                  aria-invalid={Boolean(errors.time)}
                  aria-describedby={errors.time ? "time-error" : undefined}
                />
                <FieldError id="time-error" message={errors.time} />
              </Label>
            </div>

            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
              <legend className="mb-2 text-sm font-semibold text-ink">
                Are you paying through an HMO?
              </legend>
              <RadioGroup
                aria-label="Are you paying through an HMO?"
                value={form.usesHmo ? "yes" : "no"}
                onValueChange={(value) => set("usesHmo", value === "yes")}
                className="grid grid-cols-[repeat(auto-fit,minmax(min(160px,100%),1fr))] gap-2"
              >
                {[
                  { value: "no", label: "No, I will pay cash" },
                  { value: "yes", label: "Yes, I have an HMO" },
                ].map((option) => (
                  <Label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border p-3.5 transition-colors",
                      (form.usesHmo ? "yes" : "no") === option.value
                        ? "border-primary-600 bg-primary-50"
                        : "border-border hover:border-primary-400",
                    )}
                  >
                    <RadioGroupItem value={option.value} />
                    <span className="text-base font-medium break-words text-ink">
                      {option.label}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </fieldset>

            {form.usesHmo ? (
              <>
                <Label className="flex flex-col items-start gap-1.5">
                  <span className="text-sm font-medium text-ink">
                    Which HMO are you covered by? *
                  </span>
                  <Input
                    id="hmoProvider"
                    value={form.hmoProvider}
                    onChange={(e) => set("hmoProvider", e.target.value)}
                    list="dcl-hmo-plans"
                    placeholder="Start typing your HMO name"
                    className="w-full"
                    aria-invalid={Boolean(errors.hmoProvider)}
                    aria-describedby={
                      errors.hmoProvider ? "hmoProvider-error" : undefined
                    }
                  />
                  <datalist id="dcl-hmo-plans">
                    {hmoPlans.map((plan) => (
                      <option key={plan} value={plan} />
                    ))}
                  </datalist>
                  <FieldError
                    id="hmoProvider-error"
                    message={errors.hmoProvider}
                  />
                </Label>

                <Label className="flex flex-col items-start gap-1.5">
                  <span className="text-sm font-medium text-ink">
                    HMO enrollee ID *
                  </span>
                  <Input
                    value={form.enrolleeId}
                    onChange={(e) => set("enrolleeId", e.target.value)}
                    placeholder="Enter your enrolee ID"
                    aria-invalid={Boolean(errors.enrolleeId)}
                    aria-describedby={
                      errors.enrolleeId ? "enrolleeId-error" : undefined
                    }
                  />
                  <FieldError
                    id="enrolleeId-error"
                    message={errors.enrolleeId}
                  />
                  <span className="text-[12.5px] leading-[1.6] text-moss">
                    We use it to confirm your cover before your appointment.
                  </span>
                </Label>
              </>
            ) : null}

            <Label className="flex flex-col items-start gap-1.5">
              <span className="text-sm font-medium text-ink">
                Anything else?{" "}
                <span className="text-[12.5px] font-normal text-moss">
                  (optional)
                </span>
              </span>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
                placeholder="A short note about what you need to see the specialist for..."
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
