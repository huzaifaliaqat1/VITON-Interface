import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.pixelcut.app", // Replace with actual domain
      },
    ],
  },
};

export default nextConfig;
