export const dynamic = "force-dynamic";

const SEED_COMPETITORS = [
  {
    name: "Dover Orion & Care Cars",
    domain: "doverorionandcarecars.co.uk",
    focus: "Dover taxi / airport",
  },
  {
    name: "Local Kent taxi rivals",
    domain: "—",
    focus: "Add domains to track SERP overlap",
  },
];

export default function SeoCompetitorsPage() {
  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Competitors
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/65">
          Sledování konkurence pro RideConnect síť. Plná SerpAPI / Supabase
          intelligence běží v projektu{" "}
          <code className="font-mono text-white/80">homekent-quote-system</code>
          — tady je rychlý přehled a placeholder pro lokální práci.
        </p>
      </header>

      <div className="mb-6 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
        Žádná data z databáze — přidej konkurenty v SEO OS na Macu, nebo sem
        napojíme Supabase později.
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/55">
            <tr>
              <th className="px-4 py-3 font-medium">Competitor</th>
              <th className="px-4 py-3 font-medium">Domain</th>
              <th className="px-4 py-3 font-medium">Focus</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {SEED_COMPETITORS.map((row) => (
              <tr key={row.name} className="border-t border-white/10">
                <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                <td className="px-4 py-3 font-mono text-white/70">
                  {row.domain}
                </td>
                <td className="px-4 py-3 text-white/70">{row.focus}</td>
                <td className="px-4 py-3 text-amber-200">Not connected</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
