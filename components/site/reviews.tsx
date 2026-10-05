import { testimonials } from "@/lib/clinic";
import { FeedbackDialog } from "@/components/site/feedback-dialog";

function TestimonialCard({ quote, who }: { quote: string; who: string }) {
  return (
    <figure className="m-0 flex flex-col gap-3 border border-ink/15 bg-surface p-6 shadow-plate">
      <blockquote className="m-0 text-[15.5px] leading-[1.75] text-pretty text-ink">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <figcaption className="mt-auto flex items-baseline gap-x-2 border-t border-ink/12 pt-3.5 text-[13px] tracking-[0.03em] text-moss">
        <span className="font-bold text-ink">{who}</span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="border-y border-ink/15 bg-surface">
      <div className="mx-auto max-w-[1250px] px-5 py-14">
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="m-0 mb-2 font-display text-4xl font-normal">
              What our patients say
            </h2>
            <p className="m-0 max-w-[48ch] text-[15px] leading-[1.7] text-moss">
              In their own words, from families who have been coming to us for
              years.
            </p>
          </div>
          <FeedbackDialog />
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[26px]">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}