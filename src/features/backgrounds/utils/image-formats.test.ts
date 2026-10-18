import { describe, expect, it } from "vitest";

import {
  ACCEPTED_TYPES,
  extensionForFormat,
  extensionOf,
  FORMAT_NAMES,
  isImageFile,
  mimeTypeOf,
} from "./image-formats";

describe("image formats", () => {
  it("lists the formats for inputs and messages", () => {
    expect(ACCEPTED_TYPES).toBe("image/jpeg,image/png,image/webp,image/tiff");
    expect(FORMAT_NAMES).toBe("JPEG, PNG, WebP or TIFF");
  });

  it("recognises image files by extension, in any case", () => {
    expect(extensionOf("holland/Koppelpoort.JPG")).toBe(".jpg");
    expect(isImageFile("safari/1.jpeg")).toBe(true);
    expect(isImageFile("backgrounds.json")).toBe(false);
    expect(isImageFile(".DS_Store")).toBe(false);
  });

  it("maps files to MIME types", () => {
    expect(mimeTypeOf("a/b.tif")).toBe("image/tiff");
    expect(mimeTypeOf("a/b.txt")).toBe("application/octet-stream");
  });

  it("stores sharp formats under one extension each", () => {
    expect(extensionForFormat("jpeg")).toBe(".jpg");
    expect(extensionForFormat("heif")).toBeUndefined();
    expect(extensionForFormat(undefined)).toBeUndefined();
  });
});
