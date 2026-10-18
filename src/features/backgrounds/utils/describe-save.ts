import { plural } from "@/utils/plural";

import type { SavedEdits, ThemeEdits } from "./edits";

/** "a, b, c and 7 more", so a big save still fits in a toast. */
const shortList = (ids: string[], shown = 3) =>
  ids.length > shown
    ? `${ids.slice(0, shown).join(", ")} and ${ids.length - shown} more`
    : ids.join(", ");

/** "Saved 12 changes", with what joined or left the catalogue below it. */
export const describeSave = (edits: ThemeEdits, saved: SavedEdits) => {
  const count = edits.photos.length + (edits.theme ? 1 : 0);
  const lines = [
    saved.published.length > 0 &&
      `Published ${saved.published.length}: ${shortList(saved.published)}`,
    saved.unpublished.length > 0 &&
      `Unpublished ${saved.unpublished.length}: ${shortList(saved.unpublished)}`,
  ].filter(Boolean);

  return {
    message: `Saved ${plural(count, "change")}`,
    details: lines.length > 0 ? lines.join("\n") : null,
  };
};
