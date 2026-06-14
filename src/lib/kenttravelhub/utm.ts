export type KthUtm = {
  source?: string;
  medium?: string;
  campaign: string;
  content?: string;
};

export function kthUtmQuery(utm: KthUtm): string {
  const params = new URLSearchParams();
  params.set("utm_source", utm.source ?? "kenttravelhub");
  params.set("utm_medium", utm.medium ?? "web");
  params.set("utm_campaign", utm.campaign);
  if (utm.content) params.set("utm_content", utm.content);
  return params.toString();
}
