import { ChatTrigger } from "@/components/site/chat";
import { callBothBranches, clinic, hmoPlans } from "@/lib/clinic";

export function Hmo() {
  return (
    <section id="hmo" className="border-t border-ink/15 bg-forest text-surface">
      <div className="mx-auto max-w-[1080px] px-5 pt-13 pb-14">
        <div className="mb-2 flex flex-wrap items-baseline gap-3.5">
          <span className="tnum font-body text-[clamp(52px,12vw,72px)] leading-none text-gold">
            {clinic.hmoCount}
          </span>
          <h2 className="m-0 font-display text-[34px] font-normal text-surface">
            HMO plans accepted
          </h2>
        </div>

        <p className="m-0 mb-7 max-w-[54ch] text-[15px] leading-[1.7] text-cream">
          If your employer or family plan is with a registered HMO, there is a strong chance we
          are on the list. A few of the plans we see most often:
        </p>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-px border border-white/20 bg-white/20">
          {hmoPlans.map((plan) => (
            <div key={plan} className="bg-forest px-[18px] py-4 text-sm text-surface">
              {plan}
            </div>
          ))}
        </div>

        <div className="mt-[26px] flex flex-wrap items-center gap-4">
          <ChatTrigger
            intent="hmo"
            className="min-h-[46px] border border-gold px-[22px] py-3.5 text-base font-bold whitespace-nowrap text-gold hover:bg-gold/15"
          >
            Check my HMO
          </ChatTrigger>
          <span className="text-[13px] text-sage">
            Or call your branch — {callBothBranches} — with your plan name and card number.
          </span>
        </div>
      </div>
    </section>
  );
}
