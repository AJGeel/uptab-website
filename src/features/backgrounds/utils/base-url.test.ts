import { describe, expect, it } from "vitest";

import { getBaseUrl } from "./base-url";

describe("getBaseUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL, without a trailing slash", () => {
    expect(
      getBaseUrl({
        NEXT_PUBLIC_SITE_URL: "https://uptab.app/",
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "uptab.vercel.app",
      })
    ).toBe("https://uptab.app");
  });

  it("rejects an invalid NEXT_PUBLIC_SITE_URL", () => {
    expect(() => getBaseUrl({ NEXT_PUBLIC_SITE_URL: "uptab.app" })).toThrow(
      "not a URL"
    );
    expect(() => getBaseUrl({ NEXT_PUBLIC_SITE_URL: "ftp://uptab.app" })).toThrow(
      "must use http(s)"
    );
  });

  it("uses the stable production URL in production", () => {
    expect(
      getBaseUrl({
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "uptab.vercel.app",
        VERCEL_URL: "uptab-abc123.vercel.app",
      })
    ).toBe("https://uptab.vercel.app");
  });

  it("never falls back to the deployment URL in production", () => {
    expect(() =>
      getBaseUrl({ VERCEL_ENV: "production", VERCEL_URL: "uptab-abc123.vercel.app" })
    ).toThrow("VERCEL_PROJECT_PRODUCTION_URL");
  });

  it("uses the deployment's own URL in previews", () => {
    expect(
      getBaseUrl({ VERCEL_ENV: "preview", VERCEL_URL: "uptab-abc123.vercel.app" })
    ).toBe("https://uptab-abc123.vercel.app");
  });

  it("fails on Vercel without any URL", () => {
    expect(() => getBaseUrl({ VERCEL_ENV: "preview" })).toThrow();
  });

  it("defaults to localhost outside Vercel", () => {
    expect(getBaseUrl({})).toBe("http://localhost:3000");
  });
});
