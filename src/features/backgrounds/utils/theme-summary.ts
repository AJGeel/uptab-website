import { isPublished } from "@/features/backgrounds/utils/edits";
import type { SourceEntry, SourceMetadata } from "@/features/backgrounds/utils/metadata";
import { thumbnailUrl } from "@/features/backgrounds/utils/paths";

export const imagesOf = (metadata: SourceMetadata, themeId: string) =>
  metadata.images.filter((image) => image.theme === themeId);

export const countPending = (entries: SourceEntry[]) =>
  entries.filter((entry) => !isPublished(entry)).length;

export type ThemeSummary = {
  id: string;
  name: string;
  published: number;
  pending: number;
  /** Up to `count` thumbnails, published photos first. */
  thumbnails: string[];
};

/** A theme at a glance, for the theme cards and the theme picker. */
export const summarizeTheme = (
  metadata: SourceMetadata,
  theme: SourceMetadata["themes"][number],
  count = 4
): ThemeSummary => {
  const entries = imagesOf(metadata, theme.id);
  const pending = countPending(entries);

  return {
    id: theme.id,
    name: theme.name,
    published: entries.length - pending,
    pending,
    thumbnails: [...entries]
      .sort((a, b) => Number(isPublished(b)) - Number(isPublished(a)))
      .slice(0, count)
      .map((entry) => thumbnailUrl(entry.file)),
  };
};
