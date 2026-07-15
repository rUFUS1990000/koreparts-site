import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Статическая сборка → папка out/ (копируем в dist/)
  output: "export",
  // Промежуточный кэш Next
  distDir: ".next",
  images: {
    // Для static export next/image без оптимизатора
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  trailingSlash: false,
};

export default nextConfig;
