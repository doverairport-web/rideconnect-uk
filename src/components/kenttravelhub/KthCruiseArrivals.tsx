"use client";

import type { CruiseArrival } from "@/lib/kenttravelhub/content";
import { useEffect, useState } from "react";

export function KthCruiseArrivals() {
  const [arrivals, setArrivals] = useState<CruiseArrival[]>([]);

  useEffect(() => {
    fetch("/api/kenttravelhub/live")
      .then((res) => res.json())
      .then((data) => setArrivals(data.cruiseArrivals ?? []))
      .catch(() => {});
  }, []);

  return (
    <section id="cruise" className="scroll-mt-24 border-t border-kth-navy/8 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-kth-navy">
          Cruise
        </h2>
        <p className="mt-1 text-2xl font-extrabold text-kth-navy sm:text-3xl">
          Full cruise schedule today
        </p>

        <ul className="mt-8 divide-y divide-kth-navy/8 rounded-xl border border-kth-navy/8 bg-white shadow-sm">
          {arrivals.length === 0 && (
            <li className="px-6 py-8 text-center text-kth-muted">
              No cruise ships scheduled at Dover today — check the full schedule
              at portofdover.com
            </li>
          )}
          {arrivals.map((ship) => (
            <li
              key={`${ship.name}-${ship.time}`}
              className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
            >
              <div>
                <p className="font-semibold text-kth-navy">{ship.name}</p>
                <p className="mt-1 text-sm text-kth-muted">{ship.terminal}</p>
              </div>
              <p className="text-lg font-bold text-kth-sea">{ship.time}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
