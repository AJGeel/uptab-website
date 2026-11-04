import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { hash } from "@/features/home/hash";

/** The hero is a wide banner, so portraits and squares crop badly. */
const MIN_ASPECT_RATIO = 1.4;

/**
 * The photos for the hero and the closing call to action. They are picked from
 * the time, so they change with every rebuild of the cached page and everyone
 * gets the same ones until then. The two never show the same photo.
 */
export const pickPhotos = (images: BackgroundImage[], now = Date.now()) => {
  const wide = images.filter(({ aspectRatio }) => aspectRatio >= MIN_ASPECT_RATIO);
  const pool = (wide.length >= 2 ? wide : images).toSorted((a, b) => a.id.localeCompare(b.id));
  const hero = hash(String(now)) % pool.length;

  return {
    hero: pool[hero],
    cta: pool[(hero + Math.floor(pool.length / 2)) % pool.length],
  };
};
