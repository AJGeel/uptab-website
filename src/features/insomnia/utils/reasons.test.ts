import { describe, expect, it } from "vitest";

import { pickReason } from "@/features/insomnia/utils/reasons";

/** A seeded generator, so the count below is the same on every run. */
const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);

  t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);

  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

describe("pickReason", () => {
  it("never leaves a blank unfilled", () => {
    for (let i = 0; i < 2000; i++) {
      expect(pickReason()).not.toMatch(/[{}]/);
    }
  });

  it("produces plenty of different reasons", () => {
    const random = seeded(1);
    const reasons = new Set(Array.from({ length: 500 }, () => pickReason(random)));

    expect(reasons.size).toBeGreaterThan(400);
  });
});
