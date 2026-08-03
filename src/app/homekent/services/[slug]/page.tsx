import { HomeKentCtaBanner } from "@/components/homekent/HomeKentCtaBanner";
import {
  HOMEKENT_NAME,
  HOMEKENT_PHONE,
  homekentTelHref,
} from "@/lib/homekent/brand";
import {
  getAllHomeKentLandingPages,
  getHomeKentLandingPage,
} from "@/lib/homekent/landing-pages";
import { hkPath } from "@/lib/homekent/paths";
import { homekentCanonicalUrl } from "@/lib/homekent/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllHomeKentLandingPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getHomeKentLandingPage(slug);
  if (!page) return {};

  const canonical = await homekentCanonicalUrl(`/services/${slug}`);

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: HOMEKENT_NAME,
      locale: "en_GB",
      type: "website",
    },
  };
}

export default async function HomeKentServiceLandingPage({ params }: Props) {
  const { slug } = await params;
  const page = getHomeKentLandingPage(slug);
  if (!page) notFound();

  const home = await hkPath();
  const quote = `${home}#quote`;

  return (
    <>
      <article className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            href={home}
            className="text-sm font-semibold text-homekent-navy/70 hover:text-homekent-gold"
          >
            ← {HOMEKENT_NAME}
          </Link>

          <h1 className="mt-6 font-serif text-3xl font-bold text-homekent-navy sm:text-4xl">
            {page.h1}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-homekent-muted">
            {page.description}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {page.highlights.map((item) => (
              <li
                key={item}
                className="rounded-full border border-homekent-navy/10 bg-white px-3 py-1 text-xs font-semibold text-homekent-navy"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={quote}
              className="rounded bg-homekent-gold px-7 py-3 text-sm font-bold uppercase tracking-wide text-homekent-navy shadow-md hover:bg-homekent-gold-light"
            >
              Get a Free Quote
            </a>
            <a
              href={`tel:${homekentTelHref()}`}
              className="rounded border-2 border-homekent-navy px-7 py-3 text-sm font-bold uppercase tracking-wide text-homekent-navy hover:bg-homekent-navy hover:text-white"
            >
              Call {HOMEKENT_PHONE}
            </a>
          </div>

          <div className="mt-12 space-y-8">
            {page.sections.map((section) => (
              <section key={section.heading ?? section.paragraphs[0]}>
                {section.heading ? (
                  <h2 className="font-serif text-xl font-bold text-homekent-navy">
                    {section.heading}
                  </h2>
                ) : null}
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 text-base leading-relaxed text-homekent-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </article>
      <HomeKentCtaBanner />
    </>
  );
}
