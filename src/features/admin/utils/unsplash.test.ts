import { describe, expect, it } from "vitest";

import { parseUnsplashName, parseUnsplashUrl } from "./unsplash";

describe("parseUnsplashName", () => {
  it("reads the author and link from an Unsplash download", () => {
    expect(parseUnsplashName("maarten-deckers-t5nxyxcf50i-unsplash.jpg")).toEqual({
      author: "Maarten Deckers",
      link: "https://unsplash.com/photos/t5nxyxcf50i",
    });
  });

  it("keeps the photo ID's case and underscores or dashes", () => {
    expect(parseUnsplashName("jane-doe-aB_9-cD3eFg-unsplash.JPEG")).toEqual({
      author: "Jane Doe",
      link: "https://unsplash.com/photos/aB_9-cD3eFg",
    });
  });

  it("returns null for other names", () => {
    expect(parseUnsplashName("Kunsthal Kade.jpg")).toBeNull();
    expect(parseUnsplashName("photo-1506748686214-e9df14d4d9d0.jpg")).toBeNull();
    expect(parseUnsplashName("maarten-t5nxyxcf50i-unsplash.jpg.bak")).toBeNull();
  });
});

describe("parseUnsplashUrl", () => {
  it("reads the photo ID from a page URL, with or without description words", () => {
    expect(parseUnsplashUrl("https://unsplash.com/photos/foggy-lake-at-dawn-t5nxyxcf50i")).toBe("t5nxyxcf50i");
    expect(parseUnsplashUrl(" https://unsplash.com/photos/t5nxyxcf50i?utm_source=x ")).toBe("t5nxyxcf50i");
    expect(parseUnsplashUrl("https://unsplash.com/photos/a-xb_9-cD3eFg")).toBe("xb_9-cD3eFg");
  });

  it("returns null for other URLs and text", () => {
    expect(parseUnsplashUrl("https://example.com/photos/t5nxyxcf50i")).toBeNull();
    expect(parseUnsplashUrl("https://unsplash.com/s/photos/lake")).toBeNull();
    expect(parseUnsplashUrl("https://unsplash.com/photos/short")).toBeNull();
    expect(parseUnsplashUrl("not a url")).toBeNull();
  });
});
