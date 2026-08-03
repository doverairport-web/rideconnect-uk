"use client";

import { Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useMemo } from "react";
import type { RouteMapData } from "@/lib/route-estimate";
import { decodePolyline } from "@/lib/polyline";

const DOVER_CENTER = { lat: 51.1279, lng: 1.3134 };

function RouteOverlay({ mapData }: { mapData: RouteMapData }) {
  const map = useMap();
  const path = useMemo(() => decodePolyline(mapData.polyline), [mapData.polyline]);

  useEffect(() => {
    if (!map || path.length === 0) return;

    const polyline = new google.maps.Polyline({
      path,
      strokeColor: "#2d8a4e",
      strokeOpacity: 0.9,
      strokeWeight: 5,
    });
    polyline.setMap(map);

    const originMarker = new google.maps.Marker({
      position: mapData.origin,
      map,
      label: { text: "A", color: "white", fontWeight: "700" },
    });

    const destinationMarker = new google.maps.Marker({
      position: mapData.destination,
      map,
      label: { text: "B", color: "white", fontWeight: "700" },
    });

    const bounds = new google.maps.LatLngBounds();
    path.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, 48);

    return () => {
      polyline.setMap(null);
      originMarker.setMap(null);
      destinationMarker.setMap(null);
    };
  }, [map, mapData, path]);

  return null;
}

export function BookingRouteMap({ mapData }: { mapData: RouteMapData | null }) {
  const center = mapData
    ? {
        lat: (mapData.origin.lat + mapData.destination.lat) / 2,
        lng: (mapData.origin.lng + mapData.destination.lng) / 2,
      }
    : DOVER_CENTER;

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-xl border border-navy/10">
      {!mapData ? (
        <div className="pointer-events-none absolute inset-x-0 top-3 z-10 px-4 text-center">
          <span className="rounded-full bg-white/95 px-4 py-2 text-sm text-muted shadow-sm">
            Enter pickup and destination to see the route
          </span>
        </div>
      ) : null}
      <Map
        defaultCenter={center}
        defaultZoom={mapData ? 11 : 10}
        gestureHandling="cooperative"
        disableDefaultUI
        zoomControl
        className="h-full min-h-[320px] w-full"
      >
        {mapData ? <RouteOverlay mapData={mapData} /> : null}
      </Map>
    </div>
  );
}
