import { describe, expect, it } from "vitest";

import { buildBlurbPrompt, cleanBlurb } from "./blurb-prompt";

describe("buildBlurbPrompt", () => {
  it("names the theme and keeps it generic", () => {
    const prompt = buildBlurbPrompt("Holland");

    expect(prompt).toContain('"Holland"');
    expect(prompt).toContain("never about specific photos, places or photographers");
    expect(prompt).toContain("Don't repeat the theme name");
  });
});

describe("cleanBlurb", () => {
  it("strips quotes and puts it on one line", () => {
    expect(cleanBlurb('  "Tulips,\n  tulips everywhere."\n')).toBe("Tulips, tulips everywhere.");
  });

  it("drops a leading theme name", () => {
    expect(cleanBlurb("Mountains: A welcome distraction.", "Mountains")).toBe("A welcome distraction.");
    expect(cleanBlurb("Mountains for your tabs.", "Mountains")).toBe("Mountains for your tabs.");
  });
});
