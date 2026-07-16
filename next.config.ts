import type { NextConfig } from "next";

/**
 * Vercel: стандартный Next.js (без output: 'export') — Image Optimization, ISR, CDN.
 * Статический dist: STATIC_EXPORT=1 npm run build:static
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: {
          unoptimized: true,
          remotePatterns: [
            { protocol: "https" as const, hostname: "images.unsplash.com" },
          ],
        },
      }
    : {
        images: {
          remotePatterns: [
            { protocol: "https" as const, hostname: "images.unsplash.com" },
          ],
        },
      }),
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

export default nextConfig;
