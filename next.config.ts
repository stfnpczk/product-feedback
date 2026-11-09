import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mac's LAN IP for testing on a phone
  allowedDevOrigins: ["192.168.178.117"],
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
