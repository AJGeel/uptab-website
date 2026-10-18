import { describe, expect, it } from "vitest";

import {
  buildCatalogue,
  getBaseUrl,
  parseMetadata,
  pickWidths,
  toHexColor,
} from "./backgrounds";
import type { BackgroundImage } from "../src/services/background/types";

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
});

describe("getBaseUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL, without a trailing slash", () => {
    expect(
      getBaseUrl({
        NEXT_PUBLIC_SITE_URL: "https://uptab.app/",
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "uptab.vercel.app",
      })
    ).toBe("https://uptab.app");
  });

  it("rejects an invalid NEXT_PUBLIC_SITE_URL", () => {
    expect(() => getBaseUrl({ NEXT_PUBLIC_SITE_URL: "uptab.app" })).toThrow(
      "not a URL"
    );
    expect(() => getBaseUrl({ NEXT_PUBLIC_SITE_URL: "ftp://uptab.app" })).toThrow(
      "must use http(s)"
    );
  });

  it("uses the stable production URL in production", () => {
    expect(
      getBaseUrl({
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "uptab.vercel.app",
        VERCEL_URL: "uptab-abc123.vercel.app",
      })
    ).toBe("https://uptab.vercel.app");
  });

  it("never falls back to the deployment URL in production", () => {
    expect(() =>
      getBaseUrl({ VERCEL_ENV: "production", VERCEL_URL: "uptab-abc123.vercel.app" })
    ).toThrow("VERCEL_PROJECT_PRODUCTION_URL");
  });

  it("uses the deployment's own URL in previews", () => {
    expect(
      getBaseUrl({ VERCEL_ENV: "preview", VERCEL_URL: "uptab-abc123.vercel.app" })
    ).toBe("https://uptab-abc123.vercel.app");
  });

  it("fails on Vercel without any URL", () => {
    expect(() => getBaseUrl({ VERCEL_ENV: "preview" })).toThrow();
  });

  it("defaults to localhost outside Vercel", () => {
    expect(getBaseUrl({})).toBe("http://localhost:3000");
  });
});

describe("pickWidths", () => {
  it("never upscales", () => {
    expect(pickWidths(1920)).toEqual([1920]);
    expect(pickWidths(3000)).toEqual([1920, 2560]);
    expect(pickWidths(6000)).toEqual([1920, 2560, 3840]);
  });

  it("keeps the source width when it's smaller than every rendition", () => {
    expect(pickWidths(1200)).toEqual([1200]);
  });
});

describe("toHexColor", () => {
  it("formats as #rrggbb", () => {
    expect(toHexColor({ r: 107, g: 127, b: 5 })).toBe("#6b7f05");
  });
});

describe("buildCatalogue", () => {
  const image = { id: "koppelpoort", theme: "holland" } as BackgroundImage;

  it("leaves out themes without images", () => {
    const catalogue = buildCatalogue(themes, [image], new Date(0));

    expect(catalogue).toEqual({
      version: 1,
      generatedAt: "1970-01-01T00:00:00.000Z",
      themes: [{ id: "holland", name: "Holland" }],
      images: [image],
    });
  });
});
