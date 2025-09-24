import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
      ignoreDuringBuilds:true, 
    },
};

module.exports = {
  images: {
    domains: ['assets.aceternity.com',
      "api.microlink.io",
      "images.unsplash.com",
      "assests.aceternity.com"
    ],
     // Add the external domain here
  },
};
export default withNextVideo(nextConfig, { folder: 'video' });