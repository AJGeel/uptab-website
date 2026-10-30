import { toHexColor } from "@/features/backgrounds/utils/catalogue";

const HUE_BUCKETS = 12;
/** Greys, near-blacks and near-whites say nothing about a photo's colour. */
const MIN_SATURATION = 0.25;
const MIN_VALUE = 0.2;
/** A colour has to cover at least this share of the photo, or it's just a stray pixel. */
const MIN_SHARE = 0.01;

/**
 * The most prominent vivid colours of a photo, most prominent first, from raw
 * RGB pixels (3 bytes each). Colours are grouped by hue, and each group's
 * average represents it. A monochrome photo has none.
 */
export const extractPalette = (pixels: Uint8Array, count = 3): string[] => {
  const buckets = Array.from({ length: HUE_BUCKETS }, () => ({ r: 0, g: 0, b: 0, size: 0 }));
  const total = pixels.length / 3;

  for (let offset = 0; offset < pixels.length; offset += 3) {
    const [r, g, b] = [pixels[offset], pixels[offset + 1], pixels[offset + 2]];
    const max = Math.max(r, g, b);
    const delta = max - Math.min(r, g, b);

    if (max / 255 < MIN_VALUE || delta / max < MIN_SATURATION) {
      continue;
    }

    let hue = 0;

    if (max === r) {
      hue = ((g - b) / delta + 6) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }

    const bucket = buckets[Math.min(HUE_BUCKETS - 1, Math.floor((hue / 6) * HUE_BUCKETS))];

    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    bucket.size += 1;
  }

  return buckets
    .filter(({ size }) => size / total >= MIN_SHARE)
    .toSorted((a, b) => b.size - a.size)
    .slice(0, count)
    .map(({ r, g, b, size }) => toHexColor({ r: Math.round(r / size), g: Math.round(g / size), b: Math.round(b / size) }));
};
