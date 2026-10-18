import { describe, expect, it } from "vitest";

import { plural } from "./plural";

describe("plural", () => {
  it("only adds an s when the count isn't 1", () => {
    expect(plural(1, "photo")).toBe("1 photo");
    expect(plural(0, "photo")).toBe("0 photos");
    expect(plural(12, "change")).toBe("12 changes");
  });
});
