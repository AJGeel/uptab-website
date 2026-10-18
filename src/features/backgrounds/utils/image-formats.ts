/**
 * The photo formats uploads and source files may use, in one place: how sharp
 * names them, their file extensions and MIME types.
 */
const FORMATS = [
  { sharp: "jpeg", label: "JPEG", mimeType: "image/jpeg", extensions: [".jpg", ".jpeg"] },
  { sharp: "png", label: "PNG", mimeType: "image/png", extensions: [".png"] },
  { sharp: "webp", label: "WebP", mimeType: "image/webp", extensions: [".webp"] },
  { sharp: "tiff", label: "TIFF", mimeType: "image/tiff", extensions: [".tiff", ".tif"] },
];

/** For a file input's `accept`. */
export const ACCEPTED_TYPES = FORMATS.map(({ mimeType }) => mimeType).join(",");

/** "JPEG, PNG, WebP or TIFF", for messages. */
export const FORMAT_NAMES = `${FORMATS.slice(0, -1)
  .map(({ label }) => label)
  .join(", ")} or ${FORMATS.at(-1)?.label}`;

/** ".jpg" for "holland/Koppelpoort.JPG". */
export const extensionOf = (file: string) => file.slice(file.lastIndexOf(".")).toLowerCase();

const formatOfFile = (file: string) =>
  FORMATS.find(({ extensions }) => extensions.includes(extensionOf(file)));

export const isImageFile = (file: string) => formatOfFile(file) !== undefined;

export const mimeTypeOf = (file: string) =>
  formatOfFile(file)?.mimeType ?? "application/octet-stream";

/** The extension to store a file under, from sharp's format name, e.g. "jpeg" → ".jpg". */
export const extensionForFormat = (sharpFormat: string | undefined) =>
  FORMATS.find(({ sharp }) => sharp === sharpFormat)?.extensions[0];
