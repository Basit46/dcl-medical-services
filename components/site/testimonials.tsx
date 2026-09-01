import { testimonials } from "@/lib/clinic";

export function Testimonials() {
  return (
    <section id="testimonials" className="border-y border-ink/15 bg-mist">
      <div className="mx-auto max-w-[1080px] px-5 py-14">
        <h2 className="m-0 mb-2 font-display text-4xl font-normal">What our patients say</h2>
        <p className="m-0 mb-7 max-w-[48ch] text-[15px] leading-[1.7] text-moss">
          In their own words, from families who have been coming to us for years.
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[26px]">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.who}
              className="m-0 flex flex-col gap-4 border border-ink/15 bg-surface p-6 shadow-plate"
            >
              <span aria-hidden className="text-[40px] leading-[0.6] text-pine">
                &ldquo;
              </span>
              <blockquote className="m-0 text-[15.5px] leading-[1.75] text-pretty text-ink">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-auto border-t border-ink/12 pt-3.5 text-[13px] tracking-[0.03em] text-moss">
                {testimonial.who}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
