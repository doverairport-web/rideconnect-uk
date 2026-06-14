import type { RideConnectSiteConfig } from "@/lib/rideconnect/sites";
import { localBusinessJsonLd } from "@/lib/seo";

type Props = {
  site?: RideConnectSiteConfig;
};

export function LocalBusinessSchema({ site }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessJsonLd(site)),
      }}
    />
  );
}
