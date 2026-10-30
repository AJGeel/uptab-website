import { describe, expect, it } from "vitest";

import { reorderPhotos, reorderThemes } from "./order";
import type { SourceMetadata } from "../../backgrounds/utils/metadata";

const photo = (id: string, theme: string) => ({ id, theme, file: `${theme}/${id}.jpg`, author: "Jane", link: null });

const metadata: SourceMetadata = {
  themes: [
    { id: "holland", name: "Holland" },
    { id: "safari", name: "Safari" },
  ],
  images: [photo("lion", "safari"), photo("tulip", "holland"), photo("zebra", "safari"), photo("mill", "holland")],
};

describe("reorderThemes", () => {
  it("puts the themes in the given order", () => {
    const { metadata: next } = reorderThemes(metadata, ["safari", "holland"]);

    expect(next.themes.map(({ id }) => id)).toEqual(["safari", "holland"]);
  });

  it("rejects a list that misses or repeats a theme", () => {
    expect(() => reorderThemes(metadata, ["safari"])).toThrow();
    expect(() => reorderThemes(metadata, ["safari", "safari"])).toThrow();
  });
});

describe("reorderPhotos", () => {
  it("reorders one theme's photos and leaves the others in their places", () => {
    const { metadata: next } = reorderPhotos(metadata, "safari", ["zebra", "lion"]);

    expect(next.images.map(({ id }) => id)).toEqual(["zebra", "tulip", "lion", "mill"]);
  });

  it("rejects a photo from another theme", () => {
    expect(() => reorderPhotos(metadata, "safari", ["lion", "tulip"])).toThrow();
  });
});
