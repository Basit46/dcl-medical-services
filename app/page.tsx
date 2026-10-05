import { About } from "@/components/site/about";
import { ChatProvider } from "@/components/site/chat";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Gallery } from "@/components/site/gallery";
import { Hero } from "@/components/site/hero";
import { Hmo } from "@/components/site/hmo";
import { Locations } from "@/components/site/locations";
import { Testimonials } from "@/components/site/reviews";
import { Services } from "@/components/site/services";
import { clinicJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <ChatProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(clinicJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <div className="w-full max-w-full overflow-x-hidden">
        <SiteHeader />
        <main>
          <Hero />
          <Services />
          <About />
          <Hmo />
          <Gallery />
          <Testimonials />
          <Locations />
        </main>
        <SiteFooter />
      </div>
    </ChatProvider>
  );
}
