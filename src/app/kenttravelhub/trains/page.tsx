import { KthSectionHubLinks } from "@/components/kenttravelhub/KthSectionHubLinks";
import { KthSectionShell } from "@/components/kenttravelhub/KthSectionShell";
import { KthTrainLiveCentre } from "@/components/kenttravelhub/KthTrainLiveCentre";
import { KthWhatsAppChannelFollow } from "@/components/kenttravelhub/KthWhatsAppChannelFollow";
import { kthBookUrl, kthPath } from "@/lib/kenttravelhub/paths";
import { resolveSectionLinks } from "@/lib/kenttravelhub/resolve-hub-links";
import { kthSectionPageMetadata } from "@/lib/kenttravelhub/section-metadata";
import { KTH_SITE_SECTIONS } from "@/lib/kenttravelhub/sections";
import { KTH_TRAIN_GUIDES, KTH_TRAIN_LIVE_INTRO } from "@/lib/kenttravelhub/train-live";
import type { KthStationId } from "@/lib/kenttravelhub/train-live";
import type { Metadata } from "next";
import Link from "next/link";

const section = KTH_SITE_SECTIONS.find((s) => s.id === "trains")!;

export async function generateMetadata(): Promise<Metadata> {
  return kthSectionPageMetadata(section);
}

export default async function KthTrainsSectionPage() {
  const stationIds: KthStationId[] = [
    "dover-priory",
    "folkestone-central",
    "ashford-international",
    "canterbury-east",
    "canterbury-west",
  ];

  const [links, livePath, airportsPath] = await Promise.all([
    resolveSectionLinks("trains"),
    kthPath("/live"),
    kthPath("/airports"),
  ]);

  const bookUrls = Object.fromEntries(
    await Promise.all(
      stationIds.map(async (id) => [
        id,
        await kthBookUrl({ campaign: "train-live", content: id }),
      ]),
    ),
  ) as Record<KthStationId, string>;

  const guides = await Promise.all(
    KTH_TRAIN_GUIDES.map(async (guide) => ({
      ...guide,
      href: guide.external ? guide.href : await kthPath(guide.href),
    })),
  );

  return (
    <KthSectionShell section={section}>
      <KthSectionHubLinks links={links} title="Train live &amp; guides" />
      <KthWhatsAppChannelFollow variant="banner" />

      <section className="border-b border-kth-navy/8 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-kth-sea">
            Train live centre
          </p>
          <h2 className="mt-2 max-w-3xl font-serif text-2xl font-bold text-kth-navy sm:text-3xl">
            Live rail boards, Dover transfers &amp; London connections
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-kth-muted sm:text-base">
            {KTH_TRAIN_LIVE_INTRO}
          </p>
          <p className="mt-4 max-w-3xl text-sm text-kth-muted">
            Flying instead? See the{" "}
            <Link href={airportsPath} className="font-semibold text-kth-sea hover:underline">
              Airport Live Centre
            </Link>{" "}
            for Heathrow, Gatwick and M20 status — or{" "}
            <Link href={livePath} className="font-semibold text-kth-sea hover:underline">
              live Dover port traffic
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-kth-sand py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <KthTrainLiveCentre bookUrls={bookUrls} guides={guides} />
        </div>
      </section>
    </KthSectionShell>
  );
}
