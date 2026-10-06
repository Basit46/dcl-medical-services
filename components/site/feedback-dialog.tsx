"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  LoaderCircle,
  LucideSendHorizonal,
  X,
} from "lucide-react";
import { submitFeedback } from "@/app/actions/feedback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { branches, callBothBranches } from "@/lib/clinic";
import {
  feedbackSchema,
  initialFeedbackFormValues,
  type FeedbackFormValues,
} from "@/lib/feedback-form";
import { cn } from "@/lib/utils";

const genderOptions = [
  { value: "MALE", label: "MALE" },
  { value: "FEMALE", label: "FEMALE" },
  { value: "OTHERS", label: "OTHERS" },
] as const;

const discussedOptions = [
  { value: "YES", label: "YES" },
  { value: "NO", label: "NO" },
  { value: "NOT_INTERESTED", label: "I AM NOT INTERESTED" },
] as const;

const contactOptions = [
  { value: "WHATSAPP", label: "WHATSAPP NO" },
  { value: "SMS", label: "SMS" },
  { value: "EMAIL", label: "E MAIL" },
] as const;

const branchOptions = branches.map((b) => ({
  value: b.id,
  label: b.id === "ketu" ? "DOYIN OMOLOLU KETU" : "AGBADO RD IJU-ISHAGA",
}));

export function FeedbackDialog() {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: initialFeedbackFormValues,
  });

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setShowSuccess(false);
      reset(initialFeedbackFormValues);
    }
  };

  const startAnother = () => {
    setShowSuccess(false);
    reset(initialFeedbackFormValues);
  };

  const onSubmit = async (data: FeedbackFormValues) => {
    setPending(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await submitFeedback(
        { status: "idle", message: "" },
        formData,
      );

      if (result.status === "success") {
        setSubmittedName(`${data.firstName} ${data.surname}`);
        setShowSuccess(true);
      } else {
        setError("suggestionComplaint", {
          type: "server",
          message: result.message,
        });
      }
    } finally {
      setPending(false);
    }
  };

  const renderRadioGroup = (
    options: readonly { value: string; label: string }[],
    name: keyof FeedbackFormValues,
  ) => (
    <RadioGroup
      aria-label={name}
      {...register(name)}
      className="grid grid-cols-3 gap-2"
    >
      {options.map((option) => (
        <Label
          key={option.value}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-lg border p-3.5 transition-colors",
            "border-border hover:border-primary-400",
          )}
        >
          <RadioGroupItem value={option.value} className="mt-0.5" />
          <span className="text-base font-medium text-ink">{option.label}</span>
        </Label>
      ))}
    </RadioGroup>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="h-12 text-base gap-2">
          <LucideSendHorizonal className="size-4" />
          Send Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 p-0 sm:max-w-[640px] max-h-[90dvh] overflow-hidden">
        <DialogHeader className="flex-none border-b border-border bg-primary-50 px-5 py-5 pr-14 sm:px-6">
          <DialogTitle className="font-display text-[26px] leading-tight font-normal text-primary-900">
            Send Feedback
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-[1.6] text-primary-800">
            Share your suggestions or complaints about your visit. Your feedback
            helps us improve.
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <div className="flex flex-col gap-5 px-5 py-8 sm:px-6">
            <p className="m-0 flex items-start gap-3 text-[15.5px] leading-[1.7] text-slate">
              <CheckCircle
                aria-hidden
                className="mt-0.5 size-5 shrink-0 text-primary-600"
              />
              <span>
                <strong>Thank you, {submittedName || "friend"}.</strong> Your
                feedback has been received. If we can help you with anything,
                call {callBothBranches}.
              </span>
            </p>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 text-base"
              onClick={startAnother}
            >
              Send another feedback
            </Button>
            <DialogClose asChild>
              <Button type="button" className="h-12 text-base">
                Close
              </Button>
            </DialogClose>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">Email *</span>
                <Input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && (
                  <span className="text-[12.5px] text-red-700">
                    {errors.email.message}
                  </span>
                )}
              </Label>

              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">
                  Branch Visited *
                </span>
                <Select {...register("branch")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branch && (
                  <span className="text-[12.5px] text-red-700">
                    {errors.branch.message}
                  </span>
                )}
              </Label>
            </div>

            <Label className="flex flex-col items-start gap-1.5">
              <span className="text-sm font-medium text-ink">
                PHONE NO/WHATSAPP NO *
              </span>
              <Input
                {...register("phone")}
                type="tel"
                autoComplete="tel"
                placeholder="08012345678"
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone && (
                <span className="text-[12.5px] text-red-700">
                  {errors.phone.message}
                </span>
              )}
            </Label>

            <div className="grid gap-4 sm:grid-cols-2">
              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">
                  Date of Clinic visit *
                </span>
                <Input
                  {...register("visitDate")}
                  type="date"
                  autoComplete="off"
                  aria-invalid={Boolean(errors.visitDate)}
                />
                {errors.visitDate && (
                  <span className="text-[12.5px] text-red-700">
                    {errors.visitDate.message}
                  </span>
                )}
              </Label>

              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">
                  Time of visit *
                </span>
                <Input
                  {...register("visitTime")}
                  type="time"
                  autoComplete="off"
                  aria-invalid={Boolean(errors.visitTime)}
                />
                {errors.visitTime && (
                  <span className="text-[12.5px] text-red-700">
                    {errors.visitTime.message}
                  </span>
                )}
              </Label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">SURNAME *</span>
                <Input
                  {...register("surname")}
                  autoComplete="family-name"
                  aria-invalid={Boolean(errors.surname)}
                />
                {errors.surname && (
                  <span className="text-[12.5px] text-red-700">
                    {errors.surname.message}
                  </span>
                )}
              </Label>

              <Label className="flex flex-col items-start gap-1.5">
                <span className="text-sm font-medium text-ink">
                  FIRST NAME *
                </span>
                <Input
                  {...register("firstName")}
                  autoComplete="given-name"
                  aria-invalid={Boolean(errors.firstName)}
                />
                {errors.firstName && (
                  <span className="text-[12.5px] text-red-700">
                    {errors.firstName.message}
                  </span>
                )}
              </Label>
            </div>

            <Label className="flex flex-col items-start gap-1.5">
              <span className="text-sm font-medium text-ink">
                YOUR HMO [IF NOT CASH PAYING CUSTOMER]
              </span>
              <Input
                {...register("hmo")}
                autoComplete="off"
                placeholder="e.g., Hygeia HMO, AXA Mansard, etc."
              />
            </Label>

            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
              <legend className="mb-2 text-sm font-semibold text-ink">
                GENDER
              </legend>
              {renderRadioGroup(genderOptions, "gender")}
              {errors.gender && (
                <span className="text-[12.5px] text-red-700">
                  {errors.gender.message}
                </span>
              )}
            </fieldset>

            <Label className="flex flex-col items-start gap-1.5">
              <span className="text-sm font-medium text-ink">
                WHAT SUGGESTION OR COMPLAINTS DO YOU HAVE ABOUT HOW YOU WERE
                SERVED? *
              </span>
              <Textarea
                {...register("suggestionComplaint")}
                rows={4}
                placeholder="Describe your experience, suggestion, or complaint..."
                aria-invalid={Boolean(errors.suggestionComplaint)}
                className="min-h-[100px] resize-y"
              />
              {errors.suggestionComplaint && (
                <span className="text-[12.5px] text-red-700">
                  {errors.suggestionComplaint.message}
                </span>
              )}
            </Label>

            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
              <legend className="mb-2 text-sm font-semibold text-ink">
                WERE YOU ABLE TO DISCUSS IT WITH THE HEAD NURSE OR THE DR ON
                DUTY
              </legend>
              {renderRadioGroup(discussedOptions, "discussedWithStaff")}
              {errors.discussedWithStaff && (
                <span className="text-[12.5px] text-red-700">
                  {errors.discussedWithStaff.message}
                </span>
              )}
            </fieldset>

            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
              <legend className="mb-2 text-sm font-semibold text-ink">
                HOW BEST CAN YOU BE REACHED *
              </legend>
              {renderRadioGroup(contactOptions, "contactMethod")}
              {errors.contactMethod && (
                <span className="text-[12.5px] text-red-700">
                  {errors.contactMethod.message}
                </span>
              )}
            </fieldset>

            <Label className="flex flex-col items-start gap-1.5">
              <span className="text-sm font-medium text-ink">
                WHAT SUGGESTIONS DO YOU HAVE FOR SERVICE IMPROVEMENT AT DCL
                MEDICAL SERVICES?
              </span>
              <Textarea
                {...register("improvementSuggestion")}
                rows={3}
                placeholder="Optional: Any additional suggestions for improvement..."
                className="min-h-[80px] resize-y"
              />
            </Label>

            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
            />

            <Button
              type="submit"
              size="lg"
              className="h-12 text-base"
              disabled={pending || isSubmitting}
            >
              {pending || isSubmitting ? (
                <>
                  <LoaderCircle aria-hidden className="animate-spin" />
                  Sending…
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
            <p className="m-0 text-center text-[12.5px] leading-[1.6] text-moss">
              A copy of your responses will be emailed to the address that you
              provided.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
