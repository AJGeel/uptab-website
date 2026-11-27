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
/**
 * Where the extension puts its clock and weather, as shares of the screen. The
 * widget is about 510 × 66 px on any screen, which is 27–40% of the width and
 * 6–9% of the height from 1920 down to 1280 px wide. Rounded up a little.
 */
const REGION = { width: 0.4, height: 0.1 };
/** Text this hard to read, and the share of the region it may cover. */
const MIN_CONTRAST = 3;
const MAX_UNREADABLE_SHARE = 0.2;
/**
 * The detail (see detailOf) above which a corner is too busy for text. Set on
 * the photos in assets/backgrounds: faceted roofs, brick facades and fur are
 * above it (0.041 and up), spruces, clouds and blossom below (0.029 at most).
 */
const MAX_DETAIL = 0.035;

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

/** The luminance of each pixel behind the widget, row by row. */
const regionLuminances = (pixels: Uint8Array, width: number) => {
  const height = pixels.length / 3 / width;
  const { left, top, columns, rows } = widgetRegion(width, height);
  const lums: number[] = [];

  for (let y = top; y < top + rows; y++) {
    for (let x = left; x < left + columns; x++) {
      const offset = (y * width + x) * 3;

      lums.push(luminance(pixels[offset], pixels[offset + 1], pixels[offset + 2]));
    }
  }

  return { lums, columns, rows };
};

/**
 * How much fine detail there is: the average step in lightness between
 * neighbouring pixels. Lightness is the square root of luminance, which is
 * closer to how the eye sees it. Text over edges, windows or foliage is hard
 * to read even when the average is not.
 */
const detailOf = (lums: number[], columns: number, rows: number) => {
  let total = 0;
  let steps = 0;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const here = Math.sqrt(lums[y * columns + x]);

      if (x + 1 < columns) {
        total += Math.abs(here - Math.sqrt(lums[y * columns + x + 1]));
        steps++;
      }

      if (y + 1 < rows) {
        total += Math.abs(here - Math.sqrt(lums[(y + 1) * columns + x]));
        steps++;
      }
    }
  }

  return steps > 0 ? total / steps : 0;
};

/**
 * The tone of the top-left of the screen when it shows the photo, from raw RGB
 * pixels (3 bytes each). `poorFit` is set when text wouldn't read well there:
 * neither text colour is readable on a fifth or more of that corner (a
 * mid-tone or high-contrast one), or it's too busy (see MAX_DETAIL).
 */
export const measureTone = (pixels: Uint8Array, width: number): { tone: Tone; poorFit: boolean } => {
  const { lums, columns, rows } = regionLuminances(pixels, width);
  const mean = lums.reduce((sum, value) => sum + value, 0) / lums.length;
  const tone: Tone = contrast(mean, DARK_TEXT) >= contrast(mean, WHITE_TEXT) ? "light" : "dark";
  const text = tone === "light" ? DARK_TEXT : WHITE_TEXT;
  const unreadable = lums.filter((value) => contrast(value, text) < MIN_CONTRAST).length;
  const isUnreadable = unreadable / lums.length > MAX_UNREADABLE_SHARE;

  return { tone, poorFit: isUnreadable || detailOf(lums, columns, rows) > MAX_DETAIL };
};
