import { director } from "@/lib/clinic";

export function Director() {
  return (
    <section id="director" className="mx-auto max-w-[1080px] px-5 py-14">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-center gap-10">
        <div className="flex h-[340px] w-full max-w-[320px] items-center justify-center border border-ink/15 bg-fog p-6 text-center">
          <span className="text-[13px] leading-[1.6] tracking-[0.04em] text-sage">
            Photograph of {director.name}
          </span>
        </div>

        <div>
          <span className="text-[11px] tracking-[0.2em] uppercase text-pine">
            {director.role}
          </span>
          <h2 className="mt-2.5 mb-4 font-display text-4xl font-normal">{director.name}</h2>
          <p className="m-0 mb-3.5 max-w-[46ch] text-[15.5px] leading-[1.8] text-pretty text-slate">
            {director.bio}
          </p>
          <p className="m-0 max-w-[46ch] text-[15.5px] leading-[1.8] text-moss">
            {director.note}
          </p>
        </div>
      </div>
    </section>
  );
}
