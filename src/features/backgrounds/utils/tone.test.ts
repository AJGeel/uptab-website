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

  it("only looks at the widget strip, the top-left 40% by 10% of a 16:9 photo", () => {
    expect(measure(photo(160, 90, (x, y) => (x < 64 && y < 9 ? 20 : 240))).tone).toBe("dark");
    expect(measure(photo(160, 90, (x, y) => (x >= 64 || y >= 9 ? 20 : 240))).tone).toBe("light");
  });

  it("looks at the middle of a portrait photo, whose top and bottom are cropped", () => {
    // 90×160: the screen shows rows 55–105. The dark top is off screen; the dark patch at the shown top-left isn't
    const dark = measure(photo(90, 160, (x, y) => (y < 55 || (y >= 55 && y < 65 && x < 40) ? 20 : 240)));
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

  it("flags a dark object that covers part of the widget, though the corner is mostly bright", () => {
    // The widget is a thin strip (the top tenth), here with a dark balloon over 40% of its width
    const balloon = measure(photo(160, 90, (x, y) => (x >= 26 && x < 52 && y < 9 ? 20 : 240)));

    expect(balloon.poorFit).toBe(true);
  });

  it("ignores a dark object below the widget", () => {
    const below = measure(photo(160, 90, (x, y) => (x >= 26 && x < 52 && y >= 20 && y < 40 ? 20 : 240)));

    expect(below).toEqual({ tone: "light", poorFit: false });
  });

  it("flags a busy corner, even where every pixel is readable", () => {
    // Light all over, so dark text reads on each pixel, but it flickers pixel to pixel like a facade
    const busy = measure(photo(160, 90, (x, y) => ((x + y) % 2 === 0 ? 200 : 240)));

    expect(busy).toEqual({ tone: "light", poorFit: true });
  });

  it("doesn't flag a smooth corner with the same range of lightness", () => {
    const smooth = measure(photo(160, 90, (x) => 200 + Math.round((x / 159) * 40)));

    expect(smooth).toEqual({ tone: "light", poorFit: false });
  });

  it("flags a corner where neither text reads, half of it each", () => {
    expect(measure(photo(160, 90, (x) => (x % 2 === 0 ? 20 : 235))).poorFit).toBe(true);
  });
});
