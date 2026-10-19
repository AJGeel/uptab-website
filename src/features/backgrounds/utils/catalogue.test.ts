import { describe, expect, it } from "vitest";

import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";

import { buildCatalogue, pickWidths, toHexColor } from "./catalogue";

const themes = [
  { id: "holland", name: "Holland" },
  { id: "safari", name: "Safari" },
];

describe("pickWidths", () => {
  it("never upscales", () => {
    expect(pickWidths(1920)).toEqual([1920]);
    expect(pickWidths(3000)).toEqual([1920, 2560]);
    expect(pickWidths(6000)).toEqual([1920, 2560, 3840]);
  });

  it("keeps the source width when it's smaller than every rendition", () => {
    expect(pickWidths(1200)).toEqual([1200]);
  });
});

describe("toHexColor", () => {
  it("formats as #rrggbb", () => {
    expect(toHexColor({ r: 107, g: 127, b: 5 })).toBe("#6b7f05");
  });
});

describe("buildCatalogue", () => {
  const image = { id: "koppelpoort", theme: "holland" } as BackgroundImage;

  it("leaves out themes without images", () => {
    const catalogue = buildCatalogue(themes, [image], new Date(0));

    expect(catalogue).toEqual({
      version: 1,
      generatedAt: "1970-01-01T00:00:00.000Z",
      themes: [{ id: "holland", name: "Holland" }],
      images: [image],
    });
  });

  it("keeps only published cover photos, and drops an empty cover", () => {
    const covered = [
      {
        id: "holland",
        name: "Holland",
        coverImageIds: ["unpublished", "koppelpoort"],
      },
      { id: "safari", name: "Safari", coverImageIds: ["unpublished"] },
    ];
    const safari = { id: "lion", theme: "safari" } as BackgroundImage;

    expect(buildCatalogue(covered, [image, safari], new Date(0)).themes).toEqual([
      { id: "holland", name: "Holland", coverImageIds: ["koppelpoort"] },
      { id: "safari", name: "Safari" },
    ]);
  });
});
