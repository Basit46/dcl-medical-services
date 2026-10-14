import { defineQuery } from "next-sanity";
import { hmoPlans } from "@/lib/clinic";
import { sanityClient, sanityConfigured } from "./client";

type SanityHmo = {
  name?: string;
};

const hmosQuery = defineQuery(
  `*[_type == "hmo" && defined(name) && name != ""] | order(name asc){name}`,
);

export async function getHmoPlans(): Promise<string[]> {
  if (!sanityConfigured || !sanityClient) return hmoPlans;

  try {
    const documents = await sanityClient.fetch<SanityHmo[]>(
      hmosQuery,
      {},
      { next: { revalidate: 60, tags: ["sanity:hmos"] } },
    );
    const plans = documents
      .map((document) => document.name?.trim())
      .filter((name): name is string => Boolean(name));
    return plans.length ? plans : hmoPlans;
  } catch {
    return hmoPlans;
  }
}