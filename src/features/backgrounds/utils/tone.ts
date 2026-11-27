/** Whether a photo is light (it takes dark text) or dark (it takes white text). */
export type Tone = "light" | "dark";

/** The extension's text colours: its navy, and the off-white it switches to. */
const DARK_TEXT = 0.005;
const WHITE_TEXT = 0.91;

/**
 * The extension shows a photo as a covering background: scaled until it fills
 * the screen, centred, with the overflow cropped. This is the screen's shape,
 * a common 16:9, which decides what part of the photo is actually on screen.
 */
const SCREEN_ASPECT = 16 / 9;
/** Where the extension puts its clock and weather, as shares of the screen. */
const REGION = { width: 0.3, height: 0.3 };
/** Text this hard to read, and the share of the region it may cover. */
const MIN_CONTRAST = 3;
const MAX_UNREADABLE_SHARE = 0.2;

const linear = (channel: number) => {
  const value = channel / 255;

  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

const luminance = (r: number, g: number, b: number) =>
  0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

const contrast = (a: number, b: number) =>
  (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/**
 * The part of a photo behind the widget, in pixels. A photo wider than the
 * screen loses its sides, a taller one (a portrait, or a square) its top and
 * bottom, so that part isn't the photo's own top-left corner.
 */
const widgetRegion = (width: number, height: number) => {
  const isWider = width / height > SCREEN_ASPECT;
  const shownWidth = isWider ? height * SCREEN_ASPECT : width;
  const shownHeight = isWider ? height : width / SCREEN_ASPECT;

  return {
    left: Math.round((width - shownWidth) / 2),
    top: Math.round((height - shownHeight) / 2),
    columns: Math.max(1, Math.floor(shownWidth * REGION.width)),
    rows: Math.max(1, Math.floor(shownHeight * REGION.height)),
  };
};

/**
 * The tone of the top-left of the screen when it shows the photo, from raw RGB
 * pixels (3 bytes each). `poorFit` is set when neither text colour reads well
 * on a fifth or more of that corner, e.g. a busy or mid-tone one.
 */
export const measureTone = (pixels: Uint8Array, width: number): { tone: Tone; poorFit: boolean } => {
  const height = pixels.length / 3 / width;
  const { left, top, columns, rows } = widgetRegion(width, height);
  const lums: number[] = [];

  for (let y = top; y < top + rows; y++) {
    for (let x = left; x < left + columns; x++) {
      const offset = (y * width + x) * 3;

      lums.push(luminance(pixels[offset], pixels[offset + 1], pixels[offset + 2]));
    }
  }

  const mean = lums.reduce((sum, value) => sum + value, 0) / lums.length;
  const tone: Tone = contrast(mean, DARK_TEXT) >= contrast(mean, WHITE_TEXT) ? "light" : "dark";
  const text = tone === "light" ? DARK_TEXT : WHITE_TEXT;
  const unreadable = lums.filter((value) => contrast(value, text) < MIN_CONTRAST).length;

  return { tone, poorFit: unreadable / lums.length > MAX_UNREADABLE_SHARE };
};
