import { expect, it } from "vitest";

import { describeUserAgent, parseUserAgent } from "./user-agent";

it.each([
  [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0",
    { browser: "Firefox 144", system: "macOS" },
  ],
  [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
    { browser: "Chrome 141", system: "Windows" },
  ],
  [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0",
    { browser: "Edge 141", system: "Windows" },
  ],
  [
    "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
    { browser: "Chrome 141", system: "ChromeOS" },
  ],
  [
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
    { browser: "Chrome 141", system: "Android" },
  ],
  [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
    { browser: "Safari 18", system: "macOS" },
  ],
])("reads %s", (userAgent, expected) => {
  expect(parseUserAgent(userAgent)).toEqual(expected);
});

it("returns nothing for a missing or unknown user agent", () => {
  expect(parseUserAgent(null)).toEqual({ browser: null, system: null });
  expect(parseUserAgent("curl/8.0")).toEqual({ browser: null, system: null });
});

it("describes a user agent in words, with whatever is known", () => {
  expect(describeUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0")).toBe(
    "Firefox 144 on macOS"
  );
  expect(describeUserAgent("SomeBot (Windows)")).toBe("Windows");
  expect(describeUserAgent(null)).toBe("");
});
