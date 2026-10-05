import { defineQuery } from "next-sanity";
import { sanityClient, sanityConfigured } from "./client";

export type SiteAnnouncement = {
  id: string;
  title: string;
  message: string;
  expiresAt: string | null;
};

type SanityAnnouncement = {
  _id: string;
  _updatedAt: string;
  title?: string;
  message?: string;
  active?: boolean;
  duration?: "24hours" | "3days" | "7days" | "1month" | "indefinite";
};

const latestAnnouncementQuery = defineQuery(
  `*[_type == "announcement"] | order(_createdAt desc)[0]{_id, _updatedAt, title, message, active, duration}`,
);

function getExpiry(
  createdAt: string,
  duration: SanityAnnouncement["duration"],
) {
  if (!duration || duration === "indefinite") return null;

  const expiry = new Date(createdAt);
  if (duration === "24hours")
    expiry.setTime(expiry.getTime() + 24 * 60 * 60 * 1000);
  if (duration === "3days")
    expiry.setTime(expiry.getTime() + 3 * 24 * 60 * 60 * 1000);
  if (duration === "7days")
    expiry.setTime(expiry.getTime() + 7 * 24 * 60 * 60 * 1000);
  if (duration === "1month") expiry.setUTCMonth(expiry.getUTCMonth() + 1);
  return expiry.toISOString();
}

export async function getActiveAnnouncement(): Promise<SiteAnnouncement | null> {
  if (!sanityConfigured || !sanityClient) return null;

  try {
    const latest = await sanityClient.fetch<SanityAnnouncement | null>(
      latestAnnouncementQuery,
      {},
      { next: { revalidate: 60, tags: ["sanity:announcement"] } },
    );

    if (!latest?.active || !latest.title?.trim() || !latest.message?.trim()) {
      return null;
    }

    const expiresAt = getExpiry(latest._updatedAt, latest.duration);
    if (expiresAt && Date.now() >= new Date(expiresAt).getTime()) return null;

    return {
      id: latest._id,
      title: latest.title.trim(),
      message: latest.message.trim(),
      expiresAt,
    };
  } catch {
    return null;
  }
}
