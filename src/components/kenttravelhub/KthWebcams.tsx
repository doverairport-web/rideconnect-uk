"use client";

import {
  KTH_ROAD_CAMERA_LINKS,
  KTH_WEBCAM_REFRESH_SECONDS,
  KTH_WEBCAMS,
  kthWebcamAnchor,
  type KthCameraRedirect,
  type KthWebcam,
} from "@/lib/kenttravelhub/webcams";
import { useEffect, useState } from "react";

function WebcamCard({ cam }: { cam: KthWebcam }) {
  const [cacheKey, setCacheKey] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCacheKey((k) => k + 1);
      setLoaded(false);
      setFailed(false);
    }, KTH_WEBCAM_REFRESH_SECONDS * 1000);
    return () => clearInterval(interval);
  }, []);

  const imageSrc = cam.imageUrl ? `${cam.imageUrl}?t=${cacheKey}` : null;

  return (
    <article
      id={kthWebcamAnchor(cam.id)}
      className="scroll-mt-36 flex snap-center flex-col overflow-hidden rounded-2xl border border-kth-navy/10 bg-white shadow-sm sm:snap-align-none"
    >
      <a
        href={cam.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video overflow-hidden bg-kth-navy"
        aria-label={`Open live ${cam.title} webcam`}
      >
        {!imageSrc && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-kth-navy/90 px-4 text-center">
            <p className="text-sm text-white/85">Opens external live stream</p>
            <span className="text-xs font-semibold text-kth-sand">Watch now →</span>
          </div>
        )}
        {imageSrc && !loaded && !failed && (
          <div className="absolute inset-0 flex items-center justify-center bg-kth-navy/90">
            <span className="text-sm text-white/70">Loading…</span>
          </div>
        )}
        {imageSrc && failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-kth-navy/90 px-4 text-center">
            <p className="text-sm text-white/80">Camera offline — open stream</p>
            <span className="text-xs font-semibold text-kth-sand">Watch live →</span>
          </div>
        )}
        {imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={`${cam.title} live webcam`}
            className={`h-full w-full object-cover transition duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              objectPosition: cam.objectPosition ?? "center",
              transform: cam.zoom ? `scale(${cam.zoom})` : undefined,
            }}
            onLoad={() => {
              setLoaded(true);
              setFailed(false);
            }}
            onError={() => {
              setFailed(true);
              setLoaded(false);
            }}
          />
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          Live
        </span>
      </a>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-lg font-extrabold text-kth-navy">{cam.title}</h3>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-kth-sea">
          {cam.subtitle}
        </p>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-kth-muted">{cam.description}</p>
        <a
          href={cam.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-[44px] items-center text-sm font-bold text-kth-sea hover:underline"
        >
          Open full stream →
        </a>
      </div>
    </article>
  );
}

function RoadCameraCard({ cam }: { cam: KthCameraRedirect }) {
  return (
    <a
      href={cam.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-[88px] flex-col justify-center rounded-2xl border border-kth-navy/10 bg-white px-4 py-4 transition hover:border-kth-sea/35 hover:shadow-md active:scale-[0.99] sm:px-5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-extrabold text-kth-navy">{cam.title}</p>
          <p className="mt-0.5 text-xs font-semibold text-kth-sea">{cam.subtitle}</p>
        </div>
        {cam.official && (
          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
            Official
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-snug text-kth-muted">{cam.description}</p>
      <p className="mt-2 text-xs font-semibold text-kth-muted">{cam.provider} →</p>
    </a>
  );
}

/** Compact strip for hub panel — horizontal scroll on mobile. */
export function KthWebcamStrip() {
  const [cacheKey, setCacheKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCacheKey((k) => k + 1), KTH_WEBCAM_REFRESH_SECONDS * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-none">
      {KTH_WEBCAMS.map((cam) => (
        <a
          key={cam.id}
          href={`#${kthWebcamAnchor(cam.id)}`}
          className="relative w-36 shrink-0 overflow-hidden rounded-xl border border-kth-navy/10 bg-kth-navy sm:w-44"
        >
          {cam.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${cam.imageUrl}?t=${cacheKey}`}
              alt=""
              className="aspect-video w-full object-cover"
              style={{
                objectPosition: cam.objectPosition ?? "center",
                transform: cam.zoom ? `scale(${cam.zoom})` : undefined,
              }}
            />
          )}
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2 pb-2 pt-6 text-xs font-bold text-white">
            {cam.title}
          </span>
        </a>
      ))}
    </div>
  );
}

export function KthWebcams() {
  return (
    <section
      id="webcams"
      className="scroll-mt-24 border-b border-kth-navy/8 bg-white py-10 sm:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-kth-sea">
          Live cameras
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-kth-navy sm:text-3xl">
          Dover, port &amp; road views
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-kth-muted sm:text-base">
          Watch the port and cliffs before you travel. Road cameras open on official National
          Highways and Kent Traffic sites — we link you straight there.
        </p>

        <h3 className="mt-8 text-xs font-extrabold uppercase tracking-wide text-kth-muted">
          Dover &amp; port
        </h3>
        <div className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-none sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
          {KTH_WEBCAMS.map((cam) => (
            <div key={cam.id} className="w-[min(100%,320px)] shrink-0 sm:w-auto">
              <WebcamCard cam={cam} />
            </div>
          ))}
        </div>

        <h3 className="mt-10 text-xs font-extrabold uppercase tracking-wide text-kth-muted">
          Roads &amp; motorways
        </h3>
        <p className="mt-2 text-sm text-kth-muted">
          M20, A20 and Kent approaches — official feeds (opens in a new tab).
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {KTH_ROAD_CAMERA_LINKS.map((cam) => (
            <RoadCameraCard key={cam.id} cam={cam} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-kth-muted">
          Dover beach views via{" "}
          <a
            href="https://www.skylinewebcams.com/en/webcam/united-kingdom/england/dover/dover-beach-kent.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kth-sea hover:underline"
          >
            SkylineWebcams
          </a>
          . Road images from{" "}
          <a
            href="https://www.trafficengland.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kth-sea hover:underline"
          >
            Traffic England
          </a>{" "}
          and{" "}
          <a
            href="https://nro.kenttraffic.info/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kth-sea hover:underline"
          >
            Kent Traffic
          </a>
          . Availability depends on each operator.
        </p>
      </div>
    </section>
  );
}
