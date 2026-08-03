import { kthSiteGraphJsonLd } from "@/lib/kenttravelhub/schema";

export function KthWebSiteSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(kthSiteGraphJsonLd()),
      }}
    />
  );
}
