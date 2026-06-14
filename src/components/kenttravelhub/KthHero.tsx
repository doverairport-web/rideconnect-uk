import {
  KTH_HERO_EYEBROW,
  KTH_HERO_HEADLINE,
  KTH_HERO_IMAGE,
  KTH_HERO_IMAGE_ALT,
  KTH_HERO_SUBHEADLINE,
} from "@/lib/kenttravelhub/brand";
import { KthGuideSearch } from "@/components/kenttravelhub/KthGuideSearch";
import { KthHeroCruisePanel } from "@/components/kenttravelhub/KthHeroCruisePanel";
import { KthHeroFerryPanel } from "@/components/kenttravelhub/KthHeroFerryPanel";
import { KthHeroTodayPanel } from "@/components/kenttravelhub/KthHeroTodayPanel";
import { getAllKthArticles } from "@/lib/kenttravelhub/articles";
import { KTH_SEARCH_TOPICS } from "@/lib/kenttravelhub/content";
import { KTH_LIVE_EXTERNAL_LINKS } from "@/lib/kenttravelhub/live-links";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Image from "next/image";
import Link from "next/link";

export async function KthHero() {
  const [cruiseGuide, cruiseTerminal, ferryGuide, liveGuide, guidesIndex, visitGuide] =
    await Promise.all([
      kthPath("/cruise"),
      kthPath("/cruise-terminal"),
      kthPath("/ferries"),
      kthPath("/live"),
      kthPath("/news"),
      kthPath("/visit"),
    ]);

  const articles = getAllKthArticles();
  const [searchGuides, searchTopics] = await Promise.all([
    Promise.all(
      articles.map(async (article) => ({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        href: await kthPath(`/news/${article.slug}`),
      })),
    ),
    Promise.all(
      KTH_SEARCH_TOPICS.map(async (topic) => ({
        id: topic.id,
        label: topic.label,
        href:
          "sectionPath" in topic
            ? await kthPath(topic.sectionPath)
            : await kthPath(`/news/${topic.articleSlug}`),
      })),
    ),
  ]);

  const ctas = [
    { href: liveGuide, label: "Live board", primary: true },
    { href: cruiseGuide, label: "Cruise today", primary: false },
    { href: ferryGuide, label: "Ferry status", primary: false },
    { href: guidesIndex, label: "All guides", primary: false },
  ];

  return (
    <section className="relative overflow-hidden bg-kth-navy text-white">
      <div className="absolute inset-0 min-h-[520px] lg:min-h-[600px]">
        <Image
          src={KTH_HERO_IMAGE}
          alt={KTH_HERO_IMAGE_ALT}
          fill
          priority
          fetchPriority="high"
          className="object-cover object-[60%_center] opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-kth-navy via-kth-navy/92 to-kth-navy/75" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:pb-16">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-kth-gold">
            {KTH_HERO_EYEBROW}
          </p>
        </div>

        <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl lg:text-[2.75rem]">
          {KTH_HERO_HEADLINE}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
          {KTH_HERO_SUBHEADLINE}
        </p>

        <div className="mt-6">
          <KthGuideSearch
            guides={searchGuides}
            topics={searchTopics}
            guidesIndexHref={guidesIndex}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          {ctas.map((cta) => (
            <Link
              key={cta.label}
              href={cta.href}
              className={
                cta.primary
                  ? "rounded-lg bg-kth-gold px-4 py-2.5 text-sm font-extrabold text-kth-navy transition hover:bg-kth-gold-dark"
                  : "rounded-lg border border-white/25 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/10"
              }
            >
              {cta.label}
            </Link>
          ))}
          <Link
            href={visitGuide}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            Visit Kent →
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/50">
            Live windows · updating now
          </p>
          <div className="-mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-5 [&::-webkit-scrollbar]:hidden">
            <div className="w-[min(88vw,340px)] shrink-0 snap-center sm:w-auto sm:shrink">
              <KthHeroCruisePanel
                scheduleHref={KTH_LIVE_EXTERNAL_LINKS.cruise.href}
                guideHref={cruiseGuide}
                terminalHref={cruiseTerminal}
                scheduleLabel="Full cruise schedule"
              />
            </div>
            <div className="w-[min(88vw,340px)] shrink-0 snap-center sm:w-auto sm:shrink">
              <KthHeroFerryPanel
                guideHref={ferryGuide}
                timetableHref={KTH_LIVE_EXTERNAL_LINKS.ferryTimetable.href}
                timetableLabel="DFDS timetables"
              />
            </div>
            <div className="w-[min(88vw,340px)] shrink-0 snap-center sm:col-span-2 sm:w-auto sm:shrink lg:col-span-1">
              <KthHeroTodayPanel liveHref={liveGuide} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
