import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export function Logo({ className = "h-11 w-auto sm:h-12", priority = false }: LogoProps) {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center">
      <Image
        src="/rideconnect-logo.png"
        alt={`${BRAND_NAME} — taxi booking in Dover, Kent`}
        width={1024}
        height={682}
        className={className}
        priority={priority}
      />
    </Link>
  );
}
