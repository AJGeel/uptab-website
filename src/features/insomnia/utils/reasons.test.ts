import { describe, expect, it } from "vitest";

import { pickReason } from "@/features/insomnia/utils/reasons";

describe("pickReason", () => {
  it("never leaves a blank unfilled", () => {
    for (let i = 0; i < 2000; i++) {
      expect(pickReason()).not.toMatch(/[{}]/);
    }
  });

  it("produces plenty of different reasons", () => {
    const reasons = new Set(Array.from({ length: 500 }, () => pickReason()));

    expect(reasons.size).toBeGreaterThan(400);
  });
});
