export function isHomeKentHost(host: string | null): boolean {
  if (!host) return false;
  const normalized = host.toLowerCase().split(":")[0];
  return (
    normalized === "homekent.co.uk" ||
    normalized === "www.homekent.co.uk" ||
    normalized === "homekent.local"
  );
}
