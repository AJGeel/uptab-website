import { describe, expect, it } from "vitest";

import { buildKeywordsPrompt, parseKeywords } from "./keyword-suggestions";

describe("buildKeywordsPrompt", () => {
  it("names the theme, includes its blurb and asks for JSON", () => {
    const prompt = buildKeywordsPrompt("Holland", "Flat.");

    expect(prompt).toContain('"Holland"');
    expect(prompt).toContain("Flat.");
    expect(prompt).toContain("Answer as JSON");
  });
});

describe("parseKeywords", () => {
  it("trims, and drops blanks and duplicates", () => {
    expect(parseKeywords('{"keywords":[" tulip fields ","","Tulip Fields","windmill"]}')).toEqual([
      "tulip fields",
      "windmill",
    ]);
  });

  it("rejects an answer in another shape", () => {
    expect(() => parseKeywords('{"words":[]}')).toThrow("expected shape");
  });
});
