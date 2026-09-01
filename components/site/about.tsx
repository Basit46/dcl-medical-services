import { clinic } from "@/lib/clinic";

const stats = [
  { value: "2", label: "Branches across Lagos" },
  { value: "70+", label: "HMO plans accepted" },
  { value: "11", label: "Clinical services on site" },
];

export function About() {
  return (
    <section id="about" className="border-y border-ink/15 bg-fog">
      <div className="mx-auto grid max-w-[1080px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10 px-5 py-14">
        <div>
          <h2 className="m-0 mb-4 font-display text-4xl font-normal">About the clinic</h2>
          <p className="m-0 mb-3.5 text-[15.5px] leading-[1.8] hyphens-auto text-justify text-slate">
            {clinic.name}, known to many of its patients simply as {clinic.familiarName}, has
            served families in Ketu and Iju Ishaga for two decades. What began as a small
            general practice has grown into two branches offering maternity, laboratory, scan,
            surgery and specialist consultation, staffed by doctors and nurses who know their
            patients by name.
          </p>
          <p className="m-0 text-[15.5px] leading-[1.8] hyphens-auto text-justify text-slate">
            Our commitment is unchanged: careful, unhurried attention, honest advice about what
            treatment is needed, and a clinic where cost and cover are explained plainly before
            anything begins. We care; God heals.
          </p>
        </div>

        <div className="flex flex-col self-start border border-ink/15">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`p-5 ${i < stats.length - 1 ? "border-b border-ink/15" : ""}`}
            >
              <div className="tnum font-body text-[34px] text-pine">{stat.value}</div>
              <div className="text-[13px] tracking-[0.04em] text-moss">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
