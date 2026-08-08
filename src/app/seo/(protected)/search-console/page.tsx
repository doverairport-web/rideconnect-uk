import { getSearchConsoleDashboardSites } from "@/lib/seo/search-console-dashboard";

export const dynamic = "force-dynamic";

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={
        ok
          ? "inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300"
          : "inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-200"
      }
    >
      {label}
    </span>
  );
}

export default function SearchConsoleSeoPage() {
  const sites = getSearchConsoleDashboardSites();
  const ready = sites.filter((s) => s.verificationConfigured).length;

  return (
    <main>
      <header className="mb-8 border-b border-white/10 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a017]">
          RideConnect SEO
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Search Console
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/70">
          Interní přehled ověření Google Search Console, sitemap a Analytics pro
          všechny weby v síti. Stránka je noindex.
        </p>
        <p className="mt-4 text-sm text-white/80">
          Ověření nastaveno:{" "}
          <span className="font-semibold text-white">
            {ready}/{sites.length}
          </span>
        </p>
      </header>

      <ol className="mb-8 space-y-2 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/80">
        <li>1. Otevři Google Search Console a přidej majetek (URL prefix).</li>
        <li>
          2. Ověř přes HTML tag nebo Google Analytics — kód vlož do Vercel env.
        </li>
        <li>3. Po redeployi odešli sitemap.xml u každého webu.</li>
      </ol>

      <div className="space-y-4">
        {sites.map((site) => (
          <section
            key={site.id}
            className="rounded-xl border border-white/10 bg-slate-900/60 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{site.name}</h2>
                <a
                  href={site.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#d4a017] hover:underline"
                >
                  {site.siteUrl}
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill
                  ok={site.verificationConfigured}
                  label={
                    site.verificationConfigured
                      ? "Verification OK"
                      : "Verification missing"
                  }
                />
                <StatusPill
                  ok={site.gaConfigured}
                  label={site.gaConfigured ? "GA ready" : "GA missing"}
                />
              </div>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-white/50">Env — verification</dt>
                <dd className="font-mono text-white/90">{site.verificationEnv}</dd>
                <dd className="text-white/60">
                  {site.verificationPreview ?? "— not set —"}
                </dd>
              </div>
              <div>
                <dt className="text-white/50">Env — Analytics</dt>
                <dd className="font-mono text-white/90">{site.gaEnv}</dd>
                <dd className="text-white/60">{site.gaId ?? "— not set —"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-white/50">Sitemap</dt>
                <dd>
                  <a
                    href={site.sitemapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-sky-300 hover:underline"
                  >
                    {site.sitemapUrl}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noreferrer"
                className="rounded bg-[#d4a017] px-3 py-2 text-sm font-semibold text-[#0b1f3a] hover:bg-[#e0b12a]"
              >
                Open Search Console
              </a>
              <a
                href={site.sitemapUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/5"
              >
                Check sitemap
              </a>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
