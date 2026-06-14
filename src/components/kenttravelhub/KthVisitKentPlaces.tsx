import { KTH_VISIT_KENT } from "@/lib/kenttravelhub/content";
import { kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

export async function KthVisitKentPlaces() {
  const places = await Promise.all(
    KTH_VISIT_KENT.map(async (place) => ({
      place,
      guideHref:
        "articleSlug" in place && place.articleSlug
          ? await kthPath(`/news/${place.articleSlug}`)
          : null,
    })),
  );

  return (
    <ul className="divide-y divide-kth-navy/8 overflow-hidden rounded-xl border border-kth-navy/8 bg-white shadow-sm">
      {places.map(({ place, guideHref }) => (
        <li key={place.id} className="p-4 transition hover:bg-kth-sand sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <h3 className="font-bold text-kth-navy">{place.title}</h3>
                <span className="shrink-0 text-xs font-semibold text-kth-muted">
                  {place.milesFromDover} mi from Dover
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm leading-snug text-kth-muted">
                {place.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <a
                  href={place.external}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-kth-sea hover:text-kth-navy hover:underline"
                >
                  {place.linkLabel} →
                </a>
                {guideHref && (
                  <Link
                    href={guideHref}
                    className="text-xs font-semibold text-kth-muted hover:text-kth-sea hover:underline"
                  >
                    Planning guide →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
