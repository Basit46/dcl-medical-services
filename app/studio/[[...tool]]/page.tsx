import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { sanityConfigured } from "@/sanity/lib/client";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      <main className="grid min-h-dvh place-items-center bg-primary-50 px-6 py-12">
        <div className="max-w-lg rounded-2xl border border-primary-100 bg-white p-8 shadow-panel">
          <p className="m-0 mb-2 text-xs font-bold tracking-[0.16em] text-primary-600 uppercase">
            Sanity setup needed
          </p>
          <h1 className="m-0 mb-3 font-display text-3xl font-normal text-primary-900">
            Connect your content project
          </h1>
          <p className="m-0 leading-relaxed text-primary-800">
            Add your Sanity project ID to the local environment configuration,
            then restart the site to open the article editor here.
          </p>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
