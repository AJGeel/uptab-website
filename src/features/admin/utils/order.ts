import type { Change } from "@/features/admin/types/change";
import type { SourceMetadata } from "@/features/backgrounds/utils/metadata";

const assertSameIds = (current: string[], ids: string[], what: string) => {
  if (ids.length !== current.length || !current.every((id) => ids.includes(id))) {
    throw new Error(`The new order must list every ${what} exactly once.`);
  }
};

/** Puts the themes in a new order. The catalogue and the extension follow it. */
export const reorderThemes = (metadata: SourceMetadata, ids: string[]): Change => {
  assertSameIds(metadata.themes.map(({ id }) => id), ids, "theme");

  return {
    metadata: { ...metadata, themes: ids.map((id) => metadata.themes.find((theme) => theme.id === id)!) },
    files: [],
  };
};

/**
 * Puts one theme's photos in a new order. They keep the places in
 * backgrounds.json they already occupy, so other themes' photos don't move.
 */
export const reorderPhotos = (metadata: SourceMetadata, themeId: string, ids: string[]): Change => {
  const photos = metadata.images.filter((image) => image.theme === themeId);

  assertSameIds(photos.map(({ id }) => id), ids, "photo");

  const queue = ids.map((id) => photos.find((photo) => photo.id === id)!);

  return {
    metadata: { ...metadata, images: metadata.images.map((image) => (image.theme === themeId ? queue.shift()! : image)) },
    files: [],
  };
};
