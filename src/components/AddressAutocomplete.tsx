"use client";

import { useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { formatGooglePlaceLabel } from "@/lib/google-place-label";
import { hasGoogleMaps } from "@/lib/maps-config";

type AddressAutocompleteProps = {
  name: string;
  value: string;
  onChange: (value: string, coords?: { lat: number; lng: number } | null) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

export function AddressAutocomplete({
  name,
  value,
  onChange,
  placeholder,
  required,
  className,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!hasGoogleMaps() || !places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "gb" },
      fields: ["formatted_address", "name", "geometry", "types"],
      bounds: new google.maps.LatLngBounds(
        { lat: 51.0, lng: 1.2 },
        { lat: 51.2, lng: 1.45 },
      ),
      strictBounds: false,
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const loc = place.geometry?.location;
      if (!loc) return;

      const address = formatGooglePlaceLabel({
        name: place.name,
        formattedAddress: place.formatted_address,
        selectedText: inputRef.current?.value,
        types: place.types,
      });
      onChange(address, { lat: loc.lat(), lng: loc.lng() });
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [places, onChange]);

  return (
    <input
      ref={inputRef}
      name={name}
      value={value}
      onChange={(event) => onChange(event.target.value, null)}
      required={required}
      placeholder={placeholder}
      className={className}
      autoComplete="off"
    />
  );
}
