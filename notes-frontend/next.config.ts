import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",   // Added to run production app in Docker
};

export default nextConfig;
