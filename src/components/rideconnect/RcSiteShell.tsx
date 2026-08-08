import { customerBookHrefForSite } from "@/lib/apps";
import { ConversionTracking } from "@/components/ConversionTracking";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { MobileConversionBar } from "@/components/MobileConversionBar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { RcFooter } from "@/components/rideconnect/RcFooter";
import { RcHeader } from "@/components/rideconnect/RcHeader";
import { KthAnalyticsLoader } from "@/components/kenttravelhub/KthAnalyticsLoader";
import { KthMobileConversionBar } from "@/components/kenttravelhub/KthMobileConversionBar";
import { KthWhatsAppButton } from "@/components/kenttravelhub/KthWhatsAppButton";
import { isKentTravelHubHost } from "@/lib/kenttravelhub/host";
import { getRideConnectSiteForRequest } from "@/lib/rideconnect/server";
import { headers } from "next/headers";

export async function RcSiteShell({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get("host");
  const isKth = isKentTravelHubHost(host);
  const site = await getRideConnectSiteForRequest();

  return (
    <>
      {isKth ? <KthAnalyticsLoader /> : null}
      <LocalBusinessSchema site={site} />
      <RcHeader site={site} />
      <main className="pb-[4.5rem] md:pb-0">{children}</main>
      <RcFooter site={site} />
      {isKth ? (
        <>
          <KthWhatsAppButton />
          <KthMobileConversionBar />
        </>
      ) : (
        <>
          <WhatsAppButton
            message={`Hi, I'd like to book a taxi with ${site.brandTitle}.`}
          />
          <MobileConversionBar
            bookHref={customerBookHrefForSite(site.id)}
            bookLabel="Book now"
            whatsappMessage={`Hi, I'd like to book a taxi with ${site.brandTitle}.`}
          />
        </>
      )}
      <ConversionTracking />
    </>
  );
}
