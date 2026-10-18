import { clinic } from "@/lib/clinic";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = "hassanbasitope@12359773.brevosend.com";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function htmlRow(label: string, value: string) {
  return `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>${escapeHtml(
    label,
  )}</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(
    value,
  )}</td></tr>`;
}

export type ClinicEmail = {
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name: string };
};

export async function sendClinicEmail({
  subject,
  htmlContent,
  replyTo,
}: ClinicEmail) {
  if (!BREVO_API_KEY) {
    return { ok: false as const, error: "Email service is not configured." };
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
          email: SENDER_EMAIL,
          name: `${clinic.name} Feedback`,
        },
        to: [{ email: clinic.email, name: clinic.name }],
        subject,
        htmlContent,
        replyTo,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error(`Brevo rejected the email (${response.status}).`, {
        subject,
        recipient: clinic.email,
        detail,
      });
      return {
        ok: false as const,
        error: `Brevo responded with ${response.status}`,
      };
    }

    const result = await response.json().catch(() => null);
    console.info("Email accepted by Brevo.", {
      subject,
      recipient: clinic.email,
      messageId: result?.messageId,
    });

    return { ok: true as const };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { ok: false as const, error: "Failed to send email" };
  }
}