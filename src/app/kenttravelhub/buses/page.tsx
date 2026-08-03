import { KthBusLiveCentre } from "@/components/kenttravelhub/KthBusLiveCentre";
import { KthSectionHubLinks } from "@/components/kenttravelhub/KthSectionHubLinks";
import { KthSectionShell } from "@/components/kenttravelhub/KthSectionShell";
import { KthWhatsAppChannelFollow } from "@/components/kenttravelhub/KthWhatsAppChannelFollow";
import {
  KTH_BUS_GUIDES,
  KTH_BUS_LIVE_INTRO,
  KTH_BUS_OFFICIAL_LINKS,
} from "@/lib/kenttravelhub/bus-live";
import type { KthBusStopId } from "@/lib/kenttravelhub/bus-live";
import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
import { resolveSectionLinks } from "@/lib/kenttravelhub/resolve-hub-links";
import { kthSectionPageMetadata } from "@/lib/kenttravelhub/section-metadata";
import { KTH_SITE_SECTIONS } from "@/lib/kenttravelhub/sections";
import type { Metadata } from "next";
import Link from "next/link";

const section = KTH_SITE_SECTIONS.find((s) => s.id === "buses")!;

export async function generateMetadata(): Promise<Metadata> {
  return kthSectionPageMetadata(section);
}

export default async function KthBusesSectionPage() {
  const stopIds: KthBusStopId[] = [
    "dover-town-centre",
    "dover-london-coach",
    "dover-priory",
    "ferry-terminal",
    "cruise-terminal",
    "dover-castle",
    "white-cliffs",
    "folkestone",
    "folkestone-london-coach",
    "canterbury",
    "canterbury-london-coach",
  ];

  const [links, livePath, trainsPath, bookBase] = await Promise.all([
    resolveSectionLinks("buses"),
    kthPath("/live"),
    kthPath("/trains"),
    kthBookUrl({ campaign: "bus-live", content: "dashboard" }),
  ]);

  const bookUrls = Object.fromEntries(
    await Promise.all(
      stopIds.map(async (id) => [
        id,
        await kthBookUrl({ campaign: "bus-live", content: id }),
      ]),
    ),
  ) as Record<KthBusStopId, string>;

  const guides = await Promise.all(
    KTH_BUS_GUIDES.map(async (guide) => ({
      ...guide,
      href: guide.external ? guide.href : await kthPath(guide.href),
    })),
  );

  return (
    <KthSectionShell section={section}>
      <KthSectionHubLinks links={links} title="Bus live &amp; guides" />
      <KthWhatsAppChannelFollow variant="banner" />

      <section className="border-b border-kth-navy/8 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-sea">
            Bus live centre
          </p>
          <h2 className="mt-2 max-w-3xl font-serif text-2xl font-bold text-kth-navy sm:text-3xl">
            Live Stagecoach boards, Dover transfers &amp; Kent routes
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-kth-muted sm:text-base">
            {KTH_BUS_LIVE_INTRO}
          </p>
          <p className="mt-4 max-w-3xl text-sm text-kth-muted">
            Taking the train? See the{" "}
            <Link href={trainsPath} className="font-semibold text-kth-sea hover:underline">
              Train Live Centre
            </Link>{" "}
            for Dover Priory — coaches to{" "}
            <Link href={await kthPath("/buses#dover-london-coach")} className="font-semibold text-kth-sea hover:underline">
              London Victoria
            </Link>{" "}
            are on the National Express 007 board — or check{" "}
            <Link href={livePath} className="font-semibold text-kth-sea hover:underline">
              live Dover port traffic
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-kth-sand py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <KthBusLiveCentre
            bookUrls={bookUrls}
            guides={guides}
            officialLinks={KTH_BUS_OFFICIAL_LINKS}
            bookBase={bookBase}
          />
        </div>
      </section>
    </KthSectionShell>
  );
}
