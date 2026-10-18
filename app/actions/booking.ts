"use server";

import { escapeHtml, htmlRow, sendClinicEmail } from "@/lib/brevo";
import { branches, clinic, OTHER_SERVICE } from "@/lib/clinic";

export type AppointmentRequest = {
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

const clean = (value: unknown) => (typeof value === "string" ? value.trim() : "");

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
    .replace(/\s?([ap])m/i, (_, meridiem: string) => ` ${meridiem.toLowerCase()}m`);
}

export async function submitAppointmentRequest(
  data: AppointmentRequest,
) {
  const name = clean(data.name);
  const phone = clean(data.phone);
  const date = clean(data.date);
  const time = clean(data.time);

  if (!name || phone.length < 10 || !date || !time) {
    return { ok: false as const, error: "Incomplete appointment request." };
  }

  const branch = branches.find((item) => item.id === data.branchId) ?? branches[0];
  const service =
    data.service === OTHER_SERVICE
      ? `${OTHER_SERVICE}: ${clean(data.otherService)}`
      : clean(data.service);

  const htmlContent = `
    <h2>Specialist Appointment Request</h2>
    <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
      ${htmlRow("Branch*", branch.name)}
      ${htmlRow("Name*", name)}
      ${htmlRow("Phone number*", phone)}
      ${htmlRow("Service*", service)}
      ${htmlRow("Preferred date*", formatDate(date))}
      ${htmlRow("Preferred time*", formatTime(time))}
      ${htmlRow("Paying through HMO", data.usesHmo ? "YES" : "NO")}
      ${htmlRow("HMO provider", data.usesHmo ? clean(data.hmoProvider) || "N/A" : "N/A")}
      ${htmlRow("HMO enrollee ID", data.usesHmo ? clean(data.enrolleeId) || "N/A" : "N/A")}
      ${htmlRow("Notes", clean(data.notes) || "N/A")}
    </table>
    <p style="margin-top: 16px; font-size: 12px; color: #666;">
      Submitted from the ${escapeHtml(clinic.name)} website. Call ${escapeHtml(
        branch.name,
      )} on ${escapeHtml(branch.tel.label)} to confirm.
    </p>
  `;

  const result = await sendClinicEmail({
    subject: `Appointment request from ${name} - ${branch.name}`,
    htmlContent,
  });

  return result.ok
    ? { ok: true as const }
    : { ok: false as const, error: result.error };
}