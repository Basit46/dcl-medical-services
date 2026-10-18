import type { Metadata } from "next";
import { ChatProvider } from "@/components/site/chat";
import { HmoDirectory } from "@/components/site/hmo-directory";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { clinic } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "HMOs we accept",
  description: `Search the full list of HMOs accepted at ${clinic.name}, our 24-hour hospital in Ketu and Iju-Ishaga, Lagos. ${clinic.hmoCount} HMOs covered.`,
  alternates: { canonical: "/hmo" },
};

export default function HmoPage() {
  return (
    <ChatProvider>
      <div className="w-full max-w-full overflow-x-hidden">
        <SiteHeader />
        <main className="min-h-[60vh]">
          <HmoDirectory />
        </main>
        <SiteFooter />
      </div>
    </ChatProvider>
  );
}