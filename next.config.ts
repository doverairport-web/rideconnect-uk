import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.whitecliffshoteldover.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.parkdeanresorts.co.uk",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "le-cdn.website-editor.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
