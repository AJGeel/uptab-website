/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig;
