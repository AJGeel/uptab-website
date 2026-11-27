import { describe, expect, it } from "vitest";

import { savePhoto } from "./edits";
import { isPoorFit } from "./poor-fit";
import type { SourceMetadata } from "../../backgrounds/utils/metadata";

const entry = { id: "roksolana", theme: "mist", file: "mist/roksolana.jpg", author: "Roksolana", link: null };
const fields = { id: "roksolana", theme: "mist", author: "Roksolana", link: "" };
const themes = [{ id: "mist", name: "Mist" }];
const ignored: SourceMetadata = { themes, images: [{ ...entry, poorFitIgnored: true }] };
const heeded: SourceMetadata = { themes, images: [entry] };
const savedIgnore = (metadata: SourceMetadata, poorFitIgnored?: string) =>
  savePhoto(metadata, "roksolana", { ...fields, poorFitIgnored }).metadata.images[0].poorFitIgnored;

describe("savePhoto's poor fit override", () => {
  it("is set when the row says it isn't a poor fit", () => {
    expect(savedIgnore(heeded, "ok")).toBe(true);
  });

  it("is kept when the row has no such field, as rows that aren't flagged don't", () => {
    expect(savedIgnore(ignored)).toBe(true);
  });

  it("is cleared by an empty value", () => {
    expect(savedIgnore(ignored, "")).toBeUndefined();
  });

  it("leaves the tone override alone", () => {
    const both: SourceMetadata = { themes, images: [{ ...entry, toneOverride: "dark", poorFitIgnored: true }] };
    const [saved] = savePhoto(both, "roksolana", { ...fields, poorFitIgnored: "" }).metadata.images;

    expect(saved.toneOverride).toBe("dark");
  });
});

describe("isPoorFit", () => {
  it("is the sampled flag, unless it's waved through", () => {
    expect(isPoorFit(entry, { poorFit: true })).toBe(true);
    expect(isPoorFit({ ...entry, poorFitIgnored: true }, { poorFit: true })).toBe(false);
    expect(isPoorFit(entry, { poorFit: false })).toBe(false);
  });
});
