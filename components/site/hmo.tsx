"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clinic } from "@/lib/clinic";
import { Input } from "@/components/ui/input";
import { useHmoPlans } from "@/components/site/hmo-plans-provider";
import { filterHmoPlans } from "@/lib/hmo-search";

export function Hmo() {
  const plans = useHmoPlans();
  const [query, setQuery] = useState("");

  const trimmed = query.trim();

  const visiblePlans = useMemo(
    () => (trimmed ? filterHmoPlans(plans, query) : []),
    [plans, query, trimmed],
  );

  return (
    <section
      id="hmo"
      className="border-t border-ink/15 bg-primary-900 text-surface"
    >
      <div className="mx-auto max-w-[1250px] px-5 pt-13 pb-14">
        <div className="mb-2 flex flex-wrap items-baseline gap-3.5">
          <span className="tnum font-body text-[clamp(52px,12vw,72px)] leading-none text-primary-300">
            {clinic.hmoCount}
          </span>
          <h2 className="m-0 font-display text-[34px] font-normal text-surface">
            HMOs accepted
          </h2>
        </div>

        <p className="m-0 mb-7 max-w-[54ch] text-[15px] leading-[1.7] text-cream">
          If your employer or family cover is with a registered HMO, there is a
          strong chance we are on the list. Our hospitals in Ketu and Iju-Ishaga
          are HMO-accepted hospitals in Lagos, with 70+ HMOs covered.
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:max-w-sm">
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search HMOs e.g.leadway"
              aria-label="Search accepted HMOs"
              className="h-12 border-white/40 bg-transparent text-surface shadow-none placeholder:text-white/45 focus-visible:border-white/70 focus-visible:ring-white/25"
            />
          </div>
          {trimmed ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="min-h-11 text-sm font-bold tracking-[0.05em] text-surface underline underline-offset-4 hover:text-primary-300"
            >
              Clear
            </button>
          ) : null}
        </div>

        {trimmed ? (
          visiblePlans.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-px border border-white/20 bg-white/20">
              {visiblePlans.map((plan) => (
                <div
                  key={plan}
                  className="bg-primary-900 px-[18px] py-4 text-sm text-surface"
                >
                  {plan}
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-white/20 px-[18px] py-8 text-sm text-cream">
              No HMOs match “{trimmed}”. Call either branch and we will confirm
              your HMO before you visit.
            </div>
          )
        ) : null}

        <Link
          href="/hmo"
          className="mt-6 inline-flex min-h-11 items-center gap-2 border border-white/40 px-5 py-3 text-sm font-bold tracking-[0.05em] text-surface no-underline hover:bg-white/10"
        >
          View full list
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </section>
  );
}
