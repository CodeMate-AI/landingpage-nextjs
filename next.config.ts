import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.aceternity.com' },
      { protocol: 'https', hostname: 'api.microlink.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'assests.aceternity.com' },
      { protocol: 'https', hostname: 'backend.v3.codemateai.dev' },
    ],
  },
  allowedDevOrigins: ['127.0.0.1:3000', 'localhost:3000'],
};

export default withNextVideo(nextConfig, { folder: 'video' });