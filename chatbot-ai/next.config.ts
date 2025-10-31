import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "books.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "books.google.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"], // formatos modernos de alta calidad
  },
};

export default nextConfig;
