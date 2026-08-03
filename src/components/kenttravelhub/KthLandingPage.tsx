import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
import type { KthLandingPage } from "@/lib/kenttravelhub/landing-pages";
import { primaryPhone, telHref } from "@/lib/contact";
import Link from "next/link";

type Props = {
  page: KthLandingPage;
};

export async function KthLandingPageView({ page }: Props) {
  const book = await kthBookUrl(page.bookUtm);
  const hub = await kthPath();

  return (
    <article className="py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href={hub}
          className="text-sm font-semibold text-kth-sea hover:text-kth-navy"
        >
          ← Kent Travel Hub
        </Link>

        <h1 className="mt-6 font-serif text-3xl font-bold text-kth-navy sm:text-4xl">
          {page.h1}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-kth-muted">
          {page.excerpt}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {page.highlights.map((item) => (
            <li
              key={item}
              className="rounded-full border border-kth-sea/25 bg-kth-sand px-3 py-1 text-xs font-semibold text-kth-navy"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-xl bg-kth-navy p-6 text-white sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wider text-kth-accent">
            RideConnect UK
          </p>
          <p className="mt-2 text-white/85">
            Book online now — licensed Dover district private hire with fixed
            guide fares.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={book}
              className="rounded-full bg-kth-accent px-7 py-3 text-sm font-bold text-white hover:bg-kth-accent-dark"
            >
              Book this transfer
            </Link>
            <a
              href={`tel:${telHref(primaryPhone)}`}
              className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Call {primaryPhone}
            </a>
          </div>
        </div>

        <div className="mt-10 space-y-8">
          {page.sections.map((section, index) => (
            <section key={index}>
              {section.heading && (
                <h2 className="font-serif text-2xl font-bold text-kth-navy">
                  {section.heading}
                </h2>
              )}
              <div className={`space-y-4 ${section.heading ? "mt-4" : ""}`}>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="leading-relaxed text-kth-muted">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={book}
            className="inline-flex rounded-full bg-kth-accent px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-kth-accent-dark"
          >
            Book with RideConnect UK →
          </Link>
        </div>
      </div>
    </article>
  );
}
