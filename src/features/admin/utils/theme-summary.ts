import {
  isPublished,
  type SourceEntry,
  type SourceMetadata,
  type SourceTheme,
} from "@/features/backgrounds/utils/metadata";
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
  /** Up to `count` thumbnails: published ones first, in order. */
  thumbnails: string[];
};

/** A theme at a glance, for the theme cards and the theme picker. */
export const summarizeTheme = (
  metadata: SourceMetadata,
  theme: SourceTheme,
  count = 4
): ThemeSummary => {
  const entries = imagesOf(metadata, theme.id);
  const pending = countPending(entries);
  const ranked = [...entries.filter(isPublished), ...entries.filter((entry) => !isPublished(entry))];

  return {
    id: theme.id,
    name: theme.name,
    published: entries.length - pending,
    pending,
    thumbnails: ranked.slice(0, count).map((entry) => thumbnailUrl(entry.file)),
  };
};
