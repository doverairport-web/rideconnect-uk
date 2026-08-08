import { kthPath } from "@/lib/kenttravelhub/paths";
import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

type Props = {
  items: Crumb[];
};

export async function KthBreadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-kth-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && <span aria-hidden>/</span>}
              {item.href && !isLast ? (
                <Link href={item.href} className="font-semibold text-kth-sea hover:text-kth-navy">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-semibold text-kth-navy" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export async function kthGuideBreadcrumbs(currentTitle: string) {
  const home = await kthPath();
  const guides = await kthPath("/news");
  return [
    { label: "Home", href: home },
    { label: "Guides", href: guides },
    { label: currentTitle },
  ];
}
