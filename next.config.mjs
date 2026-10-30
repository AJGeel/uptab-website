import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  outputFileTracingExcludes: {
    "/*": ["./assets/backgrounds/**/*", "./public/backgrounds/v1/**/*.webp"],
  },
  /*
   * CORS and caching for remote backgrounds: the catalogue revalidates hourly,
   * images are content-hashed and immutable. Next requires headers() to
   * return a promise, even without anything to await.
   */
  // eslint-disable-next-line require-await
  async headers() {
    const cors = { key: "Access-Control-Allow-Origin", value: "*" };

    return [
      {
        source: "/backgrounds/v1/catalogue.json",
        headers: [
          cors,
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Two path segments, so this never matches catalogue.json
        source: "/backgrounds/v1/:theme/:file",
        headers: [
          cors,
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

/*
 * Local-only tools, such as the photo manager in src/app/adminland/, use files
 * named page.dev.tsx and route.dev.ts. Only the dev server treats those as
 * routes, so they don't exist in production builds at all.
 */
const devConfig = {
  ...nextConfig,
  pageExtensions: ["dev.tsx", "dev.ts", "tsx", "ts", "jsx", "js"],
  experimental: {
    // Photo uploads go through a Server Action, which allows 1 MB by default
    serverActions: { bodySizeLimit: "50mb" },
  },
};

const config = (phase) =>
  phase === PHASE_DEVELOPMENT_SERVER ? devConfig : nextConfig;

export default config;
