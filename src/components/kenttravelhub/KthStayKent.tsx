import { KTH_STAY_KENT } from "@/lib/kenttravelhub/content";
import { hasKthAffiliates, kthBookingSearchUrl } from "@/lib/kenttravelhub/affiliates";
import Image from "next/image";

export function KthStayKent() {
  const affiliateEnabled = hasKthAffiliates();

  return (
    <div id="hotels" className="mt-14 scroll-mt-24">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-kth-sea">
        Where to stay
      </p>
      <h3 className="mt-2 font-serif text-2xl font-bold text-kth-navy sm:text-3xl">
        Hotels &amp; accommodation in Kent
      </h3>
      <p className="mt-3 max-w-2xl text-sm text-kth-muted">
        Overnight stays near the port, cruise terminal and main sights — compare
        hotels in Dover, Canterbury and the Kent coast.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {KTH_STAY_KENT.map((stay) => (
          <a
            key={stay.id}
            href={kthBookingSearchUrl(stay.search)}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-xl border border-kth-navy/8 bg-white shadow-sm transition hover:border-kth-sea/30 hover:shadow-md active:scale-[0.99]"
          >
            <StayCardContent stay={stay} linked />
          </a>
        ))}
      </div>

      {affiliateEnabled && (
        <p className="mt-6 text-xs text-kth-muted/80">
          We may earn a commission when you book through these links — at no
          extra cost to you. Prices shown are indicative guide rates.
        </p>
      )}
    </div>
  );
}

function StayCardContent({
  stay,
  linked,
}: {
  stay: (typeof KTH_STAY_KENT)[number];
  linked: boolean;
}) {
  return (
    <>
      <div className="relative aspect-[16/9]">
        <Image
          src={stay.image}
          alt={stay.title}
          fill
          className={`object-cover ${linked ? "transition group-hover:scale-[1.02]" : ""}`}
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h4
            className={`font-serif text-lg font-bold text-kth-navy ${linked ? "group-hover:text-kth-sea" : ""}`}
          >
            {stay.title}
          </h4>
          <span className="shrink-0 text-xs font-semibold text-kth-sea">
            from {stay.fromPrice}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-kth-muted">
          {stay.description}
        </p>
        {linked ? (
          <p className="mt-3 text-sm font-semibold text-kth-sea">
            Check prices &amp; book →
          </p>
        ) : null}
      </div>
    </>
  );
}
