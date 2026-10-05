import { branches, clinic, services } from "@/lib/clinic";

const stats = [
  { value: String(branches.length), label: "Clinic units" },
  { value: "70+", label: "HMO plans accepted" },
  { value: String(services.length), label: "Service areas" },
];

export function About() {
  return (
    <section id="about" className="border-y border-ink/15 bg-surface">
      <div className="mx-auto grid max-w-[1250px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10 px-5 py-14">
        <div>
          <h2 className="m-0 mb-4 font-display text-4xl font-normal">
            About the clinic
          </h2>
          <p className="m-0 mb-3.5 text-[15.5px] leading-[1.8] hyphens-auto text-justify text-slate">
            {clinic.name} was established as {clinic.legalName} in{" "}
            {clinic.establishedMonth} {clinic.established}. Our units serve
            patients in Ketu and Iju-Ishaga, Lagos.
          </p>
          <p className="m-0 text-[15.5px] leading-[1.8] hyphens-auto text-justify text-slate">
            {clinic.workforceDescription}
          </p>
        </div>

        <div className="flex flex-col self-start border border-ink/15">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`p-5 ${i < stats.length - 1 ? "border-b border-ink/15" : ""}`}
            >
              <div className="tnum font-body text-[34px] text-pine">
                {stat.value}
              </div>
              <div className="text-[13px] tracking-[0.04em] text-moss">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
