"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SiteAnnouncement } from "@/sanity/lib/announcement";

export function AnnouncementBanner({
  announcement,
}: {
  announcement: SiteAnnouncement | null;
}) {
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const [expiryTime, setExpiryTime] = useState(0);
  const pathname = usePathname();

  const onStudio =
    pathname === "/studio" || pathname?.startsWith("/studio/") === true;

  useEffect(() => {
    if (!announcement?.expiresAt) return;
    const remainingMs = Date.parse(announcement.expiresAt) - Date.now();
    const timeout = window.setTimeout(
      () => setExpiryTime(Date.now()),
      Math.max(0, remainingMs),
    );
    return () => window.clearTimeout(timeout);
  }, [announcement?.expiresAt]);

  const expiresAt = announcement?.expiresAt
    ? Date.parse(announcement.expiresAt)
    : null;
  const expired = expiresAt !== null && expiryTime >= expiresAt;

  if (onStudio) return null;

  return (
    <Dialog
      open={Boolean(
        announcement && dismissedId !== announcement.id && !expired,
      )}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && announcement) setDismissedId(announcement.id);
      }}
    >
      <DialogContent className="gap-0 p-0 sm:max-w-[480px]">
        {announcement && (
          <>
            <DialogHeader className="border-b border-primary-100 bg-primary-50 px-6 py-6 pr-14 sm:px-8 sm:py-7">
              <p className="m-0 text-[10px] font-bold tracking-[0.18em] text-primary-600 uppercase">
                DCL Medical Services
              </p>
              <DialogTitle className="mt-1 font-display text-3xl leading-tight font-normal text-primary-900">
                {announcement.title}
              </DialogTitle>
            </DialogHeader>
            <div className="px-6 py-6 sm:px-8">
              <DialogDescription className="text-[15px] leading-[1.8] text-primary-800">
                {announcement.message}
              </DialogDescription>
              <DialogFooter className="mt-7">
                <DialogClose asChild>
                  <Button type="button" className="min-w-28">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
