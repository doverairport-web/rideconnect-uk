import { kthHomePageJsonLd } from "@/lib/kenttravelhub/schema";

export function KthHomePageSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(kthHomePageJsonLd()),
      }}
    />
  );
}
