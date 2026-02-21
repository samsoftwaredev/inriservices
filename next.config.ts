import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co", // Use a wildcard for the subdomain
      },
    ],
  },
};

export default nextConfig;
