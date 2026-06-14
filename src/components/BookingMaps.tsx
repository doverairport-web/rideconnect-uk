"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { SmartAddressField } from "@/components/SmartAddressField";
import type { RouteMapData } from "@/lib/route-estimate";

const OsrmRouteMap = dynamic(
  () => import("@/components/OsrmRouteMap").then((mod) => mod.OsrmRouteMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-navy/10 bg-cream text-sm text-muted">
        Loading map…
      </div>
    ),
  },
);

const inputClass =
  "mt-1 w-full rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-navy shadow-sm outline-none ring-gold/30 placeholder:text-muted/60 focus:border-gold focus:ring-2";

export function AddressField({
  name,
  label,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string, coords?: { lat: number; lng: number } | null) => void;
  placeholder: string;
}) {
  return (
    <label className="block text-sm font-medium text-navy sm:col-span-2">
      {label}
      <SmartAddressField
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

export function RouteMapPanel({ mapData }: { mapData: RouteMapData | null }) {
  return <OsrmRouteMap mapData={mapData} />;
}

export function BookingMapsProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
