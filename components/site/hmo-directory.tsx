"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useHmoPlans } from "@/components/site/hmo-plans-provider";
import { filterHmoPlans } from "@/lib/hmo-search";
import { callBothBranches, clinic } from "@/lib/clinic";

export function HmoDirectory() {
  const plans = useHmoPlans();
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const visiblePlans = useMemo(
    () => filterHmoPlans(plans, query),
    [plans, query],
  );

  return (
    <section className="mx-auto max-w-[1250px] px-5 py-12 sm:py-16">
      <Link
        href="/#hmo"
        className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold tracking-[0.05em] text-pine no-underline hover:underline"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to the clinic
      </Link>

      <h1 className="m-0 mb-3 font-display text-[clamp(38px,7vw,64px)] leading-[1.02] font-normal tracking-[-0.03em] text-primary-900">
        HMO plans we accept
      </h1>
      <p className="m-0 mb-8 max-w-[62ch] text-[16px] leading-[1.75] text-primary-800">
        Search the full list to check whether your plan is covered at our Ketu
        and Iju-Ishaga branches. If you cannot see it here, call{" "}
        {callBothBranches} and the front desk will confirm.
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="w-full sm:max-w-sm">
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search plans, e.g. Leadway"
            aria-label="Search accepted HMO plans"
            className="h-12"
          />
        </div>

        {trimmed ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="min-h-11 text-sm font-bold tracking-[0.05em] text-pine underline underline-offset-4 hover:text-forest"
          >
            Clear
          </button>
        ) : null}
      </div>

      {visiblePlans.length > 0 ? (
        <>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-px border border-ink/15 bg-ink/15 p-0">
            {visiblePlans.map((plan) => (
              <li
                key={plan}
                className="bg-white px-[18px] py-4 text-[15px] text-ink"
              >
                {plan}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="border border-ink/15 px-[18px] py-10 text-[15px] leading-[1.7] text-ink">
          <p className="m-0 mb-3">No plan matches “{trimmed}”.</p>
          <p className="m-0 text-slate">
            It may still be covered under a different name. Call{" "}
            {callBothBranches} with your membership card and we will confirm
            before you visit.
          </p>
        </div>
      )}
    </section>
  );
}
