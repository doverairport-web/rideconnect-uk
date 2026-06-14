import {
  KTH_EXPLORE_GRID,
  KTH_NEWS_THUMBNAILS,
  KTH_POPULAR_TRANSFERS,
  KTH_TOP_DESTINATIONS,
} from "@/lib/kenttravelhub/content";
import { getAllKthArticles } from "@/lib/kenttravelhub/articles";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Image from "next/image";
import Link from "next/link";

export async function KthMainGrid() {
  const newsIndex = await kthPath("/news");
  const visit = await kthPath("/visit");
  const airports = await kthPath("/airports");
  const transfers = await Promise.all(
    KTH_POPULAR_TRANSFERS.map(async (route) => ({
      route,
      href: route.slug
        ? "isGuide" in route && route.isGuide
          ? await kthPath(`/news/${route.slug}`)
          : await kthPath(`/taxi/${route.slug}`)
        : null,
    })),
  );
  const newsLinks = await Promise.all(
    getAllKthArticles().slice(0, 4).map(async (article) => ({
      article,
      href: await kthPath(`/news/${article.slug}`),
      image: KTH_NEWS_THUMBNAILS[article.slug],
    })),
  );
  const exploreTiles = KTH_EXPLORE_GRID.map((tile) => ({
    tile,
    href: tile.external,
  }));

  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Popular Transfers */}
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
              Popular Transfers
            </h2>
            <ul className="mt-4 space-y-3">
              {transfers.map(({ route, href }) => {
                const row = (
                  <>
                    <span className="text-lg" aria-hidden>
                      {route.icon === "van" ? "🚐" : "🚗"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-kth-navy">{route.label}</p>
                      <p className="text-xs font-bold text-kth-gold">
                        From £{route.price}
                      </p>
                    </div>
                  </>
                );

                if (href) {
                  return (
                    <li key={route.id}>
                      <Link
                        href={href}
                        className="flex items-start gap-3 rounded-lg p-2 transition hover:bg-kth-sand"
                      >
                        {row}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={route.id} className="flex items-start gap-3 p-2">
                    {row}
                  </li>
                );
              })}
            </ul>
            <Link
              href={airports}
              className="mt-4 inline-block text-xs font-bold text-kth-sea hover:text-kth-navy"
            >
              View all transfers →
            </Link>
          </div>

          {/* Live Travel Updates */}
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
              Live Travel Updates
            </h2>
            <ul className="mt-4 space-y-3">
              {newsLinks.map(({ article, href, image }) => (
                <li key={article.slug}>
                  <Link href={href} className="group flex gap-3 rounded-lg p-1 transition hover:bg-kth-sand">
                    {image && (
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={image}
                          alt=""
                          fill
                          className="object-cover transition group-hover:scale-105"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-snug text-kth-navy group-hover:text-kth-sea">
                        {article.title}
                      </p>
                      <p className="mt-1 text-[11px] text-kth-muted">
                        {new Date(article.updatedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={newsIndex}
              className="mt-4 inline-block text-xs font-bold text-kth-sea hover:text-kth-navy"
            >
              View all updates →
            </Link>
          </div>

          {/* Explore Kent */}
          <div className="scroll-mt-24">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
              Explore Kent
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {exploreTiles.map(({ tile, href }) => (
                <div key={tile.id} className="min-w-0">
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-[4/3] overflow-hidden rounded-lg border border-kth-navy/10"
                  >
                    <Image
                      src={tile.image}
                      alt={tile.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-kth-navy/80 via-transparent to-transparent" />
                    <p className="absolute inset-x-0 bottom-0 p-2 text-xs font-bold text-white">
                      {tile.title}
                    </p>
                  </Link>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 block text-[11px] font-semibold text-kth-sea hover:text-kth-navy"
                  >
                    {tile.linkLabel} →
                  </Link>
                </div>
              ))}
            </div>
            <Link
              href={visit}
              className="mt-4 inline-block text-xs font-bold text-kth-sea hover:text-kth-navy"
            >
              Explore more places →
            </Link>
          </div>

          {/* Top Destinations */}
          <div id="airports" className="scroll-mt-24">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
              Top Destinations
            </h2>
            <ul className="mt-4 space-y-2">
              {KTH_TOP_DESTINATIONS.map((dest) => (
                <li
                  key={dest.name}
                  className="flex items-center justify-between gap-2 border-b border-kth-navy/8 py-2 text-sm"
                >
                  <span className="flex items-center gap-2 font-semibold text-kth-navy">
                    <span className="text-xs" aria-hidden>
                      📍
                    </span>
                    {dest.name}
                  </span>
                  <span className="shrink-0 text-xs font-medium text-kth-muted">
                    {dest.miles} miles
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={airports}
              className="mt-4 inline-block text-xs font-bold text-kth-sea hover:text-kth-navy"
            >
              View all destinations →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
