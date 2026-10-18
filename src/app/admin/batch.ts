import { SLUG_HINT, SLUG_PATTERN } from "../../../scripts/backgrounds";
import { toSlug } from "../../../scripts/edits";

/**
 * An ID for a new photo from its file name, unique among `taken`:
 * "Kunsthal Kade.jpg" → "kunsthal-kade", or "kunsthal-kade-2" if that's taken.
 */
export const suggestId = (fileName: string, taken: Set<string>) => {
  const base = toSlug(fileName) || "photo";
  let id = base;

  for (let suffix = 2; taken.has(id); suffix += 1) {
    id = `${base}-${suffix}`;
  }

  return id;
};

/**
 * Why a batch photo's ID can't be uploaded, if anything: checked before
 * uploading, so a whole batch can be fixed in one go. The server checks again.
 */
export const idProblem = (id: string, existing: Set<string>, batchIds: string[]) => {
  if (!SLUG_PATTERN.test(id)) {
    return SLUG_HINT;
  }

  if (existing.has(id)) {
    return "Another photo already has this ID";
  }

  if (batchIds.filter((other) => other === id).length > 1) {
    return "Used twice in this batch";
  }

  return null;
};
