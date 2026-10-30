import { describe, expect, it } from "vitest";

import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";

import { pickPhotos, ROTATION_MS } from "./pick-photos";

const photo = (id: string, aspectRatio = 1.5) => ({ id, aspectRatio }) as BackgroundImage;
const images = Array.from({ length: 12 }, (_, i) => photo(`photo-${i}`));

describe("pickPhotos", () => {
  it("keeps the same photos within a window", () => {
    expect(pickPhotos(images, 1000)).toEqual(pickPhotos(images, ROTATION_MS - 1));
  });

  it("changes between windows", () => {
    const seen = new Set(Array.from({ length: 20 }, (_, i) => pickPhotos(images, i * ROTATION_MS).hero.id));

    expect(seen.size).toBeGreaterThan(5);
  });

  it("never shows the same photo twice", () => {
    for (let i = 0; i < 50; i++) {
      const { hero, cta } = pickPhotos(images, i * ROTATION_MS);

      expect(hero.id).not.toBe(cta.id);
    }
  });

  it("skips portraits when there are enough wide photos", () => {
    const mixed = [photo("tall", 0.7), photo("a"), photo("b"), photo("c")];

    for (let i = 0; i < 30; i++) {
      const { hero, cta } = pickPhotos(mixed, i * ROTATION_MS);

      expect([hero.id, cta.id]).not.toContain("tall");
    }
  });
});
