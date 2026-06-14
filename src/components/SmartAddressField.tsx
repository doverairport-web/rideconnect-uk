"use client";

import { AddressSuggestField } from "@/components/AddressSuggestField";

type SmartAddressFieldProps = {
  name: string;
  value: string;
  onChange: (value: string, coords?: { lat: number; lng: number } | null) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  /** Kept for API compatibility — server suggest works without a browser Maps provider. */
  withinMapsProvider?: boolean;
};

/** Google Places via /api/address-suggest (server) with OpenStreetMap fallback. */
export function SmartAddressField(props: SmartAddressFieldProps) {
  return <AddressSuggestField {...props} />;
}
