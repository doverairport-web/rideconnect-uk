import type { KthSiteSection } from "@/lib/kenttravelhub/sections";
import { kthBreadcrumbJsonLd } from "@/lib/kenttravelhub/seo";
import { kthWebPageJsonLd } from "@/lib/kenttravelhub/schema";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  section: KthSiteSection;
  children: ReactNode;
};

export async function KthSectionShell({ section, children }: Props) {
  const home = await kthPath();

  const breadcrumbLd = kthBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: section.label, path: section.path },
  ]);
  const webPageLd = kthWebPageJsonLd({
    name: section.metaTitle,
    description: section.metaDescription,
    path: section.path,
  });

  return (
    <div className="border-b border-kth-navy/8 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      <div className="border-b border-kth-navy/8 bg-kth-sand">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <Link
            href={home}
            className="text-sm font-semibold text-kth-sea hover:text-kth-navy"
          >
            ← Live windows
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold text-white ${section.panelBg}`}
            >
              {section.number}
            </span>
            <span className="text-2xl" aria-hidden>
              {section.emoji}
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-kth-muted">
                Section {section.number}
              </p>
              <h1 className="font-serif text-2xl font-bold text-kth-navy sm:text-3xl">
                {section.homeHeading}
              </h1>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-kth-muted">
            {section.description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
