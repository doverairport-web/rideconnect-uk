import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export function Logo({ className, priority = false }: LogoProps) {
  const logoClass =
    className ??
    "h-9 w-auto max-w-[180px] object-contain object-left sm:h-10 sm:max-w-[200px]";

  return (
    <Link href="/" className="inline-flex shrink-0 items-center">
      <Image
        src="/rideconnect-logo.png"
        alt={`${BRAND_NAME} — taxi booking in Dover, Kent`}
        width={180}
        height={120}
        className={logoClass}
        priority={priority}
      />
    </Link>
  );
}
