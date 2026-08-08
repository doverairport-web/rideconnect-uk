import { MobileConversionBar } from "@/components/MobileConversionBar";
import { kthBookUrl } from "@/lib/kenttravelhub/paths";

export async function KthMobileConversionBar() {
  const book = await kthBookUrl({
    campaign: "mobile-bar",
    content: "sticky-bar",
  });

  return (
    <MobileConversionBar
      bookHref={book}
      bookLabel="Book Taxi"
      whatsappMessage="Hi, I'd like to book a taxi from Kent Travel Hub."
      variant="kth"
    />
  );
}
