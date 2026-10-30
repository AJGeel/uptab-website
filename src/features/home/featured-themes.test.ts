import { describe, expect, it } from "vitest";

import type { Theme } from "@/features/backgrounds/types/catalogue";

import { featuredThemes } from "./featured-themes";

const themes = ["a", "b", "c", "d", "e", "f"].map((id) => ({ id, name: id.toUpperCase() }) as Theme);

describe("featuredThemes", () => {
  it("follows the order of the list", () => {
    expect(featuredThemes(themes, ["c", "a"]).map(({ id }) => id)).toEqual(["c", "a"]);
  });

  it("shows at most four", () => {
    expect(featuredThemes(themes, ["a", "b", "c", "d", "e", "f"])).toHaveLength(4);
  });

  it("skips themes that aren't in the catalogue", () => {
    expect(featuredThemes(themes, ["x", "b"]).map(({ id }) => id)).toEqual(["b"]);
  });

  it("falls back to the first themes when none match", () => {
    expect(featuredThemes(themes, ["x"]).map(({ id }) => id)).toEqual(["a", "b", "c", "d"]);
  });
});
