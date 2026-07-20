import {
  getAllNetworkTransferPages,
  getNetworkTransferPage,
} from "@/lib/rideconnect/transfer-pages";
import {
  getRideConnectSiteForRequest,
} from "@/lib/rideconnect/page-metadata";
import { rideConnectMetadata } from "@/lib/rideconnect/seo";
import { primaryPhone, telHref } from "@/lib/contact";
import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllNetworkTransferPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getNetworkTransferPage(slug);
  if (!page) return {};

  const host = (await headers()).get("host");
  const site = await getRideConnectSiteForRequest();
  const base = rideConnectMetadata(site, host, `/transfers/${slug}`);

  return {
    ...base,
    title: page.title,
    description: page.description,
    openGraph: {
      ...base.openGraph,
      title: page.title,
      description: page.description,
    },
    twitter: {
      ...base.twitter,
      title: page.title,
      description: page.description,
    },
  };
}

export default async function NetworkTransferLandingPage({ params }: Props) {
  const { slug } = await params;
  const page = getNetworkTransferPage(slug);
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <Link
        href="/"
        className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
      >
        ← Home
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {page.h1}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        {page.description}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {page.highlights.map((item) => (
          <li
            key={item}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/book"
          className="rounded-full bg-emerald-700 px-7 py-3 text-sm font-bold text-white hover:bg-emerald-800"
        >
          Book this transfer
        </Link>
        <a
          href={`tel:${telHref(primaryPhone)}`}
          className="rounded-full border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Call {primaryPhone}
        </a>
      </div>

      <div className="mt-12 space-y-8">
        {page.sections.map((section) => (
          <section key={section.heading ?? section.paragraphs[0]}>
            {section.heading ? (
              <h2 className="text-xl font-bold text-slate-900">
                {section.heading}
              </h2>
            ) : null}
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-3 text-base leading-relaxed text-slate-600"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
