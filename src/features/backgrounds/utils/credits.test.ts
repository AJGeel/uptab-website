import { describe, expect, it } from "vitest";

import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";

import { creditLine } from "./credits";

const photo = (author: string | null) => ({ author }) as BackgroundImage;

describe("creditLine", () => {
  it("lists each photographer once, alphabetically", () => {
    expect(creditLine([photo("Cy"), photo("Ann"), photo("Bo"), photo("Ann")])).toBe("Ann, Bo and Cy");
  });

  it("joins two names with 'and'", () => {
    expect(creditLine([photo("Ann"), photo("Bo")])).toBe("Ann and Bo");
  });

  it("skips uncredited photos", () => {
    expect(creditLine([photo(null), photo("Ann")])).toBe("Ann");
    expect(creditLine([photo(null)])).toBe("");
  });
});
