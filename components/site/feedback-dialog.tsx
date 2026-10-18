"use client";

import { useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, LoaderCircle, LucideSendHorizonal } from "lucide-react";
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
import { callBothBranches } from "@/lib/clinic";
import {
  branchOptions,
  contactOptions,
  discussedOptions,
  feedbackSchema,
  genderOptions,
  initialFeedbackFormValues,
  type FeedbackFormValues,
} from "@/lib/feedback-form";
import { cn } from "@/lib/utils";

type ChoiceField = "gender" | "discussedWithStaff" | "contactMethod" | "branch";

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col items-start gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-red-700">
            {" "}
            *
          </span>
        ) : (
          <span className="ml-1.5 text-[12.5px] font-normal text-moss">
            (optional)
          </span>
        )}
      </label>
      {children}
      {error ? (
        <span id={errorId} role="alert" className="text-[12.5px] text-red-700">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function ChoiceFieldset({
  name,
  legend,
  required,
  error,
  options,
  control,
}: {
  name: ChoiceField;
  legend: string;
  required?: boolean;
  error?: string;
  options: readonly { value: string; label: string }[];
  control: ReturnType<typeof useForm<FeedbackFormValues>>["control"];
}) {
  const errorId = `${name}-error`;
  return (
    <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
      <legend className="mb-1.5 text-sm font-medium text-ink">
        {legend}
        {required ? (
          <span aria-hidden="true" className="text-red-700">
            {" "}
            *
          </span>
        ) : null}
      </legend>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            id={name}
            name={name}
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className="grid grid-cols-3 gap-2"
          >
            {options.map((option) => (
              <Label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border p-3.5 transition-colors",
                  field.value === option.value
                    ? "border-primary-600 bg-primary-50"
                    : "border-border hover:border-primary-400",
                )}
              >
                <RadioGroupItem value={option.value} />
                <span className="text-base font-medium text-ink">
                  {option.label}
                </span>
              </Label>
            ))}
          </RadioGroup>
        )}
      />
      {error ? (
        <span id={errorId} role="alert" className="text-[12.5px] text-red-700">
          {error}
        </span>
      ) : null}
    </fieldset>
  );
}

export function FeedbackDialog({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [serverError, setServerError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const {
    control,
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
      setServerError("");
      reset(initialFeedbackFormValues);
    }
  };

  const startAnother = () => {
    setShowSuccess(false);
    setServerError("");
    reset(initialFeedbackFormValues);
  };

  const onSubmit = async (data: FeedbackFormValues) => {
    setServerError("");
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value ?? "");
    }
    formData.append("website", honeypot);

    const result = await submitFeedback(
      { status: "idle", message: "" },
      formData,
    );

    if (result.status === "success") {
      setSubmittedName(`${data.firstName} ${data.surname}`.trim());
      setShowSuccess(true);
      return;
    }

    if (result.fields) {
      let firstField: keyof FeedbackFormValues | null = null;
      for (const [field, message] of Object.entries(result.fields)) {
        setError(field as keyof FeedbackFormValues, {
          type: "server",
          message,
        });
        firstField ??= field as keyof FeedbackFormValues;
      }
      if (firstField) setServerError(result.message);
      return;
    }

    setServerError(result.message);
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" size="lg" className="h-12 text-base gap-2">
            <LucideSendHorizonal className="size-4" />
            Send Feedback
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="gap-0 p-0 sm:max-w-[640px] max-h-[90dvh] overflow-hidden">
        <DialogHeader className="flex-none border-b border-border bg-primary-50 px-5 py-5 pr-14 sm:px-6">
          <DialogTitle className="font-display text-[26px] leading-tight font-normal text-primary-900">
            Send Feedback
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-[1.6] text-primary-800">
            Share your suggestions or complaints about your visit. Fields marked{" "}
            <span className="font-bold">*</span> are required. Your feedback
            goes straight to our management team.
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
                feedback has been received.
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
            noValidate
            className="flex flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-6"
          >
            {serverError ? (
              <p
                role="alert"
                className="m-0 border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800"
              >
                {serverError}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="email"
                label="Email"
                required
                error={errors.email?.message}
              >
                <Input
                  id="email"
                  {...register("email")}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </Field>

              <Field
                id="branch"
                label="Branch visited"
                required
                error={errors.branch?.message}
              >
                <Controller
                  name="branch"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      onOpenChange={(next) => {
                        if (!next) field.onBlur();
                      }}
                    >
                      <SelectTrigger
                        id="branch"
                        aria-invalid={Boolean(errors.branch)}
                        aria-describedby={
                          errors.branch ? "branch-error" : undefined
                        }
                        className="w-full"
                      >
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
                  )}
                />
              </Field>
            </div>

            <Field
              id="phone"
              label="Phone / WhatsApp number"
              required
              error={errors.phone?.message}
            >
              <Input
                id="phone"
                {...register("phone")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="08012345678"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="visitDate"
                label="Date of clinic visit"
                required
                error={errors.visitDate?.message}
              >
                <Input
                  id="visitDate"
                  {...register("visitDate")}
                  type="date"
                  max={today}
                  autoComplete="off"
                  aria-invalid={Boolean(errors.visitDate)}
                  aria-describedby={
                    errors.visitDate ? "visitDate-error" : undefined
                  }
                />
              </Field>

              <Field
                id="visitTime"
                label="Time of visit"
                required
                error={errors.visitTime?.message}
              >
                <Input
                  id="visitTime"
                  {...register("visitTime")}
                  type="time"
                  autoComplete="off"
                  aria-invalid={Boolean(errors.visitTime)}
                  aria-describedby={
                    errors.visitTime ? "visitTime-error" : undefined
                  }
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="surname"
                label="Surname"
                required
                error={errors.surname?.message}
              >
                <Input
                  id="surname"
                  {...register("surname")}
                  autoComplete="family-name"
                  aria-invalid={Boolean(errors.surname)}
                  aria-describedby={
                    errors.surname ? "surname-error" : undefined
                  }
                />
              </Field>

              <Field
                id="firstName"
                label="First name"
                required
                error={errors.firstName?.message}
              >
                <Input
                  id="firstName"
                  {...register("firstName")}
                  autoComplete="given-name"
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={
                    errors.firstName ? "firstName-error" : undefined
                  }
                />
              </Field>
            </div>

            <Field id="hmo" label="Your HMO" error={errors.hmo?.message}>
              <Input
                id="hmo"
                {...register("hmo")}
                autoComplete="off"
                placeholder="If you did not pay cash, e.g. AXA Mansard"
              />
            </Field>

            <ChoiceFieldset
              name="gender"
              legend="Gender"
              required
              options={genderOptions}
              control={control}
              error={errors.gender?.message}
            />

            <Field
              id="suggestionComplaint"
              label="What suggestions or complaints do you have about how you were served?"
              required
              error={errors.suggestionComplaint?.message}
            >
              <Textarea
                id="suggestionComplaint"
                {...register("suggestionComplaint")}
                rows={4}
                placeholder="Describe your experience, suggestion or complaint..."
                aria-invalid={Boolean(errors.suggestionComplaint)}
                aria-describedby={
                  errors.suggestionComplaint
                    ? "suggestionComplaint-error"
                    : undefined
                }
                className="min-h-[100px] resize-y"
              />
            </Field>

            <ChoiceFieldset
              name="discussedWithStaff"
              legend="Were you able to discuss it with the head nurse or the doctor on duty?"
              required
              options={discussedOptions}
              control={control}
              error={errors.discussedWithStaff?.message}
            />

            <ChoiceFieldset
              name="contactMethod"
              legend="How best can you be reached?"
              required
              options={contactOptions}
              control={control}
              error={errors.contactMethod?.message}
            />

            <Field
              id="improvementSuggestion"
              label="What suggestions do you have for service improvement at DCL Medical Services?"
              error={errors.improvementSuggestion?.message}
            >
              <Textarea
                id="improvementSuggestion"
                {...register("improvementSuggestion")}
                rows={3}
                placeholder="Anything else that would help us improve..."
                className="min-h-[80px] resize-y"
              />
            </Field>

            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
            />

            <Button
              type="submit"
              size="lg"
              className="h-12 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle aria-hidden className="animate-spin" />
                  Sending…
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
            <p className="m-0 text-center text-[12.5px] leading-[1.6] text-moss">
              Your feedback is emailed to our management team, and they reply to
              the email address you gave above.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
