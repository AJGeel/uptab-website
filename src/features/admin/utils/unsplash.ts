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

const PHOTO_PATH = /^\/photos?\/([^/]+)/;

/**
 * The photo ID of an Unsplash page URL, or null for anything else. Page URLs
 * end in "<description-words>-<photo ID>", or are just the ID.
 */
export const parseUnsplashUrl = (text: string) => {
  try {
    const { hostname, pathname } = new URL(text.trim());
    const segment = PHOTO_PATH.exec(pathname)?.[1];

    if (!/^(www\.)?unsplash\.com$/.test(hostname) || !segment) {
      return null;
    }

    const id = segment.length === 11 ? segment : segment.slice(-11);

    return segment.length === 11 || segment.at(-12) === "-" ? id : null;
  } catch {
    return null;
  }
};
