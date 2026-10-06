import {
  appointmentClinics,
  clinicSchedules,
  labOpeningHours,
  services,
} from "@/lib/clinic";

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-[1250px] px-5 py-14">
      <h2 className="m-0 mb-2 font-display text-4xl font-normal">
        Hospital services
      </h2>
      <p className="m-0 mb-7 max-w-[48ch] text-[15px] leading-[1.7] text-moss">
        Explore the care available at our hospitals in Ketu and Iju-Ishaga,
        Lagos.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-[26px]">
        {services.map((service) => (
          <div
            key={service.num}
            className="flex min-h-32 flex-col gap-1.5 border border-ink/15 bg-surface p-5 shadow-plate hover:border-pine"
          >
            <span className="tnum text-[11px] tracking-[0.16em] text-pine">
              {service.num}
            </span>
            <h3 className="m-0 font-body text-[21px] font-bold">
              {service.name}
            </h3>
            <p className="m-0 text-[13.5px] leading-[1.6] text-moss">
              {service.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-8 border-t border-ink/15 pt-10 lg:grid-cols-[1.5fr_0.8fr]">
        <div>
          <h3 className="m-0 mb-4 font-display text-3xl font-normal">
            Clinic schedules
          </h3>
          <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px border border-ink/15 bg-ink/15">
            {clinicSchedules.map((clinic) => (
              <div key={clinic.name} className="bg-surface p-4">
                <dt className="font-bold text-ink">{clinic.name}</dt>
                <dd className="m-0 mt-1.5 text-sm leading-[1.6] text-moss">
                  {clinic.details}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <h4 className="m-0 mb-4 font-display text-3xl font-normal">
              Laboratory opening hours
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              {labOpeningHours.map((location) => (
                <div
                  key={location.branch}
                  className="border border-primary-100 bg-white p-5 shadow-plate"
                >
                  <h5 className="m-0 mb-4 text-base font-bold text-primary-800">
                    {location.branch} branch
                  </h5>
                  <dl className="m-0 flex flex-col gap-3">
                    {location.hours.map((hours) => (
                      <div
                        key={hours.days}
                        className="flex flex-wrap justify-between gap-x-3 gap-y-1 border-b border-primary-50 pb-2 last:border-0 last:pb-0"
                      >
                        <dt className="text-sm text-primary-700">
                          {hours.days}
                        </dt>
                        <dd className="m-0 text-sm font-semibold text-ink">
                          {hours.time}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {location.note && (
                    <p className="m-0 mt-4 text-xs leading-[1.6] text-moss">
                      {location.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
