import { describe, expect, it } from "vitest";

import { savePhoto } from "./edits";
import type { SourceMetadata } from "../../backgrounds/utils/metadata";

const entry = { id: "koppelpoort", theme: "holland", file: "holland/koppelpoort.jpg", author: "Denise Jans", link: null };
const fields = { id: "koppelpoort", theme: "holland", author: "Denise Jans", link: "" };
const withOverride: SourceMetadata = {
  themes: [{ id: "holland", name: "Holland" }],
  images: [{ ...entry, toneOverride: "dark" }],
};
const withoutOverride: SourceMetadata = { ...withOverride, images: [entry] };

describe("savePhoto's tone override", () => {
  it("is set from the form", () => {
    const change = savePhoto(withoutOverride, "koppelpoort", { ...fields, toneOverride: "light" });

    expect(change.metadata.images[0].toneOverride).toBe("light");
  });

  it("is kept when the fields don't mention it", () => {
    expect(savePhoto(withOverride, "koppelpoort", fields).metadata.images[0].toneOverride).toBe("dark");
  });

  it("is cleared by an empty value", () => {
    const change = savePhoto(withOverride, "koppelpoort", { ...fields, toneOverride: "" });

    expect(change.metadata.images[0].toneOverride).toBeUndefined();
  });
});
