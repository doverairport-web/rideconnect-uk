import { KthFacebookConnectForm } from "@/components/kenttravelhub/KthFacebookConnectForm";
import { KTH_NAME } from "@/lib/kenttravelhub/brand";
import { kthPath } from "@/lib/kenttravelhub/paths";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Facebook setup | ${KTH_NAME}`,
  robots: { index: false, follow: false },
};

export default async function KthFacebookSetupPage() {
  const home = await kthPath();

  return (
    <div className="min-h-screen bg-kth-sand">
      <div className="border-b border-kth-navy/8 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <Link href={home} className="text-sm font-semibold text-kth-sea hover:text-kth-navy">
            ← Kent Travel Hub
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-kth-navy">Facebook autopost setup</h1>
          <p className="mt-2 text-sm leading-relaxed text-kth-muted">
            Connect a Page access token so Kent Travel Hub can publish live travel summaries
            and urgent alerts.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        <KthFacebookConnectForm />
        <p className="text-sm text-kth-muted">
          After connecting, open the{" "}
          <Link href="/facebook-post" className="font-semibold text-kth-sea hover:text-kth-navy">
            Facebook post helper
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
