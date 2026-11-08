import { expect, it } from "vitest";

import { describeSetup } from "./describe-setup";

const FIREFOX = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0";

it("shows what the visitor filled in", () => {
  expect(describeSetup({ version: "1.5.1", browser: "Arc on macOS", user_agent: FIREFOX })).toEqual({
    version: { text: "v1.5.1", missing: false },
    browser: { text: "Arc on macOS", missing: false },
  });
});

it("says so when they are empty, and guesses the browser from the user agent", () => {
  const { version, browser } = describeSetup({ version: null, browser: null, user_agent: FIREFOX });

  expect(version).toEqual({ text: "Version unknown", missing: true });
  expect(browser.missing).toBe(true);
  expect(browser.text).toBe("Probably Firefox 144 on macOS (guessed)");
});

it("makes no guess when there is no user agent either", () => {
  expect(describeSetup({ version: null, browser: null, user_agent: null }).browser.text).toBe("Browser unknown");
});
