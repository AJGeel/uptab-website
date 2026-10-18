import { describe, expect, it } from "vitest";

import {
  addPhoto,
  assertValidChange,
  createTheme,
  type PhotoFields,
  removePhoto,
  renameTheme,
  saveEdits,
  savePhoto,
  toSlug,
} from "./edits";
import type { SourceMetadata } from "./metadata";

const metadata: SourceMetadata = {
  themes: [
    { id: "holland", name: "Holland" },
    { id: "safari", name: "Safari" },
  ],
  images: [
    {
      id: "koppelpoort",
      theme: "holland",
      file: "holland/koppelpoort.jpg",
      author: "Denise Jans",
      link: null,
    },
    {
      id: "safari-1",
      theme: "safari",
      file: "safari/1.jpg",
      author: null,
      link: null,
      creditPending: true,
    },
  ],
};

const files = ["holland/koppelpoort.jpg", "safari/1.jpg"];

const fieldsOf = (id: string, overrides: Partial<PhotoFields> = {}): PhotoFields => {
  const { theme, author, link } = metadata.images.find((image) => image.id === id)!;

  return { id, theme, author: author ?? "", link: link ?? "", ...overrides };
};

describe("toSlug", () => {
  it("turns file names into IDs", () => {
    expect(toSlug("Kunsthal Kade.JPG")).toBe("kunsthal-kade");
    expect(toSlug("Café de Paris (2).jpeg")).toBe("cafe-de-paris-2");
  });
});

describe("addPhoto", () => {
  const upload = { id: "lion", theme: "safari", author: "", link: "", extension: ".jpg" };

  it("adds a photo without an author as pending, named after its ID", () => {
    const change = addPhoto(metadata, upload);

    expect(change.metadata.images.at(-1)).toEqual({
      id: "lion",
      theme: "safari",
      file: "safari/lion.jpg",
      author: null,
      link: null,
      creditPending: true,
    });
    expect(change.files).toEqual([{ kind: "add", to: "safari/lion.jpg" }]);
    expect(() => assertValidChange(metadata, files, change)).not.toThrow();
  });

  it("publishes straight away with an author", () => {
    const change = addPhoto(metadata, { ...upload, author: "Jane" });

    expect(change.metadata.images.at(-1)).toEqual({
      id: "lion",
      theme: "safari",
      file: "safari/lion.jpg",
      author: "Jane",
      link: null,
    });
  });

  it("rejects a duplicate ID", () => {
    const change = addPhoto(metadata, { ...upload, id: "koppelpoort" });

    expect(() => assertValidChange(metadata, files, change)).toThrow(
      "Duplicate image ID: koppelpoort"
    );
  });

  it("never overwrites an existing file", () => {
    const change = addPhoto(metadata, { ...upload, id: "1" });

    expect(() => assertValidChange(metadata, files, change)).toThrow(
      "A file already exists at safari/1.jpg"
    );
  });
});

describe("savePhoto", () => {
  it("publishes a photo once it has an author", () => {
    const change = savePhoto(metadata, "safari-1", fieldsOf("safari-1", { author: " Jane " }));

    expect(change.metadata.images[1]).toEqual({
      id: "safari-1",
      theme: "safari",
      file: "safari/1.jpg",
      author: "Jane",
      link: null,
    });
  });

  it("unpublishes a photo whose author is cleared", () => {
    const change = savePhoto(metadata, "koppelpoort", fieldsOf("koppelpoort", { author: "" }));

    expect(change.metadata.images[0]).toMatchObject({ author: null, creditPending: true });
  });

  it("renames a pending photo and moves its file", () => {
    const change = savePhoto(
      metadata,
      "safari-1",
      fieldsOf("safari-1", { id: "lion-cub", theme: "holland" })
    );

    expect(change.metadata.images[1]).toMatchObject({
      id: "lion-cub",
      theme: "holland",
      file: "holland/lion-cub.jpg",
      creditPending: true,
    });
    expect(change.files).toEqual([
      { kind: "move", from: "safari/1.jpg", to: "holland/lion-cub.jpg" },
    ]);
    expect(() => assertValidChange(metadata, files, change)).not.toThrow();
  });

  it("keeps a published photo's ID and theme", () => {
    expect(() =>
      savePhoto(metadata, "koppelpoort", fieldsOf("koppelpoort", { id: "utrecht" }))
    ).toThrow("published photos keep their ID and theme");
  });

  it("refuses an invalid link instead of unpublishing", () => {
    const change = savePhoto(
      metadata,
      "koppelpoort",
      fieldsOf("koppelpoort", { link: "not a link" })
    );

    expect(change.metadata.images[0]).not.toHaveProperty("creditPending");
    expect(() => assertValidChange(metadata, files, change)).toThrow("link");
  });
});

describe("saveEdits", () => {
  it("applies a theme rename and several photos as one save, naming transitions", () => {
    const saved = saveEdits(metadata, {
      theme: { id: "holland", name: "The Netherlands" },
      photos: [
        { originalId: "koppelpoort", fields: fieldsOf("koppelpoort", { author: "" }) },
        {
          originalId: "safari-1",
          fields: fieldsOf("safari-1", { id: "lion", author: "Jane" }),
        },
      ],
    });

    expect(saved.metadata.themes[0].name).toBe("The Netherlands");
    expect(saved.published).toEqual(["lion"]);
    expect(saved.unpublished).toEqual(["koppelpoort"]);
    expect(saved.files).toEqual([
      { kind: "move", from: "safari/1.jpg", to: "safari/lion.jpg" },
    ]);
    expect(() => assertValidChange(metadata, files, saved)).not.toThrow();
  });

  it("refuses a rename onto a file that's already there", () => {
    const withTwoPending: SourceMetadata = {
      ...metadata,
      images: [
        ...metadata.images,
        {
          id: "safari-2",
          theme: "safari",
          file: "safari/2.jpg",
          author: null,
          link: null,
          creditPending: true,
        },
      ],
    };
    const saved = saveEdits(withTwoPending, {
      photos: [{ originalId: "safari-1", fields: fieldsOf("safari-1", { id: "2" }) }],
    });

    expect(() =>
      assertValidChange(withTwoPending, [...files, "safari/2.jpg"], saved)
    ).toThrow("A file already exists at safari/2.jpg");
  });
});

describe("removePhoto", () => {
  it("removes the entry and its file", () => {
    const change = removePhoto(metadata, "safari-1");

    expect(change.metadata.images.map(({ id }) => id)).toEqual(["koppelpoort"]);
    expect(change.files).toEqual([{ kind: "delete", from: "safari/1.jpg" }]);
    expect(() => assertValidChange(metadata, files, change)).not.toThrow();
  });
});

describe("createTheme", () => {
  it("adds a theme with an ID from its name", () => {
    const change = createTheme(metadata, { id: "", name: " Under Water " });

    expect(change.metadata.themes.at(-1)).toEqual({ id: "under-water", name: "Under Water" });
    expect(() => assertValidChange(metadata, files, change)).not.toThrow();
  });

  it("rejects a duplicate ID", () => {
    const change = createTheme(metadata, { id: "", name: "Holland" });

    expect(() => assertValidChange(metadata, files, change)).toThrow(
      "Duplicate theme ID: holland"
    );
  });

  it("rejects an empty name", () => {
    const change = createTheme(metadata, { id: "empty", name: "  " });

    expect(() => assertValidChange(metadata, files, change)).toThrow("themes.2.name");
  });
});

describe("renameTheme", () => {
  it("changes the name, not the ID", () => {
    const change = renameTheme(metadata, "holland", "The Netherlands");

    expect(change.metadata.themes[0]).toEqual({ id: "holland", name: "The Netherlands" });
  });

  it("rejects an unknown theme", () => {
    expect(() => renameTheme(metadata, "mars", "Mars")).toThrow('No theme with ID "mars"');
  });
});

describe("assertValidChange", () => {
  it("doesn't block a change on problems that were already there", () => {
    const withStray = [...files, "holland/stray.jpg"];
    const change = savePhoto(
      metadata,
      "koppelpoort",
      fieldsOf("koppelpoort", { author: "D. Jans" })
    );

    expect(() => assertValidChange(metadata, withStray, change)).not.toThrow();
  });
});
