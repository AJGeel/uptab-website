/**
 * Unsplash downloads are named "<photographer>-<photo ID>-unsplash.<ext>", e.g.
 * "maarten-deckers-t5nxyxcf50i-unsplash.jpg". The name has the credit, but
 * lowercased and dashed, so the author is a best guess the user can correct.
 */
const UNSPLASH_NAME = /^(.+)-([A-Za-z0-9_-]{11})-unsplash\.[^.]+$/;

const titleCase = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

/** The author and link of an Unsplash download's file name, or null for any other name. */
export const parseUnsplashName = (fileName: string) => {
  const match = UNSPLASH_NAME.exec(fileName);

  if (!match) {
    return null;
  }

  const [, authorSlug, photoId] = match;

  return {
    author: titleCase(authorSlug),
    link: `https://unsplash.com/photos/${photoId}`,
  };
};
