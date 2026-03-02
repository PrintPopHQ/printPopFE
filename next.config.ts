import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-93f41f9311014faca85499cb49f09224.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'pub-275088b6740f4ad8968a06be745a8cdb.r2.dev',
      }
    ],
  },
};

export default nextConfig;
