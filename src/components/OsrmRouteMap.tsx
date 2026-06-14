"use client";

import { useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { RouteMapData } from "@/lib/route-estimate";
import { decodePolyline } from "@/lib/polyline";
import "leaflet/dist/leaflet.css";

const DOVER_CENTER: [number, number] = [51.1279, 1.3134];

function FitRouteBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;
    map.fitBounds(positions, { padding: [40, 40] });
  }, [map, positions]);

  return null;
}

export function OsrmRouteMap({ mapData }: { mapData: RouteMapData | null }) {
  const path = useMemo(
    () => (mapData ? decodePolyline(mapData.polyline) : []),
    [mapData],
  );

  const positions = useMemo<[number, number][]>(
    () => path.map((point) => [point.lat, point.lng]),
    [path],
  );

  const center: [number, number] = mapData
    ? [
        (mapData.origin.lat + mapData.destination.lat) / 2,
        (mapData.origin.lng + mapData.destination.lng) / 2,
      ]
    : DOVER_CENTER;

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-xl border border-navy/10">
      {!mapData ? (
        <div className="pointer-events-none absolute inset-x-0 top-3 z-[500] px-4 text-center">
          <span className="rounded-full bg-white/95 px-4 py-2 text-sm text-muted shadow-sm">
            Enter pickup and destination to see the route
          </span>
        </div>
      ) : null}

      <MapContainer
        center={center}
        zoom={mapData ? 11 : 10}
        scrollWheelZoom
        className="h-full min-h-[320px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapData && positions.length > 0 ? (
          <>
            <FitRouteBounds positions={positions} />
            <Polyline positions={positions} pathOptions={{ color: "#2d8a4e", weight: 5 }} />
            <CircleMarker
              center={[mapData.origin.lat, mapData.origin.lng]}
              radius={10}
              pathOptions={{ color: "#1e3a5f", fillColor: "#2d8a4e", fillOpacity: 1, weight: 2 }}
            />
            <CircleMarker
              center={[mapData.destination.lat, mapData.destination.lng]}
              radius={10}
              pathOptions={{ color: "#1e3a5f", fillColor: "#c9a227", fillOpacity: 1, weight: 2 }}
            />
          </>
        ) : null}
      </MapContainer>
    </div>
  );
}
