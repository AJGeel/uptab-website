import { describe, expect, it } from "vitest";

import type { SourceMetadata } from "./metadata";
import { summarizeTheme } from "./theme-summary";

const entry = (id: string, pending = false) => ({
  id,
  theme: "safari",
  file: `safari/${id}.jpg`,
  author: pending ? null : "Jane",
  link: null,
  ...(pending ? { creditPending: true } : {}),
});

const metadata: SourceMetadata = {
  themes: [
    { id: "safari", name: "Safari" },
    { id: "empty", name: "Empty" },
  ],
  images: [entry("a", true), entry("b"), entry("c", true), entry("d"), entry("e")],
};

describe("summarizeTheme", () => {
  it("counts published and pending photos, with published thumbnails first", () => {
    expect(summarizeTheme(metadata, metadata.themes[0], 3)).toEqual({
      id: "safari",
      name: "Safari",
      published: 3,
      pending: 2,
      thumbnails: [
        "/admin/photos/safari/b.jpg",
        "/admin/photos/safari/d.jpg",
        "/admin/photos/safari/e.jpg",
      ],
    });
  });

  it("handles a theme without photos", () => {
    expect(summarizeTheme(metadata, metadata.themes[1])).toMatchObject({
      published: 0,
      pending: 0,
      thumbnails: [],
    });
  });

  it("shows cover photos first, in their order", () => {
    const covered = { ...metadata.themes[0], coverImageIds: ["e", "a"] };

    expect(summarizeTheme(metadata, covered, 3).thumbnails).toEqual([
      "/admin/photos/safari/e.jpg",
      "/admin/photos/safari/a.jpg",
      "/admin/photos/safari/b.jpg",
    ]);
  });
});
