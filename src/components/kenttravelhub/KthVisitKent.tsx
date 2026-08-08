import { KthEatKent } from "@/components/kenttravelhub/KthEatKent";
import { KthStayKent } from "@/components/kenttravelhub/KthStayKent";
import { KthVisitKentPlaces } from "@/components/kenttravelhub/KthVisitKentPlaces";

export async function KthVisitKent() {
  return (
    <section className="scroll-mt-24 border-t border-kth-navy/8 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
          Visit Kent
        </h2>
        <p className="mt-1 text-2xl font-extrabold text-kth-navy sm:text-3xl">
          Day trips from Dover
        </p>

        <div className="mx-auto mt-8 max-w-3xl">
          <KthVisitKentPlaces />
        </div>

        <KthStayKent />
        <KthEatKent />
      </div>
    </section>
  );
}
