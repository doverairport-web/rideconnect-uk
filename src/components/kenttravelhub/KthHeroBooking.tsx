"use client";

import {
  KTH_BOOKING_DEFAULTS,
  KTH_BOOKING_TABS,
} from "@/lib/kenttravelhub/content";
import { useState } from "react";

type Props = {
  bookUrl: string;
};

const TRUST_BADGES = [
  "Fixed Prices",
  "Licensed Drivers",
  "24/7 Service",
  "Free Waiting Time",
] as const;

export function KthHeroBooking({ bookUrl }: Props) {
  const [tab, setTab] = useState<(typeof KTH_BOOKING_TABS)[number]["id"]>("taxi");
  const defaults = KTH_BOOKING_DEFAULTS[tab];
  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function switchTab(id: (typeof KTH_BOOKING_TABS)[number]["id"]) {
    setTab(id);
    setFrom(KTH_BOOKING_DEFAULTS[id].from);
    setTo(KTH_BOOKING_DEFAULTS[id].to);
  }

  function handleQuote() {
    const params = new URLSearchParams();
    if (from) params.set("pickup", from);
    if (to) params.set("destination", to);
    if (date) params.set("pickup_date", date);
    if (time) params.set("pickup_time", time);
    const qs = params.toString();
    const joiner = bookUrl.includes("?") ? "&" : "?";
    window.location.href = qs ? `${bookUrl}${joiner}${qs}` : bookUrl;
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-2xl sm:p-6">
      <div className="flex gap-1 border-b border-kth-navy/10 pb-3">
        {KTH_BOOKING_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => switchTab(item.id)}
            className={`flex-1 rounded-md px-2 py-2 text-[10px] font-bold uppercase tracking-wide transition sm:text-[11px] ${
              tab === item.id
                ? "bg-kth-navy text-white"
                : "text-kth-muted hover:bg-kth-sand hover:text-kth-navy"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-xs font-semibold text-kth-navy">From</span>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Pickup location"
            className="mt-1 w-full rounded-lg border border-kth-navy/15 px-3 py-2.5 text-sm outline-none focus:border-kth-sea"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-kth-navy">To</span>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Destination"
            className="mt-1 w-full rounded-lg border border-kth-navy/15 px-3 py-2.5 text-sm outline-none focus:border-kth-sea"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold text-kth-navy">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-kth-navy/15 px-3 py-2.5 text-sm outline-none focus:border-kth-sea"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-kth-navy">Time</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-kth-navy/15 px-3 py-2.5 text-sm outline-none focus:border-kth-sea"
            />
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={handleQuote}
        className="mt-5 w-full rounded-lg bg-kth-gold py-3.5 text-sm font-extrabold uppercase tracking-wide text-kth-navy transition hover:bg-kth-gold-dark"
      >
        GET QUOTE →
      </button>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-kth-navy/8 pt-4 sm:grid-cols-4">
        {TRUST_BADGES.map((badge) => (
          <p
            key={badge}
            className="flex items-center gap-1 text-[10px] font-medium text-kth-muted"
          >
            <span className="text-kth-gold" aria-hidden>
              ✓
            </span>
            {badge}
          </p>
        ))}
      </div>
    </div>
  );
}
