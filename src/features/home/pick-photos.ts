import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { hash } from "@/features/home/hash";

/** How long one hero photo stays. */
export const ROTATION_MS = 1 * 1000;

/** The hero is a wide banner, so portraits and squares crop badly. */
const MIN_ASPECT_RATIO = 1.4;

/**
 * The photos for the hero and the closing call to action. They change every
 * couple of hours, and everyone gets the same ones within a window, so the
 * page can be cached. The two never show the same photo.
 */
export const pickPhotos = (images: BackgroundImage[], now = Date.now()) => {
  const wide = images.filter(({ aspectRatio }) => aspectRatio >= MIN_ASPECT_RATIO);
  const pool = (wide.length >= 2 ? wide : images).toSorted((a, b) => a.id.localeCompare(b.id));
  const hero = hash(String(Math.floor(now / ROTATION_MS))) % pool.length;

  return {
    hero: pool[hero],
    cta: pool[(hero + Math.floor(pool.length / 2)) % pool.length],
  };
};
