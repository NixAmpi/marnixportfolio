import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site in ./out for Cloudflare Pages: no Node server, no image optimizer.
  output: "export",
  images: {
    // Screenshots are already sized WebP; Cloudflare Pages has no Next image endpoint.
    unoptimized: true,
  },
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
};

export default nextConfig;
