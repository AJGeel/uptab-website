import { describe, expect, it } from "vitest";

import { parseMetadata } from "./metadata";

const themes = [
  { id: "holland", name: "Holland" },
  { id: "safari", name: "Safari" },
];

const published = {
  id: "koppelpoort",
  theme: "holland",
  file: "holland/koppelpoort.jpg",
  author: "Denise Jans",
  link: null,
};

const pending = {
  id: "safari-1",
  theme: "safari",
  file: "safari/1.jpg",
  author: null,
  link: null,
  creditPending: true,
};

const files = [published.file, pending.file];

const parse = (images: object[], sourceFiles = files) =>
  parseMetadata(JSON.stringify({ themes, images }), sourceFiles);

describe("parseMetadata", () => {
  it("accepts valid metadata", () => {
    expect(parse([published, pending]).images).toHaveLength(2);
  });

  it("names the file when the JSON is broken", () => {
    expect(() => parseMetadata("{", files)).toThrow(
      "backgrounds.json is not valid JSON"
    );
  });

  it("rejects unknown keys, so a typo can't publish a photo", () => {
    const { id, theme, file, author, link } = pending;
    const typo = { id, theme, file, author, link, creditPendng: true };

    expect(() => parse([published, typo])).toThrow(
      /images\[1\] \(safari-1\): Unrecognized key: "creditPendng"/
    );
  });

  it("requires IDs to be slugs", () => {
    expect(() => parse([{ ...published, id: "Koppel Poort" }, pending])).toThrow(
      /images\[0\] \(Koppel Poort\)\.id: Use lowercase letters, digits and dashes/
    );
  });

  it("only accepts http(s) credit links", () => {
    expect(() =>
      parse([{ ...published, link: "javascript:alert(1)" }, pending])
    ).toThrow(/images\[0\] \(koppelpoort\)\.link/);
  });

  it("requires an author key on published images, but accepts null", () => {
    const { id, theme, file, link } = published;

    expect(() => parse([{ id, theme, file, link }, pending])).toThrow(
      'koppelpoort: published images need an "author" key'
    );
    expect(() => parse([{ ...published, author: null }, pending])).not.toThrow();
  });

  it("reports every problem at once", () => {
    const error = (() => {
      try {
        parse(
          [
            { ...published, theme: "mars" },
            { ...pending, id: "koppelpoort", file: "safari/missing.jpg" },
          ],
          [...files, "holland/stray.jpg"]
        );
      } catch (caught) {
        return (caught as Error).message;
      }
    })();

    expect(error).toContain("Duplicate image ID: koppelpoort");
    expect(error).toContain('koppelpoort: unknown theme "mars"');
    expect(error).toContain("koppelpoort: file not found: safari/missing.jpg");
    expect(error).toContain("No entry in backgrounds.json for: holland/stray.jpg");
    expect(error).toContain("No entry in backgrounds.json for: safari/1.jpg");
  });

  it("requires cover photos to be the theme's own, listed once, at most 4", () => {
    const covered = (coverImageIds: string[]) =>
      parseMetadata(
        JSON.stringify({
          themes: [{ ...themes[0], coverImageIds }, themes[1]],
          images: [published, pending],
        }),
        files,
      );

    expect(() => covered(["koppelpoort"])).not.toThrow();
    expect(() => covered(["safari-1"])).toThrow(
      'holland: cover photo "safari-1" isn\'t in this theme',
    );
    expect(() => covered(["koppelpoort", "koppelpoort"])).toThrow("listed more than once");
    expect(() => covered(["a", "b", "c", "d", "e"])).toThrow("coverImageIds");
  });
});
