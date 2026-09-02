import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { clinic, site } from "@/lib/clinic";
import { Analytics } from "@vercel/analytics/next";

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

const title = `${clinic.name} — ${clinic.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s · ${clinic.name}`,
  },
  description: site.description,
  applicationName: clinic.name,
  generator: "Next.js",
  keywords: [
    "DCL Medical Services",
    "Deji Clinic",
    "clinic in Ketu",
    "clinic in Iju Ishaga",
    "hospital in Lagos",
    "HMO accepted Lagos",
    "maternity Lagos",
    "antenatal care Ketu",
    "ultrasound scan Lagos",
    "medical laboratory Lagos",
    "general practice Lagos",
  ],
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
    { media: "(prefers-color-scheme: light)", color: "#F3F5EF" },
    { media: "(prefers-color-scheme: dark)", color: "#1F3D33" },
  ],
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
        {children}

        <Analytics />
      </body>
    </html>
  );
}
