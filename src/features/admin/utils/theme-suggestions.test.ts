import { describe, expect, it } from "vitest";

import { buildSuggestionsPrompt, parseSuggestions, pickAngles } from "./theme-suggestions";

describe("buildSuggestionsPrompt", () => {
  it("lists the existing themes with their blurbs, and asks for room at the top", () => {
    const prompt = buildSuggestionsPrompt([{ name: "Holland", blurb: "Flat." }, { name: "Safari" }], ["space and astronomy"]);

    expect(prompt).toContain("- Holland: Flat.");
    expect(prompt).toContain("- Safari\n");
    expect(prompt).toContain("low-detail space in the top part");
    expect(prompt).toContain("space and astronomy");
    expect(prompt).toContain("Answer as JSON");
  });
});

describe("pickAngles", () => {
  it("picks the requested number of different angles", () => {
    const angles = pickAngles(4);

    expect(new Set(angles).size).toBe(4);
  });
});

describe("parseSuggestions", () => {
  const answer = JSON.stringify({
    themes: [
      { name: " Misty lakes ", why: " Calm water. " },
      { name: "holland", why: "Already there." },
      { name: "Misty Lakes", why: "A repeat." },
      { name: " ", why: "Empty." },
    ],
  });

  it("drops existing themes, repeats and empty names, and trims the rest", () => {
    expect(parseSuggestions(answer, ["Holland"])).toEqual([{ name: "Misty lakes", why: "Calm water." }]);
  });

  it("rejects an answer in the wrong shape", () => {
    expect(() => parseSuggestions('{"themes":"nope"}', [])).toThrow("expected shape");
  });
});
