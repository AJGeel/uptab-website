import { describe, expect, it } from "vitest";

import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";

import { pickPhotos } from "./pick-photos";

const photo = (id: string, aspectRatio = 1.5) => ({ id, aspectRatio }) as BackgroundImage;
const images = Array.from({ length: 12 }, (_, i) => photo(`photo-${i}`));
const STEP = 7919;

describe("pickPhotos", () => {
  it("gives the same photos for the same time", () => {
    expect(pickPhotos(images, 1000)).toEqual(pickPhotos(images, 1000));
  });

  it("changes with the time", () => {
    const seen = new Set(Array.from({ length: 20 }, (_, i) => pickPhotos(images, i * STEP).hero.id));

    expect(seen.size).toBeGreaterThan(5);
  });

  it("never shows the same photo twice", () => {
    for (let i = 0; i < 50; i++) {
      const { hero, cta } = pickPhotos(images, i * STEP);

      expect(hero.id).not.toBe(cta.id);
    }
  });

  it("skips portraits when there are enough wide photos", () => {
    const mixed = [photo("tall", 0.7), photo("a"), photo("b"), photo("c")];

    for (let i = 0; i < 30; i++) {
      const { hero, cta } = pickPhotos(mixed, i * STEP);

      expect([hero.id, cta.id]).not.toContain("tall");
    }
  });
});
