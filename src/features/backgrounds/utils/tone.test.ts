import { describe, expect, it } from "vitest";

import { measureTone } from "./tone";

/** A grey photo of any shape, from a value for each pixel. */
const photo = (width: number, height: number, valueAt: (x: number, y: number) => number) => ({
  width,
  pixels: Uint8Array.from(
    Array.from({ length: width * height }, (_, index) => {
      const value = valueAt(index % width, Math.floor(index / width));

      return [value, value, value];
    }).flat()
  ),
});

const measure = ({ pixels, width }: ReturnType<typeof photo>) => measureTone(pixels, width);

describe("measureTone", () => {
  it("calls a bright photo light, for dark text", () => {
    expect(measure(photo(160, 90, () => 235))).toEqual({ tone: "light", poorFit: false });
  });

  it("calls a dark photo dark, for white text", () => {
    expect(measure(photo(160, 90, () => 20))).toEqual({ tone: "dark", poorFit: false });
  });

  it("only looks at the top-left of a 16:9 photo", () => {
    expect(measure(photo(160, 90, (x, y) => (x < 48 && y < 27 ? 20 : 240))).tone).toBe("dark");
  });

  it("looks at the middle of a portrait photo, whose top and bottom are cropped", () => {
    // 90×160: the screen shows rows 55–105. The dark top is off screen; the dark patch at the shown top-left isn't
    const dark = measure(photo(90, 160, (x, y) => (y < 55 || (y >= 55 && y < 70 && x < 27) ? 20 : 240)));
    const bright = measure(photo(90, 160, (_x, y) => (y < 55 ? 20 : 240)));

    expect(dark.tone).toBe("dark");
    expect(bright.tone).toBe("light");
  });

  it("crops a square photo the same way", () => {
    // 100×100 on 16:9 shows rows 22–78
    expect(measure(photo(100, 100, (_x, y) => (y < 22 ? 20 : 240))).tone).toBe("light");
  });

  it("looks at the middle of an ultra-wide photo, whose sides are cropped", () => {
    // 320×90: the screen shows columns 80–240
    expect(measure(photo(320, 90, (x) => (x < 80 ? 20 : 240))).tone).toBe("light");
  });

  it("flags a corner where neither text reads, half of it each", () => {
    expect(measure(photo(160, 90, (x) => (x % 2 === 0 ? 20 : 235))).poorFit).toBe(true);
  });
});
