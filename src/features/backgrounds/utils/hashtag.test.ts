import { describe, expect, it } from "vitest";

import { hashtag } from "./hashtag";

describe("hashtag", () => {
  it("prefixes the name and drops spaces", () => {
    expect(hashtag("Safari")).toBe("#Safari");
    expect(hashtag(" Under  Water ")).toBe("#UnderWater");
  });
});
