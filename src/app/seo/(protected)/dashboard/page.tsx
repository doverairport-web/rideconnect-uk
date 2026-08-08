import Link from "next/link";
import { getSearchConsoleDashboardSites } from "@/lib/seo/search-console-dashboard";

export const dynamic = "force-dynamic";

export default function SeoDashboardPage() {
  const sites = getSearchConsoleDashboardSites();
  const verified = sites.filter((s) => s.verificationConfigured).length;
  const withGa = sites.filter((s) => s.gaConfigured).length;

  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-white/65">
          Přehled SEO sítě RideConnect — weby, ověření a rychlé odkazy.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[#12284a] p-5">
          <p className="text-xs uppercase tracking-wide text-white/50">Weby</p>
          <p className="mt-2 text-3xl font-bold text-white">{sites.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#12284a] p-5">
          <p className="text-xs uppercase tracking-wide text-white/50">
            Search Console
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            {verified}/{sites.length}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#12284a] p-5">
          <p className="text-xs uppercase tracking-wide text-white/50">
            Analytics
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            {withGa}/{sites.length}
          </p>
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Weby</h2>
          <div className="flex gap-2 text-sm">
            <Link
              href="/seo/competitors"
              className="rounded-lg border border-white/15 px-3 py-1.5 text-white/80 hover:bg-white/5"
            >
              Competitors
            </Link>
            <Link
              href="/seo/search-console"
              className="rounded-lg bg-[#d4a017] px-3 py-1.5 font-semibold text-[#0b1f3a]"
            >
              Search Console
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-white/55">
              <tr>
                <th className="px-4 py-3 font-medium">Web</th>
                <th className="px-4 py-3 font-medium">Verification</th>
                <th className="px-4 py-3 font-medium">GA</th>
                <th className="px-4 py-3 font-medium">Sitemap</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{site.name}</p>
                    <a
                      href={site.siteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#d4a017] hover:underline"
                    >
                      {site.siteUrl}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {site.verificationConfigured ? "OK" : "Missing"}
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {site.gaConfigured ? site.gaId : "Missing"}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={site.sitemapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-300 hover:underline"
                    >
                      sitemap.xml
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
