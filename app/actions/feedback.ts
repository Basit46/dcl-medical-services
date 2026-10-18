"use server";

import { escapeHtml, sendClinicEmail } from "@/lib/brevo";
import {
  branchOptions,
  contactLabels,
  discussedLabels,
  feedbackSchema,
} from "@/lib/feedback-form";

export type FeedbackActionResult = {
  status: "idle" | "success" | "error";
  message: string;
  fields?: Partial<Record<string, string>>;
};

const text = (formData: FormData, key: string) =>
  (formData.get(key) ?? "").toString().trim();

function formatGender(gender: string): string {
  return gender.charAt(0) + gender.slice(1).toLowerCase();
}

function row(label: string, value: string) {
  return `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>${escapeHtml(
    label,
  )}</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(
    value,
  )}</td></tr>`;
}

export async function submitFeedback(
  _prev: { status: "idle" | "success" | "error"; message: string },
  formData: FormData,
): Promise<FeedbackActionResult> {
  if (text(formData, "website")) {
    return { status: "success", message: "Thank you!" };
  }

  const rawData = {
    email: text(formData, "email"),
    branch: text(formData, "branch"),
    phone: text(formData, "phone"),
    visitDate: text(formData, "visitDate"),
    visitTime: text(formData, "visitTime"),
    surname: text(formData, "surname"),
    firstName: text(formData, "firstName"),
    hmo: text(formData, "hmo"),
    gender: text(formData, "gender"),
    suggestionComplaint: text(formData, "suggestionComplaint"),
    discussedWithStaff: text(formData, "discussedWithStaff"),
    contactMethod: text(formData, "contactMethod"),
    improvementSuggestion: text(formData, "improvementSuggestion"),
  };

  const parsed = feedbackSchema.safeParse(rawData);
  if (!parsed.success) {
    const fields: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fields[field]) {
        fields[field] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fields,
    };
  }

  const data = parsed.data;
  const branchName =
    branchOptions.find((option) => option.value === data.branch)?.label ??
    data.branch.toUpperCase();

  const htmlContent = `
    <h2>Suggestions/Service Complaints Form</h2>
    <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
      ${row("Email*", data.email)}
      ${row("Branch Visited*", branchName)}
      ${row("PHONE NO/WHATSAPP NO*", data.phone)}
      ${row("Date of Clinic visit*", data.visitDate)}
      ${row("Time of visit*", data.visitTime)}
      ${row("SURNAME*", data.surname)}
      ${row("FIRST NAME*", data.firstName)}
      ${row("YOUR HMO [IF NOT CASH PAYING CUSTOMER]", data.hmo || "N/A")}
      ${row("GENDER", formatGender(data.gender))}
      ${row(
        "WHAT SUGGESTION OR COMPLAINTS DO YOU HAVE ABOUT HOW YOU WERE SERVED?*",
        data.suggestionComplaint,
      )}
      ${row(
        "WERE YOU ABLE TO DISCUSS IT WITH THE HEAD NURSE OR THE DR ON DUTY*",
        discussedLabels[data.discussedWithStaff],
      )}
      ${row("HOW BEST CAN YOU BE REACHED*", contactLabels[data.contactMethod])}
      ${row(
        "WHAT SUGGESTIONS DO YOU HAVE FOR SERVICE IMPROVEMENT AT DCL MEDICAL SERVICES?",
        data.improvementSuggestion || "N/A",
      )}
    </table>
    <p style="margin-top: 16px; font-size: 12px; color: #666;">Replies will go to ${escapeHtml(
      data.email,
    )}.</p>
  `;

  const result = await sendClinicEmail({
    subject: `New Feedback from ${data.firstName} ${data.surname} - ${branchName}`,
    htmlContent,
    replyTo: {
      email: data.email,
      name: `${data.firstName} ${data.surname}`,
    },
  });

  if (!result.ok) {
    return {
      status: "error",
      message:
        "We could not send your feedback just now. Please try again in a moment.",
    };
  }

  return {
    status: "success",
    message: "Thank you! Your feedback has been sent successfully.",
  };
}
