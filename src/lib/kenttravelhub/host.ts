export function isKentTravelHubHost(host: string | null): boolean {
  if (!host) return false;
  const normalized = host.toLowerCase().split(":")[0];
  return (
    normalized === "kenttravelhub.co.uk" ||
    normalized === "www.kenttravelhub.co.uk" ||
    normalized === "kenttravelhub.local"
  );
}
