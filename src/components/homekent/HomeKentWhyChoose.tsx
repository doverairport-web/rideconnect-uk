import { HOMEKENT_NAME } from "@/lib/homekent/brand";
import { HOMEKENT_WHY_CHOOSE } from "@/lib/homekent/content";

export function HomeKentWhyChoose() {
  return (
    <section id="about" className="border-y border-homekent-navy/8 bg-homekent-cream py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-homekent-navy sm:text-4xl">
            Why Choose{" "}
            <span className="text-homekent-gold">{HOMEKENT_NAME}</span>?
          </h2>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-homekent-gold" />
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {HOMEKENT_WHY_CHOOSE.map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-homekent-gold/15 text-homekent-gold">
                <ShieldIcon />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-homekent-navy">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-homekent-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2l8 3v6c0 5.5-3.8 9.7-8 11-4.2-1.3-8-5.5-8-11V5l8-3zm-1 13.2l5.5-5.5-1.4-1.4L11 12.4 8.9 10.3 7.5 11.7 11 15.2z"
      />
    </svg>
  );
}
