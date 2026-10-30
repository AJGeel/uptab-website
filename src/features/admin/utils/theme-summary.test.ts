import { describe, expect, it } from "vitest";

import { summarizeTheme } from "./theme-summary";
import type { SourceMetadata } from "../../backgrounds/utils/metadata";

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
});
