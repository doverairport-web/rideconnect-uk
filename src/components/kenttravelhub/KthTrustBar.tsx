import { KTH_TRUST_FEATURES } from "@/lib/kenttravelhub/content";

const ICONS: Record<(typeof KTH_TRUST_FEATURES)[number]["icon"], string> = {
  shield: "🛡",
  pound: "£",
  plane: "✈",
  hand: "🤝",
  clock: "🕐",
};

const DESCRIPTIONS: Record<(typeof KTH_TRUST_FEATURES)[number]["id"], string> = {
  licensed: "Fully licensed taxi and transfer service",
  fixed: "No hidden fees — what we quote is what you pay",
  flight: "We monitor your flight and adjust pickup if needed",
  meet: "Driver will meet you at arrivals with name board",
  support: "Our team is available anytime you need us",
};

export function KthTrustBar() {
  return (
    <section className="border-y border-kth-navy/8 bg-[#eef1f4] py-8">
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-auto sm:max-w-7xl sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-6 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
        {KTH_TRUST_FEATURES.map((item) => (
          <div key={item.id} className="w-36 shrink-0 snap-center text-center sm:w-auto sm:shrink">
            <span
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm"
              aria-hidden
            >
              {ICONS[item.icon]}
            </span>
            <p className="mt-3 text-sm font-extrabold text-kth-navy">{item.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-kth-muted">
              {DESCRIPTIONS[item.id]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
