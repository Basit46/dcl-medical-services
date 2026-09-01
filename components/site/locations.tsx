import { BranchMap } from "@/components/site/branch-map";
import { branches } from "@/lib/clinic";

export function Locations() {
  return (
    <section id="locations" className="mx-auto max-w-[1080px] px-5 py-14">
      <h2 className="m-0 mb-2 font-display text-4xl font-normal">Our branches</h2>
      <p className="m-0 mb-6 max-w-[48ch] text-[15px] leading-[1.7] text-moss">
        Both branches are open to walk-ins and appointments.
      </p>

      <BranchMap />

      <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[26px]">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="border border-ink/15 bg-surface p-[22px] shadow-plate"
          >
            <span className="text-[11px] tracking-[0.18em] uppercase text-pine">
              {branch.index}
            </span>
            <h3 className="mt-1.5 mb-2.5 font-body text-2xl font-bold">{branch.name}</h3>
            <p className="m-0 mb-3 text-[14.5px] leading-[1.7] text-slate">{branch.address}</p>
            <a href={branch.tel.href} className="tnum text-[15px] text-pine">
              {branch.tel.label}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
