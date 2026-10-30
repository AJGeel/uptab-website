import { describe, expect, it } from "vitest";

import { extractPalette } from "./palette";

const pixels = (...colours: [number, number, number][]) => Uint8Array.from(colours.flat());
const repeat = (colour: [number, number, number], times: number) => Array.from({ length: times }, () => colour);

describe("extractPalette", () => {
  it("orders vivid colours by how much of the photo they cover", () => {
    const photo = pixels(...repeat([200, 40, 40], 3), ...repeat([40, 40, 200], 6));

    expect(extractPalette(photo)).toEqual(["#2828c8", "#c82828"]);
  });

  it("averages similar hues into one colour", () => {
    expect(extractPalette(pixels([200, 40, 40], [200, 60, 40]))).toEqual(["#c83228"]);
  });

  it("ignores greys, blacks and whites", () => {
    expect(extractPalette(pixels([128, 128, 128], [5, 5, 5], [250, 250, 250]))).toEqual([]);
  });

  it("drops colours that barely appear", () => {
    expect(extractPalette(pixels(...repeat([40, 40, 200], 199), [200, 40, 40]))).toEqual(["#2828c8"]);
  });

  it("returns at most the requested number", () => {
    const photo = pixels([200, 40, 40], [40, 200, 40], [40, 40, 200]);

    expect(extractPalette(photo, 2)).toHaveLength(2);
  });
});
