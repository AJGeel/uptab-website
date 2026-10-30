import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";

/** Each photographer once, alphabetically: "Ann, Bo and Cy". */
export const creditLine = (images: BackgroundImage[]) => {
  const authors = [...new Set(images.flatMap(({ author }) => (author ? [author] : [])))].sort((a, b) =>
    a.localeCompare(b)
  );

  return authors.length > 1
    ? `${authors.slice(0, -1).join(", ")} and ${authors[authors.length - 1]}`
    : (authors[0] ?? "");
};
