import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ConversionTracking } from "@/components/ConversionTracking";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { MobileConversionBar } from "@/components/MobileConversionBar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { KthAnalyticsLoader } from "@/components/kenttravelhub/KthAnalyticsLoader";
import { KthMobileConversionBar } from "@/components/kenttravelhub/KthMobileConversionBar";
import { KthWhatsAppButton } from "@/components/kenttravelhub/KthWhatsAppButton";
import { isKentTravelHubHost } from "@/lib/kenttravelhub/host";
import { headers } from "next/headers";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = (await headers()).get("host");
  const isKth = isKentTravelHubHost(host);

  return (
    <>
      {isKth ? <KthAnalyticsLoader /> : null}
      <LocalBusinessSchema />
      <Header />
      <main className="pb-[4.5rem] md:pb-0">{children}</main>
      <Footer />
      {isKth ? (
        <>
          <KthWhatsAppButton />
          <KthMobileConversionBar />
        </>
      ) : (
        <>
          <WhatsAppButton />
          <MobileConversionBar bookHref="/book" bookLabel="Book now" />
        </>
      )}
      <ConversionTracking />
    </>
  );
}
