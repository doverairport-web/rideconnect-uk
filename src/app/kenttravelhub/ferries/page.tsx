import { KthFerryUpdates } from "@/components/kenttravelhub/KthFerryUpdates";
import { KthSectionHubLinks } from "@/components/kenttravelhub/KthSectionHubLinks";
import { KthSectionShell } from "@/components/kenttravelhub/KthSectionShell";
import { KthWhatsAppChannelFollow } from "@/components/kenttravelhub/KthWhatsAppChannelFollow";
import { KTH_FERRY_TOPICS } from "@/lib/kenttravelhub/content";
import { KTH_DAILY_QUESTIONS, KTH_FERRY_CHECK_IN_TODAY } from "@/lib/kenttravelhub/home-dashboard";
import { kthSectionPageMetadata } from "@/lib/kenttravelhub/section-metadata";
import { resolveSectionLinks } from "@/lib/kenttravelhub/resolve-hub-links";
import { kthPath } from "@/lib/kenttravelhub/paths";
import { KTH_SITE_SECTIONS } from "@/lib/kenttravelhub/sections";
import type { Metadata } from "next";
import Link from "next/link";

const section = KTH_SITE_SECTIONS[1];

export async function generateMetadata(): Promise<Metadata> {
  return kthSectionPageMetadata(section);
}

export default async function KthFerriesSectionPage() {
  const [links, waitingTimesGuide, ferryGuide] = await Promise.all([
    resolveSectionLinks("ferries"),
    kthPath("/news/dover-port-waiting-times"),
    kthPath("/news/dover-ferry-dfds-po-updates"),
  ]);

  const guideLinks = {
    "dover-port-waiting-times": waitingTimesGuide,
    "dover-ferry-dfds-po-updates": ferryGuide,
  };

  return (
    <KthSectionShell section={section}>
      <KthSectionHubLinks links={links} />
      <KthWhatsAppChannelFollow variant="banner" />
      <section className="border-b border-kth-navy/8 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="max-w-3xl text-sm font-semibold leading-relaxed text-kth-muted">
            {KTH_DAILY_QUESTIONS.ferries}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {KTH_FERRY_CHECK_IN_TODAY.map((tip) => (
              <li
                key={tip.id}
                className="rounded-lg border border-kth-navy/8 bg-kth-sand/40 p-4"
              >
                <p className="text-xs font-extrabold uppercase tracking-wide text-kth-sea">
                  {tip.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-kth-navy/85">
                  {tip.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <KthFerryUpdates guideLinks={guideLinks} />
      <section className="border-t border-kth-navy/8 bg-kth-sand py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
            Ferries &amp; Port guides
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {KTH_FERRY_TOPICS.map((topic) => {
              const href =
                "guideSlug" in topic && topic.guideSlug
                  ? guideLinks[topic.guideSlug as keyof typeof guideLinks]
                  : null;
              const content = (
                <div className="rounded-lg border border-kth-navy/8 bg-white p-4">
                  <p className="text-sm font-bold text-kth-navy">{topic.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-kth-muted">
                    {topic.description}
                  </p>
                </div>
              );
              return (
                <li key={topic.id}>
                  {href ? (
                    <Link href={href} className="block transition hover:opacity-90">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </KthSectionShell>
  );
}
