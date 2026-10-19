import { describe, expect, it } from "vitest";

import { toggleCover } from "./covers";
import { removePhoto, savePhoto } from "./edits";
import type { SourceMetadata } from "./metadata";

const photo = (id: string, creditPending = false) => ({
  id,
  theme: "safari",
  file: `safari/${id}.jpg`,
  author: creditPending ? null : "Jane",
  link: null,
  ...(creditPending ? { creditPending: true as const } : {}),
});

const metadata = (coverImageIds?: string[]): SourceMetadata => ({
  themes: [
    { id: "holland", name: "Holland" },
    {
      id: "safari",
      name: "Safari",
      ...(coverImageIds ? { coverImageIds } : {}),
    },
  ],
  images: [photo("lion"), photo("zebra"), photo("pending", true)],
});

const fields = (id: string, overrides = {}) => ({
  id,
  theme: "safari",
  author: "Jane",
  link: "",
  ...overrides,
});

describe("toggleCover", () => {
  it("adds a published photo to its theme's cover, and takes it out again", () => {
    const added = toggleCover(metadata(), "lion").metadata;

    expect(added.themes[1]).toEqual({
      id: "safari",
      name: "Safari",
      coverImageIds: ["lion"],
    });
    expect(toggleCover(added, "lion").metadata.themes[1]).toEqual({
      id: "safari",
      name: "Safari",
    });
  });

  it("refuses a photo that isn't published", () => {
    expect(() => toggleCover(metadata(), "pending")).toThrow("isn't published yet");
  });

  it("allows at most 4 cover photos", () => {
    expect(() => toggleCover(metadata(["a", "b", "c", "d"]), "lion")).toThrow("at most 4");
  });
});

describe("dropping cover photos", () => {
  it("drops a cover photo that's unpublished or removed", () => {
    const unpublished = savePhoto(
      metadata(["zebra", "lion"]),
      "lion",
      fields("lion", { author: "" })
    );
    const removed = removePhoto(metadata(["zebra", "lion"]), "lion");

    expect(unpublished.metadata.themes[1].coverImageIds).toEqual(["zebra"]);
    expect(removed.metadata.themes[1].coverImageIds).toEqual(["zebra"]);
  });
});
