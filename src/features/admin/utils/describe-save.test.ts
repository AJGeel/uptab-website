import { describe, expect, it } from "vitest";

import { describeSave } from "./describe-save";
import type { SavedEdits, ThemeEdits } from "./edits";

const photo = (id: string) => ({
  originalId: id,
  fields: { id, theme: "safari", author: "", link: "" },
});

const save = (
  photos: string[],
  { published = [], unpublished = [] }: Partial<SavedEdits> = {},
  theme?: ThemeEdits["theme"]
) =>
  describeSave(
    { theme, photos: photos.map(photo) },
    { metadata: { themes: [], images: [] }, files: [], published, unpublished }
  );

describe("describeSave", () => {
  it("counts changes, including a theme rename", () => {
    expect(save(["a"], {}, { id: "safari", name: "Safari", blurb: "" })).toEqual({
      message: "Saved 2 changes",
      details: null,
    });
    expect(save(["a"]).message).toBe("Saved 1 change");
  });

  it("lists what joined or left the catalogue on separate lines", () => {
    expect(save(["a", "b"], { published: ["a"], unpublished: ["b"] }).details).toBe(
      "Published 1: a\nUnpublished 1: b"
    );
  });

  it("shortens long lists", () => {
    const ids = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

    expect(save(ids, { published: ids }).details).toBe("Published 10: a, b, c and 7 more");
  });
});
