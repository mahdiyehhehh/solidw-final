import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
 eslint: {
   ignoreDuringBuilds: true,
  },
};

export default nextConfig;
