import { expect, it } from "vitest";

import { formatWhen } from "./format-when";

// Built from local parts, so the test holds in any timezone
const at = (...parts: [number, number, number, number?, number?]) => new Date(...parts);

const now = at(2026, 10, 8, 15, 0).getTime();

it("says today and yesterday with the time", () => {
  expect(formatWhen(at(2026, 10, 8, 9, 12).toISOString(), now)).toBe("Today 09:12");
  expect(formatWhen(at(2026, 10, 7, 21, 5).toISOString(), now)).toBe("Yesterday 21:05");
});

it("uses the weekday and date after that", () => {
  expect(formatWhen(at(2026, 10, 5, 8, 0).toISOString(), now)).toBe("Thu 5 Nov");
});

it("adds the year for another year", () => {
  expect(formatWhen(at(2025, 9, 20, 8, 0).toISOString(), now)).toContain("2025");
});
