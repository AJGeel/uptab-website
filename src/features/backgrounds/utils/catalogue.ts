/** Assembling the public catalogue from encoded photos, see types/catalogue.ts. */
import { createHash } from "node:crypto";

import type {
  BackgroundImage,
  Catalogue,
  Theme,
} from "@/features/backgrounds/types/catalogue";

/** Rendition widths. Larger ones can be added later without breaking v1. */
export const WIDTHS = [1920, 2560, 3840];

// Sized for the extension's theme picker: a 2×2 mosaic of ~100 px tiles, at 2× density
export const THUMBNAIL_WIDTH = 240;

/** Never upscale, and always produce at least one rendition. */
export const pickWidths = (sourceWidth: number) => {
  const widths = WIDTHS.filter((width) => width <= sourceWidth);

  return widths.length > 0 ? widths : [sourceWidth];
};

export const toHexColor = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;

export const buildCatalogue = (
  themes: Theme[],
  images: BackgroundImage[],
  generatedAt = new Date()
): Catalogue => {
  const content = {
    // Leave out empty themes, so the extension never offers one
    themes: themes.filter(({ id }) => images.some((image) => image.theme === id)),
    images,
  };

  return {
    version: 1,
    generatedAt: generatedAt.toISOString(),
    revision: createHash("sha256").update(JSON.stringify(content)).digest("hex").slice(0, 12),
    ...content,
  };
};
