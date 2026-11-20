import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // A stray package-lock.json in the user folder otherwise confuses root detection.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
