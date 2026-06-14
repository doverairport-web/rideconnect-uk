"use client";

import { KthHeroPortTrafficPanel } from "@/components/kenttravelhub/KthHeroPortTrafficPanel";

type Props = {
  portHref: string;
  ferryHref: string;
  ferryLabel: string;
};

export function KthHeroLivePanels({
  portHref,
  ferryHref,
  ferryLabel,
}: Props) {
  return (
    <KthHeroPortTrafficPanel
      portHref={portHref}
      ferryHref={ferryHref}
      ferryLabel={ferryLabel}
    />
  );
}
