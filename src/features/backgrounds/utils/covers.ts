import type { Change } from "@/features/backgrounds/types/change";
import {
  findEntry,
  isPublished,
  MAX_COVER_IMAGES,
  type SourceMetadata,
  type SourceTheme,
} from "@/features/backgrounds/utils/metadata";

const withCovers = (theme: SourceTheme, covers: string[]): SourceTheme =>
  covers.length > 0 ? { ...theme, coverImageIds: covers } : { id: theme.id, name: theme.name };

// Published photos keep their ID and theme, so a cover photo only leaves by being unpublished or removed
export const dropFromCovers = (themes: SourceTheme[], photoId: string) =>
  themes.map((theme) =>
    theme.coverImageIds?.includes(photoId)
      ? withCovers(theme, theme.coverImageIds.filter((id) => id !== photoId))
      : theme
  );

export const toggleCover = (metadata: SourceMetadata, imageId: string): Change => {
  const entry = findEntry(metadata, imageId);

  if (!isPublished(entry)) {
    throw new Error(`${imageId} isn't published yet. Add an author first.`);
  }

  return {
    metadata: {
      ...metadata,
      themes: metadata.themes.map((theme) => {
        if (theme.id !== entry.theme) {
          return theme;
        }

        const covers = theme.coverImageIds ?? [];

        if (covers.includes(imageId)) {
          return withCovers(theme, covers.filter((id) => id !== imageId));
        }

        if (covers.length >= MAX_COVER_IMAGES) {
          throw new Error(`A cover has at most ${MAX_COVER_IMAGES} photos. Take one out first.`);
        }

        return withCovers(theme, [...covers, imageId]);
      }),
    },
    files: [],
  };
};
