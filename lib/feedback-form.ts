import { z } from "zod";
import { branches } from "@/lib/clinic";

const branchIds = branches.map((b) => b.id) as [string, ...string[]];

export const feedbackSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  branch: z.enum(branchIds),
  phone: z.string().min(10, "Please enter a valid phone/WhatsApp number."),
  visitDate: z.string().min(1, "Please select the date of your visit."),
  visitTime: z.string().min(1, "Please select the time of your visit."),
  surname: z.string().min(1, "Surname is required."),
  firstName: z.string().min(1, "First name is required."),
  hmo: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
  suggestionComplaint: z.string().min(10, "Please describe your suggestion or complaint (at least 10 characters)."),
  discussedWithStaff: z.enum(["YES", "NO", "NOT_INTERESTED"]),
  contactMethod: z.enum(["WHATSAPP", "SMS", "EMAIL"]),
  improvementSuggestion: z.string().optional(),
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