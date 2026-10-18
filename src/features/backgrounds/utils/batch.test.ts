import { describe, expect, it } from "vitest";

import { idProblem, suggestId } from "./batch";

describe("suggestId", () => {
  it("uses the file name", () => {
    expect(suggestId("Kunsthal Kade.JPG", new Set())).toBe("kunsthal-kade");
  });

  it("adds a number when the ID is taken", () => {
    expect(suggestId("lion.jpg", new Set(["lion", "lion-2"]))).toBe("lion-3");
  });

  it("falls back for names without letters or digits", () => {
    expect(suggestId("___.jpg", new Set())).toBe("photo");
  });
});

describe("idProblem", () => {
  const existing = new Set(["koppelpoort"]);

  it("accepts a new, valid ID", () => {
    expect(idProblem("lion", existing, ["lion", "zebra"])).toBeNull();
  });

  it("rejects an invalid slug", () => {
    expect(idProblem("Lion Cub", existing, ["Lion Cub"])).toMatch("lowercase");
  });

  it("rejects an ID another photo has", () => {
    expect(idProblem("koppelpoort", existing, ["koppelpoort"])).toMatch("already");
  });

  it("rejects an ID used twice in the batch", () => {
    expect(idProblem("lion", existing, ["lion", "lion"])).toMatch("twice");
  });
});
