import { z } from "zod";
import { branches } from "@/lib/clinic";

export const genderValues = ["MALE", "FEMALE", "OTHERS"] as const;
export const discussedValues = ["YES", "NO", "NOT_INTERESTED"] as const;
export const contactValues = ["WHATSAPP", "SMS", "EMAIL"] as const;

export const discussedLabels: Record<
  (typeof discussedValues)[number],
  string
> = {
  YES: "YES",
  NO: "NO",
  NOT_INTERESTED: "I AM NOT INTERESTED",
};

export const contactLabels: Record<(typeof contactValues)[number], string> = {
  WHATSAPP: "WHATSAPP NO",
  SMS: "SMS",
  EMAIL: "E MAIL",
};

const branchLabels: Record<string, string> = {
  ketu: "DOYIN OMOLOLU KETU",
  iju: "AGBADO RD IJU-ISHAGA",
};

export const branchValues = branches.map((branch) => branch.id) as [
  string,
  ...string[],
];

export const branchOptions = branches.map((branch) => ({
  value: branch.id,
  label: branchLabels[branch.id] ?? branch.name.toUpperCase(),
}));

export const genderOptions = genderValues.map((value) => ({
  value,
  label: value,
}));

export const discussedOptions = discussedValues.map((value) => ({
  value,
  label: discussedLabels[value],
}));

export const contactOptions = contactValues.map((value) => ({
  value,
  label: contactLabels[value],
}));

const requiredText = (label: string, min = 1) =>
  z.string().trim().min(min, `${label} is required.`);

export const feedbackSchema = z.object({
  email: z.email("Please enter a valid email address."),
  branch: z.enum(branchValues, { error: "Please choose the branch you visited." }),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid phone/WhatsApp number.")
    .max(20, "Please enter a valid phone/WhatsApp number."),
  visitDate: requiredText("The date of your visit"),
  visitTime: requiredText("The time of your visit"),
  surname: requiredText("Surname"),
  firstName: requiredText("First name"),
  hmo: z.string().trim().optional(),
  gender: z.enum(genderValues, { error: "Please choose your gender." }),
  suggestionComplaint: z
    .string()
    .trim()
    .min(10, "Please describe your suggestion or complaint (at least 10 characters)."),
  discussedWithStaff: z.enum(discussedValues, {
    error: "Please tell us whether you discussed this with staff.",
  }),
  contactMethod: z.enum(contactValues, {
    error: "Please choose how we can reach you.",
  }),
  improvementSuggestion: z.string().trim().optional(),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export const initialFeedbackFormValues: FeedbackFormValues = {
  email: "",
  branch: branches[0].id,
  phone: "",
  visitDate: "",
  visitTime: "",
  surname: "",
  firstName: "",
  hmo: "",
  gender: "MALE",
  suggestionComplaint: "",
  discussedWithStaff: "NO",
  contactMethod: "WHATSAPP",
  improvementSuggestion: "",
};