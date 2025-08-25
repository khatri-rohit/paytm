import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.snapshot = { managedPaths: [] };
    config.watchOptions = {
      ignored: ["**/node_modules", "**/C:/Users/Nitin/Application Data/**"],
    };
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
