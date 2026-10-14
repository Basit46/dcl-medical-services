import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { clinic, site } from "@/lib/clinic";
import { Analytics } from "@vercel/analytics/next";
import { AnnouncementBanner } from "@/components/site/announcement-banner";
import { HmoPlansProvider } from "@/components/site/hmo-plans-provider";
import { getActiveAnnouncement } from "@/sanity/lib/announcement";
import { getHmoPlans } from "@/sanity/lib/hmos";

const frankRuhlLibre = Frank_Ruhl_Libre({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-frank-ruhl-libre",
});

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-atkinson-hyperlegible",
});

const title = site.title;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s · ${clinic.name}`,
  },
  description: site.description,
  applicationName: clinic.name,
  generator: "Next.js",
  keywords: [...site.keywords],
  authors: [{ name: clinic.legalName }],
  creator: clinic.legalName,
  publisher: clinic.legalName,
  category: "health",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: clinic.name,
    title,
    description: site.description,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  referrer: "origin-when-cross-origin",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EFF6FF" },
    { media: "(prefers-color-scheme: dark)", color: "#143A6B" },
  ],
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const announcement = await getActiveAnnouncement();
  const hmoPlans = await getHmoPlans();

  return (
    <html
      lang="en-NG"
      className={cn(
        "h-full antialiased",
        frankRuhlLibre.variable,
        atkinsonHyperlegible.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-paper font-body text-ink">
        <AnnouncementBanner announcement={announcement} />
        <HmoPlansProvider plans={hmoPlans}>{children}</HmoPlansProvider>

        <Analytics />
      </body>
    </html>
  );
}
