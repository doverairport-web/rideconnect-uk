import { HOMEKENT_TESTIMONIALS } from "@/lib/homekent/content";

export function HomeKentTestimonials() {
  return (
    <section id="testimonials" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center font-serif text-3xl font-bold text-homekent-navy sm:text-4xl">
          What Our Clients Say
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {HOMEKENT_TESTIMONIALS.map((item) => (
            <blockquote
              key={item.author}
              className="rounded-xl border border-homekent-navy/8 bg-white p-6 shadow-sm"
            >
              <div className="flex gap-0.5 text-homekent-gold" aria-label="5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className="mt-4 text-sm italic leading-relaxed text-homekent-muted">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-4 text-sm font-semibold text-homekent-navy">
                — {item.author}, {item.location}
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-2" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-homekent-gold" />
          <span className="h-2 w-2 rounded-full bg-homekent-navy/20" />
          <span className="h-2 w-2 rounded-full bg-homekent-navy/20" />
        </div>
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
      <path
        fill="currentColor"
        d="M8 1.5l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 5.8l4-.6L8 1.5z"
      />
    </svg>
  );
}
