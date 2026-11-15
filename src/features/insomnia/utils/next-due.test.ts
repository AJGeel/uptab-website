import { describe, expect, it } from "vitest";

import { nextDueAt } from "@/features/insomnia/utils/next-due";

const now = new Date("2026-11-15T12:00:00Z");

describe("nextDueAt", () => {
  it("is at least 12 hours away", () => {
    expect(nextDueAt(now, () => 0).toISOString()).toBe("2026-11-16T00:00:00.000Z");
  });

  it("is at most 36 hours away", () => {
    expect(nextDueAt(now, () => 1).toISOString()).toBe("2026-11-17T00:00:00.000Z");
  });
});
