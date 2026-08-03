import type { ResolvedHubLink } from "@/lib/kenttravelhub/resolve-hub-links";
import Link from "next/link";

type Props = {
  links: ResolvedHubLink[];
  title?: string;
};

export function KthSectionHubLinks({ links, title = "Quick links" }: Props) {
  if (links.length === 0) return null;

  return (
    <div className="border-b border-kth-navy/8 bg-white py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-xs font-extrabold uppercase tracking-wide text-kth-muted">
          {title}
        </p>
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-0.5 scrollbar-none">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="shrink-0 rounded-full border border-kth-navy/10 bg-kth-sand px-3.5 py-2 text-sm font-semibold text-kth-navy transition hover:border-kth-sea/40 hover:bg-white active:scale-[0.98]"
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
