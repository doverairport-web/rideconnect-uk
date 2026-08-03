import {
  HOMEKENT_EMAIL,
  HOMEKENT_PHONE,
  homekentTelHref,
} from "@/lib/homekent/brand";

export function HomeKentCtaBanner() {
  return (
    <section className="bg-homekent-navy py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-homekent-gold/20 text-homekent-gold">
            <CalendarIcon />
          </span>
          <div>
            <p className="max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
              <span className="font-semibold text-white">Ready for a Cleaner Home?</span>{" "}
              Get in touch today for a free quote — we&apos;d love to help!
            </p>
            <p className="mt-2 text-sm text-white/70">
              <a
                href={`tel:${homekentTelHref()}`}
                className="font-medium text-homekent-gold hover:underline"
              >
                {HOMEKENT_PHONE}
              </a>
              <span className="mx-2 text-white/40">·</span>
              <a
                href={`mailto:${HOMEKENT_EMAIL}`}
                className="font-medium text-homekent-gold hover:underline"
              >
                {HOMEKENT_EMAIL}
              </a>
            </p>
          </div>
        </div>
        <a
          href="#quote"
          className="shrink-0 rounded bg-homekent-gold px-7 py-3 text-sm font-bold uppercase tracking-wide text-homekent-navy transition hover:bg-homekent-gold-light"
        >
          Get a Free Quote
        </a>
      </div>
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path
        fill="currentColor"
        d="M7 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zm12 8H5v10h14V10z"
      />
    </svg>
  );
}
