"use server";

import { feedbackSchema } from "@/lib/feedback-form";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FEEDBACK_EMAIL = "dejiclinic2005@yahoo.com";

function formatBranchName(branchId: string): string {
  const branchNames: Record<string, string> = {
    ketu: "DOYIN OMOLOLU KETU",
    iju: "AGBADO RD IJU-ISHAGA",
  };
  return branchNames[branchId] || branchId.toUpperCase();
}

function formatGender(gender: string): string {
  return gender.charAt(0) + gender.slice(1).toLowerCase();
}

function formatContactMethod(method: string): string {
  const methods: Record<string, string> = {
    WHATSAPP: "WHATSAPP NO",
    SMS: "SMS",
    EMAIL: "E MAIL",
  };
  return methods[method] || method;
}

function formatDiscussedWithStaff(value: string): string {
  const options: Record<string, string> = {
    YES: "YES",
    NO: "NO",
    NOT_INTERESTED: "I AM NOT INTERESTED",
  };
  return options[value] || value;
}

export async function submitFeedback(
  _prev: { status: "idle" | "success" | "error"; message: string },
  formData: FormData,
): Promise<{ status: "idle" | "success" | "error"; message: string }> {
  const rawData = {
    email: formData.get("email") as string,
    branch: formData.get("branch") as string,
    phone: formData.get("phone") as string,
    visitDate: formData.get("visitDate") as string,
    visitTime: formData.get("visitTime") as string,
    surname: formData.get("surname") as string,
    firstName: formData.get("firstName") as string,
    hmo: (formData.get("hmo") as string) || "",
    gender: formData.get("gender") as string,
    suggestionComplaint: formData.get("suggestionComplaint") as string,
    discussedWithStaff: formData.get("discussedWithStaff") as string,
    contactMethod: formData.get("contactMethod") as string,
    improvementSuggestion:
      (formData.get("improvementSuggestion") as string) || "",
  };

  const parsed = feedbackSchema.safeParse(rawData);
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields." };
  }

  const data = parsed.data;

  const htmlContent = `
    <h2>Suggestions/Service Complaints Form</h2>
    <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email*</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Branch Visited*</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formatBranchName(data.branch)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>PHONE NO/WHATSAPP NO*</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.phone}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Date of Clinic visit*</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.visitDate}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Time of visit*</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.visitTime}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>SURNAME*</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.surname}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>FIRST NAME*</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.firstName}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>YOUR HMO [IF NOT CASH PAYING CUSTOMER]</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.hmo || "N/A"}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>GENDER</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formatGender(data.gender)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>WHAT SUGGESTION OR COMPLAINTS DO YOU HAVE ABOUT HOW YOU WERE SERVED?*</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.suggestionComplaint}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>WERE YOU ABLE TO DISCUSS IT WITH THE HEAD NURSE OR THE DR ON DUTY</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formatDiscussedWithStaff(data.discussedWithStaff)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>HOW BEST CAN YOU BE REACHED*</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formatContactMethod(data.contactMethod)}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>WHAT SUGGESTIONS DO YOU HAVE FOR SERVICE IMPROVEMENT AT DCL MEDICAL SERVICES?</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.improvementSuggestion || "N/A"}</td></tr>
    </table>
    <p style="margin-top: 16px; font-size: 12px; color: #666;">A copy of your responses will be emailed to the address that you provided.</p>
  `;

  if (!BREVO_API_KEY) {
    return {
      status: "error",
      message: "Email service is not configured. Please try again later.",
    };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          email: FEEDBACK_EMAIL,
          name: "DCL Medical Services Feedback",
        },
        to: [{ email: FEEDBACK_EMAIL, name: "DCL Medical Services" }],
        subject: `New Feedback from ${data.firstName} ${data.surname} - ${formatBranchName(data.branch)}`,
        htmlContent,
        replyTo: {
          email: data.email,
          name: `${data.firstName} ${data.surname}`,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Brevo API error:", error);
      throw new Error("Failed to send email");
    }

    return {
      status: "success",
      message: "Thank you! Your feedback has been sent successfully.",
    };
  } catch (error) {
    console.error("Failed to send feedback email:", error);
    return {
      status: "error",
      message:
        "We could not send your feedback just now. Please try again in a moment.",
    };
  }
}
