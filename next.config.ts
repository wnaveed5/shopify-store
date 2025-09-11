import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/s/files/**',
      },
      {
        protocol: 'https',
        hostname: '*.shopify.com',
        port: '',
        pathname: '/cdn/shop/**',
      },
    ],
    // Optimize image loading with higher quality
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Handle GIFs properly - don't optimize them to preserve animation
    unoptimized: false,
    // Higher quality device sizes for better image resolution
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828, 1080],
  },
};

export default nextConfig;
