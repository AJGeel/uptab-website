import type { Theme } from "@/features/backgrounds/types/catalogue";

/**
 * The themes the home page shows, in order. Add or remove an ID to change it.
 * Only the first four are used, so the page doesn't overwhelm.
 */
export const FEATURED_THEME_IDS = ["holland", "safari", "mountains", "flower-power"];

const MAX_THEMES = 4;

/** The featured themes that exist in the catalogue; the first few themes if none of them do. */
export const featuredThemes = (themes: Theme[], ids = FEATURED_THEME_IDS) => {
  const featured = ids.flatMap((id) => themes.filter((theme) => theme.id === id)).slice(0, MAX_THEMES);

  return featured.length > 0 ? featured : themes.slice(0, MAX_THEMES);
};
