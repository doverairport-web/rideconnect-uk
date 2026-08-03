import Image from "next/image";
import Link from "next/link";
import type { RideConnectSiteConfig } from "@/lib/rideconnect/sites";
import { BRAND_LEGAL } from "@/lib/brand";

/** Logo aspect ratio from rideconnect-logo.png (1024×682). */
const LOGO_WIDTH = 180;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 682) / 1024);

type LogoProps = {
  site: RideConnectSiteConfig;
  showSubtitle?: boolean;
  priority?: boolean;
};

export function RcLogo({ site, showSubtitle = false, priority = false }: LogoProps) {
  return (
    <Link href="/" className="inline-flex min-w-0 max-w-[min(100%,220px)] shrink-0 items-center gap-3">
      <Image
        src="/rideconnect-logo.png"
        alt={BRAND_LEGAL}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className="h-9 w-auto max-w-[180px] object-contain object-left sm:h-10 sm:max-w-[200px]"
        priority={priority}
      />
      {showSubtitle && site.localSubtitle ? (
        <span className="hidden max-w-[10rem] text-[10px] font-semibold uppercase leading-tight tracking-wide text-navy/55 lg:block">
          {site.localSubtitle}
        </span>
      ) : null}
    </Link>
  );
}
