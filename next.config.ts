import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },

  // Compress output for smaller bundles
  compress: true,

  // Tree-shake heavy libraries — only include used exports
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'framer-motion',
    ],
  },

  // Optimize images — prefer modern formats
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
  },
};

export default nextConfig;
