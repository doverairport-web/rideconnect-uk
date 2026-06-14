import Image from "next/image";
import Link from "next/link";
import type { RideConnectSiteConfig } from "@/lib/rideconnect/sites";
import { BRAND_LEGAL } from "@/lib/brand";

type LogoProps = {
  site: RideConnectSiteConfig;
  className?: string;
  priority?: boolean;
};

export function RcLogo({ site, className = "h-11 w-auto sm:h-12", priority = false }: LogoProps) {
  return (
    <Link href="/" className="inline-flex shrink-0 flex-col gap-0.5">
      <Image
        src="/rideconnect-logo.png"
        alt={`${BRAND_LEGAL} logo`}
        width={1024}
        height={682}
        className={className}
        priority={priority}
      />
      {site.localSubtitle ? (
        <span className="hidden text-[10px] font-semibold uppercase tracking-wide text-navy/60 sm:block">
          {site.localSubtitle}
        </span>
      ) : null}
    </Link>
  );
}
