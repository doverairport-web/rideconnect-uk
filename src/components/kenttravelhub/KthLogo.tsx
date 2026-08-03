import { KTH_TAGLINE } from "@/lib/kenttravelhub/brand";
import Link from "next/link";

type Props = {
  homeHref: string;
};

export function KthLogo({ homeHref }: Props) {
  return (
    <Link href={homeHref} className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-kth-navy text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6"
          aria-hidden
        >
          <path
            d="M12 3L4 9v12h6v-6h4v6h6V9l-8-6z"
            fill="currentColor"
            opacity="0.9"
          />
          <path d="M12 3v4M8 7h8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
      <span>
        <span className="block text-sm font-extrabold uppercase tracking-wide text-kth-navy sm:text-base">
          Kent Travel Hub
        </span>
        <span className="block text-[11px] text-kth-muted">{KTH_TAGLINE}</span>
      </span>
    </Link>
  );
}
