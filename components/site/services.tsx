import { services } from "@/lib/clinic";

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-[1080px] px-5 py-14">
      <h2 className="m-0 mb-2 font-display text-4xl font-normal">Services</h2>
      <p className="m-0 mb-7 max-w-[48ch] text-[15px] leading-[1.7] text-moss">
        Everyday care and specialist attention, available at both branches unless stated
        otherwise.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-[26px]">
        {services.map((service) => (
          <div
            key={service.num}
            className="flex min-h-32 flex-col gap-1.5 border border-ink/15 bg-surface p-5 shadow-plate hover:border-pine"
          >
            <span className="tnum text-[11px] tracking-[0.16em] text-pine">{service.num}</span>
            <h3 className="m-0 font-body text-[21px] font-bold">{service.name}</h3>
            <p className="m-0 text-[13.5px] leading-[1.6] text-moss">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
