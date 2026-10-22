import { describe, expect, it } from "vitest";

import { parseUnsplashName } from "./unsplash";

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
