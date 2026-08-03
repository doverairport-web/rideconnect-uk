const USER_AGENT = "KentTravelHub/1.0 (+https://kenttravelhub.co.uk)";

export async function fetchText(
  url: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<string | null> {
  const timeoutMs = init?.timeoutMs ?? 12_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/json",
        ...(init?.headers ?? {}),
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchJson<T>(
  url: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T | null> {
  const text = await fetchText(url, init);
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
