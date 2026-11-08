import { expect, it } from "vitest";

import { isRateLimited } from "./rate-limit";

it("allows up to the limit, then blocks until the window passes", () => {
  const start = 1_000_000;

  for (let index = 0; index < 3; index++) {
    expect(isRateLimited("a", start + index, 3, 1000)).toBe(false);
  }

  expect(isRateLimited("a", start + 10, 3, 1000)).toBe(true);
  expect(isRateLimited("a", start + 1002, 3, 1000)).toBe(false);
});

it("counts each visitor separately", () => {
  expect(isRateLimited("x", 5_000_000, 1, 1000)).toBe(false);
  expect(isRateLimited("y", 5_000_000, 1, 1000)).toBe(false);
  expect(isRateLimited("x", 5_000_001, 1, 1000)).toBe(true);
});
