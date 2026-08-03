import {
  KTH_EASY_TAXI_TRIPS,
  KTH_NEAR_PORT_PLACES,
  KTH_SENIOR_FRIENDLY_TRIPS,
  KTH_VISIT_BY_TIME,
} from "@/lib/kenttravelhub/home-dashboard";
import Link from "next/link";

type Props = {
  visitHref: string;
  showFullLink?: boolean;
};

export function KthVisitPlannerContent({
  visitHref,
  showFullLink = true,
}: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wide text-kth-muted">
          By time available
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {KTH_VISIT_BY_TIME.map((slot) => (
            <div
              key={slot.id}
              className="rounded-xl border border-kth-navy/8 bg-white p-4 shadow-sm"
            >
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-kth-sea">
                {slot.window}
              </p>
              <p className="mt-1 font-bold text-kth-navy">{slot.headline}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-kth-navy/85">
                {slot.places.map((place) => (
                  <li key={place} className="flex gap-2">
                    <span className="text-kth-gold" aria-hidden>
                      ·
                    </span>
                    {place}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-semibold text-kth-gold">
                Taxi: {slot.taxiMinutes}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-kth-muted">
                {slot.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wide text-kth-muted">
            Best places near Dover port
          </h3>
          <ul className="mt-3 divide-y divide-kth-navy/8 rounded-xl border border-kth-navy/8 bg-white">
            {KTH_NEAR_PORT_PLACES.map((place) => (
              <li
                key={place.name}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <span className="font-semibold text-kth-navy">{place.name}</span>
                <span className="shrink-0 text-xs text-kth-muted">
                  {place.distance} · {place.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wide text-kth-muted">
            Easy taxi trips from Dover
          </h3>
          <ul className="mt-3 divide-y divide-kth-navy/8 rounded-xl border border-kth-navy/8 bg-white">
            {KTH_EASY_TAXI_TRIPS.map((trip) => (
              <li key={trip.route} className="px-4 py-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-kth-navy">
                    {trip.route}
                  </p>
                  <span className="text-xs font-bold text-kth-gold">
                    {trip.duration}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-kth-muted">{trip.use}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wide text-kth-muted">
          Senior-friendly · minimal walking
        </h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {KTH_SENIOR_FRIENDLY_TRIPS.map((trip) => (
            <li
              key={trip.place}
              className="rounded-xl border border-kth-navy/8 bg-kth-sand/40 px-4 py-3"
            >
              <p className="font-semibold text-kth-navy">{trip.place}</p>
              <p className="mt-1 text-xs text-kth-muted">{trip.walking}</p>
              <p className="mt-1 text-xs text-kth-sea">{trip.taxi}</p>
            </li>
          ))}
        </ul>
      </div>

      {showFullLink && (
        <p className="text-center text-xs text-kth-muted">
          <Link href={visitHref} className="font-bold text-kth-sea hover:underline">
            Full visit planner →
          </Link>
        </p>
      )}
    </div>
  );
}
