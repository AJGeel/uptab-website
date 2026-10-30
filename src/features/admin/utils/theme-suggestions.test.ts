import { describe, expect, it } from "vitest";

import { buildSuggestionsPrompt, parseSuggestions, pickAngles, unsplashSearchUrl } from "./theme-suggestions";

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
      { name: " Misty lakes ", why: " Calm water. ", search: " foggy lake " },
      { name: "holland", why: "Already there." },
      { name: "Misty Lakes", why: "A repeat." },
      { name: " ", why: "Empty." },
    ],
  });

  it("drops existing themes, repeats and empty names, and trims the rest", () => {
    expect(parseSuggestions(answer, ["Holland"])).toEqual([{ name: "Misty lakes", why: "Calm water.", search: "foggy lake" }]);
  });

  it("searches by name when the model gives no search terms", () => {
    const json = JSON.stringify({ themes: [{ name: "Neon rain", why: "Wet." }] });

    expect(parseSuggestions(json, [])).toEqual([{ name: "Neon rain", why: "Wet.", search: "Neon rain" }]);
  });

  it("rejects an answer in the wrong shape", () => {
    expect(() => parseSuggestions('{"themes":"nope"}', [])).toThrow("expected shape");
  });
});

describe("unsplashSearchUrl", () => {
  it("links to a landscape Unsplash search with a dashed, escaped query", () => {
    expect(unsplashSearchUrl(" Foggy Lake & Pier ")).toBe(
      "https://unsplash.com/s/photos/foggy-lake-%26-pier?orientation=landscape"
    );
  });
});
