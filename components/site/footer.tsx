import { branches, clinic } from "@/lib/clinic";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-ink/15 bg-forest text-surface">
      <div className="mx-auto max-w-[1080px] px-5 pt-14 pb-10">
        <h2 className="m-0 mb-1.5 font-display text-4xl font-normal text-surface">Contact us</h2>
        <p className="m-0 mb-8 text-xl tracking-[0.03em] text-gold">{clinic.tagline}</p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8 border-b border-white/20 pb-8">
          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] tracking-[0.18em] uppercase text-fern">Speak to us</span>
            {branches.map((branch) => (
              <a
                key={branch.id}
                href={branch.tel.href}
                className="tnum text-[22px] text-gold no-underline"
              >
                {branch.name} — {branch.tel.label}
              </a>
            ))}
            <a href={clinic.directorLine.href} className="tnum text-[14.5px] text-cream">
              Medical Director&rsquo;s line — {clinic.directorLine.label}
            </a>
            <a href={`mailto:${clinic.email}`} className="text-[14.5px] text-cream">
              {clinic.email}
            </a>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] tracking-[0.18em] uppercase text-fern">Social</span>
            <a href="https://facebook.com/Dejiclinic" className="text-[14.5px] text-cream">
              Facebook — @Dejiclinic
            </a>
            <a href="https://instagram.com/Dejiclinic" className="text-[14.5px] text-cream">
              Instagram — @Dejiclinic
            </a>
          </div>

          {branches.map((branch) => (
            <div key={branch.id} className="flex flex-col gap-2.5">
              <span className="text-[11px] tracking-[0.18em] uppercase text-fern">
                {branch.name} branch
              </span>
              <span className="text-[14.5px] leading-[1.6] text-cream">
                {branch.address}
                <br />
                {branch.tel.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-between gap-3 pt-6 text-xs text-fern">
          <span>
            {clinic.name} · {clinic.familiarName}
          </span>
          <span>Over 70 HMO plans accepted</span>
        </div>
      </div>
    </footer>
  );
}
