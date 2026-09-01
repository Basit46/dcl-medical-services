import { BookingDialog } from "@/components/site/booking-dialog";
import { ChatTrigger } from "@/components/site/chat";
import { branches, clinic } from "@/lib/clinic";

const highlights = [
  "General Practice",
  "Maternity",
  "Scan",
  "Lab",
  "Surgery",
  "Walk-ins welcome",
];

export function Hero() {
  return (
    <section
      id="top"
      className="border-b border-ink/15 bg-linear-to-b from-mist to-paper"
    >
      <div className="mx-auto grid max-w-[1080px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-12 px-5 pt-15 pb-14">
        <div>
          <h1 className="m-0 mb-[22px] max-w-[14ch] font-display text-[clamp(38px,8.5vw,56px)] leading-[1.03] font-normal tracking-[-0.02em] text-forest">
            A clinic your family can trust.
          </h1>

          <p className="m-0 mb-6 border-l-[3px] border-gold pl-4 text-[27px] leading-[1.2] tracking-[0.03em] text-forest">
            {clinic.tagline}
          </p>

          <p className="m-0 mb-8 max-w-[46ch] text-[17px] leading-[1.75] text-pretty text-slate">
            General practice, maternity, laboratory, scan and surgery under one
            roof — with over 70 HMO plans accepted at both branches.
          </p>

          <div className="flex flex-wrap gap-3">
            <BookingDialog>
              <button
                type="button"
                className="inline-flex min-h-[50px] items-center border border-gold bg-gold px-[26px] py-[15px] text-[17px] font-bold whitespace-nowrap text-ink hover:bg-gold-deep"
              >
                Book Appointment
              </button>
            </BookingDialog>
            <ChatTrigger
              intent="book"
              className="min-h-[50px] border border-ink/30 px-[26px] py-[15px] text-[17px] font-bold whitespace-nowrap text-ink hover:bg-ink/5"
            >
              Chat with Us
            </ChatTrigger>
          </div>

          <div className="mt-[30px] flex flex-wrap gap-x-[18px] gap-y-2 border-t border-ink/15 pt-5 text-[12.5px] tracking-[0.06em] text-moss">
            {highlights.map((item, i) => (
              <span key={item} className="contents">
                {i > 0 && <span className="text-gold">·</span>}
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="border border-ink/15">
          <div className="flex items-baseline gap-3 border-b border-ink/12 bg-gold/15 px-[22px] py-5">
            <span className="tnum text-[34px] leading-none text-forest">
              {clinic.hmoCount}
            </span>
            <span className="text-sm leading-[1.5] text-slate">
              HMO plans accepted at both branches
            </span>
          </div>

          {branches.map((branch) => (
            <div
              key={branch.id}
              className="flex flex-col gap-1 border-b border-ink/12 px-[22px] py-5"
            >
              <span className="text-[11px] tracking-[0.18em] uppercase text-sage">
                {branch.name}
              </span>
              <span className="text-[14.5px] leading-[1.6] text-ink">
                {branch.address}
              </span>
            </div>
          ))}

          {branches.map((branch, i) => (
            <a
              key={branch.id}
              href={branch.tel.href}
              className={`flex items-center justify-between gap-3 px-[22px] py-4 text-pine no-underline hover:bg-pine/5 ${
                i === 0 ? "border-b border-ink/12" : ""
              }`}
            >
              <span className="text-[11px] tracking-[0.18em] uppercase text-sage">
                Call {branch.name}
              </span>
              <span className="tnum text-xl">{branch.tel.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
