import { describe, expect, it } from "vitest";

import { readEdits } from "./read-edits";

const form = (fields: Record<string, string>) => {
  const data = new FormData();

  for (const [name, value] of Object.entries(fields)) {
    data.set(name, value);
  }

  return data;
};

describe("readEdits", () => {
  it("groups photo fields by their original ID", () => {
    expect(
      readEdits(
        form({
          "photo:safari-1:id": " lion ",
          "photo:safari-1:theme": "safari",
          "photo:safari-1:author": "Jane",
          "photo:safari-1:link": "",
        })
      )
    ).toEqual({
      theme: undefined,
      photos: [
        {
          originalId: "safari-1",
          fields: { id: "lion", theme: "safari", author: "Jane", link: "" },
        },
      ],
    });
  });

  it("reads a theme rename", () => {
    expect(readEdits(form({ "theme:id": "holland", "theme:name": "Holland!" })).theme).toEqual({
      id: "holland",
      name: "Holland!",
    });
  });

  it("returns no edits for an empty form", () => {
    expect(readEdits(new FormData())).toEqual({ theme: undefined, photos: [] });
  });
});
