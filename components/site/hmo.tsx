import { ChatTrigger } from "@/components/site/chat";
import { callBothBranches, clinic, hmoPlans } from "@/lib/clinic";

export function Hmo() {
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
            HMO plans accepted
          </h2>
        </div>

        <p className="m-0 mb-7 max-w-[54ch] text-[15px] leading-[1.7] text-cream">
          If your employer or family plan is with a registered HMO, there is a
          strong chance we are on the list. Our hospitals in Ketu and
          Iju-Ishaga are HMO-accepted hospitals in Lagos, with 70+ plans
          covered.
        </p>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-px border border-white/20 bg-white/20">
          {hmoPlans.map((plan) => (
            <div
              key={plan}
              className="bg-primary-900 px-[18px] py-4 text-sm text-surface"
            >
              {plan}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
