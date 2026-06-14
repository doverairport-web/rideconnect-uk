import type { KthSiteSection } from "@/lib/kenttravelhub/sections";
import { kthPageMetadata } from "@/lib/kenttravelhub/seo";
import type { Metadata } from "next";

export async function kthSectionPageMetadata(
  section: KthSiteSection,
): Promise<Metadata> {
  return kthPageMetadata({
    title: section.metaTitle,
    description: section.metaDescription,
    path: section.path,
  });
}
