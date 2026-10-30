import { describe, expect, it } from "vitest";

import { seasonOf, weatherFor } from "./season-weather";

describe("seasonOf", () => {
  it("follows the calendar months", () => {
    expect(["2026-01-15", "2026-04-01", "2026-07-20", "2026-10-30", "2026-12-24"].map((d) => seasonOf(new Date(d)))).toEqual([
      "winter",
      "spring",
      "summer",
      "autumn",
      "winter",
    ]);
  });
});

describe("weatherFor", () => {
  it("fits the season", () => {
    expect(weatherFor(new Date("2026-01-15")).temperature).toBeLessThan(5);
    expect(weatherFor(new Date("2026-07-15")).temperature).toBeGreaterThan(20);
  });

  it("forecasts the next three days", () => {
    expect(weatherFor(new Date("2026-10-30")).forecast.map(({ day }) => day)).toEqual(["Sat", "Sun", "Mon"]);
  });
});
