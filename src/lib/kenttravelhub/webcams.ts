export type KthWebcam = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: "port" | "city" | "roads";
  /** Base image URL (cache-busted client-side). */
  imageUrl?: string;
  /** Opens the provider's full live player or webcam page. */
  liveUrl: string;
  attribution: { name: string; url: string };
  /** CSS object-position to highlight part of a wide coastal frame. */
  objectPosition?: string;
  /** Zoom into the frame (object-fit: cover). */
  zoom?: number;
};

export type KthCameraRedirect = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  provider: string;
  official?: boolean;
};

/** Embeddable Dover views — still images refreshed every ~45s. */
export const KTH_WEBCAMS: KthWebcam[] = [
  {
    id: "dover-port",
    title: "Dover Port",
    subtitle: "Cruise terminal & Eastern Docks",
    category: "port",
    description:
      "Live view toward the cruise port, ferry terminals and harbour traffic from Dover beach.",
    imageUrl: "https://embed.skylinewebcams.com/img/848.jpg",
    liveUrl:
      "https://www.skylinewebcams.com/en/webcam/united-kingdom/england/dover/dover-beach-kent.html",
    attribution: {
      name: "SkylineWebcams",
      url: "https://www.skylinewebcams.com/en/webcam/united-kingdom/england/dover/dover-beach-kent.html",
    },
    objectPosition: "72% center",
    zoom: 1.35,
  },
  {
    id: "white-cliffs",
    title: "White Cliffs",
    subtitle: "Cliffs & English Channel",
    category: "city",
    description:
      "The famous chalk cliffs and Channel view from Dover — useful for weather and sea conditions.",
    imageUrl: "https://embed.skylinewebcams.com/img/848.jpg",
    liveUrl:
      "https://www.skylinewebcams.com/en/webcam/united-kingdom/england/dover/dover-beach-kent.html",
    attribution: {
      name: "SkylineWebcams",
      url: "https://www.skylinewebcams.com/en/webcam/united-kingdom/england/dover/dover-beach-kent.html",
    },
    objectPosition: "18% center",
    zoom: 1.3,
  },
  {
    id: "marina",
    title: "Dover Marina",
    subtitle: "Harbour & yacht club",
    category: "port",
    description:
      "Marina and waterfront. Full stream via Royal Cinque Ports Yacht Club overlooking Marina Curve.",
    imageUrl: "https://embed.skylinewebcams.com/img/848.jpg",
    liveUrl: "https://www.cruisingearth.com/port-webcams/europe/dover-england2/",
    attribution: {
      name: "Royal Cinque Ports Yacht Club",
      url: "https://www.cruisingearth.com/port-webcams/europe/dover-england2/",
    },
    objectPosition: "55% 40%",
    zoom: 1.25,
  },
];

/**
 * Road & motorway cameras — official sources (we link out; NH feeds are map-based).
 */
export const KTH_ROAD_CAMERA_LINKS: KthCameraRedirect[] = [
  {
    id: "traffic-england",
    title: "Traffic England",
    subtitle: "National Highways live map",
    description:
      "Official CCTV stills, incidents and roadworks on M20, M25 and major A-roads to Dover.",
    href: "https://www.trafficengland.com/",
    provider: "National Highways",
    official: true,
  },
  {
    id: "kent-dover",
    title: "Kent Traffic — Dover",
    subtitle: "Local roads & town CCTV",
    description:
      "Kent County Council map — A20 port approach, Dover town, Deal and coastal A roads.",
    href: "https://nro.kenttraffic.info/",
    provider: "Kent County Council",
    official: true,
  },
  {
    id: "m20-all",
    title: "M20 motorway cameras",
    subtitle: "Maidstone → Folkestone",
    description:
      "All M20 junction cameras including J11A Channel Tunnel — main route to the port.",
    href: "https://www.motorwaycameras.co.uk/england/m20",
    provider: "National Highways feeds",
  },
  {
    id: "m20-j11a",
    title: "M20 J11A — Channel Tunnel",
    subtitle: "Westbound approach",
    description:
      "Live still image at J11A — watch queues toward Dover before you leave the M20.",
    href: "https://www.motorwaycameras.co.uk/england/m20/westbound/traffic-camera/986",
    provider: "National Highways feeds",
  },
  {
    id: "nh-info",
    title: "National Highways CCTV",
    subtitle: "How road cameras work",
    description:
      "Official information on England's motorway traffic cameras and travel updates.",
    href: "https://nationalhighways.co.uk/travel-updates/traffic-cameracctv-services/",
    provider: "National Highways",
    official: true,
  },
  {
    id: "gov-traffic",
    title: "GOV.UK traffic info",
    subtitle: "England road network",
    description: "Government hub linking to Traffic England and regional road authorities.",
    href: "https://www.gov.uk/traffic-information",
    provider: "GOV.UK",
    official: true,
  },
];

export const KTH_WEBCAM_REFRESH_SECONDS = 45;

export function kthWebcamAnchor(id: string): string {
  return `webcam-${id}`;
}
