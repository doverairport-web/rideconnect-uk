export function extractFacebookAccessToken(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const bearer = trimmed.match(/Bearer\s+([A-Za-z0-9_-]+)/i);
  if (bearer?.[1]) return bearer[1];

  const accessTokenParam = trimmed.match(/access_token=([^&\s]+)/i);
  if (accessTokenParam?.[1]) return decodeURIComponent(accessTokenParam[1]);

  if (/^[A-Za-z0-9_-]{20,}$/.test(trimmed)) return trimmed;
  return null;
}
