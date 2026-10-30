/**
 * Edits to backgrounds.json made by the local admin. Each edit returns the
 * new metadata and the file changes it needs, without touching the disk, so
 * the rules can be tested and validated before anything is written.
 */
import type { Change, FileChange } from "@/features/admin/types/change";
import { extensionOf } from "@/features/backgrounds/utils/image-formats";

import {
  findEntry,
  isPublished,
  listProblems,
  type SourceEntry,
  type SourceMetadata,
} from "../../backgrounds/utils/metadata";

export type PhotoFields = {
  id: string;
  theme: string;
  author: string;
  link: string;
};

/** Turns a file name into an ID, e.g. "Kunsthal Kade.JPG" → "kunsthal-kade". */
export const toSlug = (name: string) =>
  name
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const replaceEntry = (
  metadata: SourceMetadata,
  id: string,
  next: SourceEntry
): SourceMetadata => ({
  ...metadata,
  images: metadata.images.map((image) => (image.id === id ? next : image)),
});

/*
 * A photo is published exactly when it has an author: the one required
 * credit. Without one it's pending, so it stays out of the catalogue.
 */
const credit = ({ author, link }: { author: string; link: string }) => {
  const trimmedAuthor = author.trim();

  return {
    author: trimmedAuthor || null,
    link: link.trim() || null,
    ...(trimmedAuthor ? {} : { creditPending: true as const }),
  };
};

/**
 * Adds a theme. It stays out of the catalogue until it has a published
 * photo. The ID is fixed from here on, because users' settings store it.
 */
export const createTheme = (
  metadata: SourceMetadata,
  { id, name }: { id: string; name: string }
): Change => ({
  metadata: {
    ...metadata,
    themes: [...metadata.themes, { id: id || toSlug(name), name: name.trim() }],
  },
  files: [],
});

/** Changes a theme's display name. Its ID stays the same. */
export const renameTheme = (
  metadata: SourceMetadata,
  id: string,
  name: string
): Change => {
  if (!metadata.themes.some((theme) => theme.id === id)) {
    throw new Error(`No theme with ID "${id}".`);
  }

  return {
    metadata: {
      ...metadata,
      themes: metadata.themes.map((theme) =>
        theme.id === id ? { ...theme, name: name.trim() } : theme
      ),
    },
    files: [],
  };
};

/** Removes a theme with all its photos and their files. */
export const deleteTheme = (metadata: SourceMetadata, id: string): Change => {
  if (!metadata.themes.some((theme) => theme.id === id)) {
    throw new Error(`No theme with ID "${id}".`);
  }

  const photos = metadata.images.filter((image) => image.theme === id);

  return {
    metadata: {
      themes: metadata.themes.filter((theme) => theme.id !== id),
      images: metadata.images.filter((image) => image.theme !== id),
    },
    files: photos.map((photo) => ({ kind: "delete", from: photo.file })),
  };
};

/**
 * Adds an uploaded photo, stored as <theme>/<id><extension>. It's published
 * straight away when it comes with an author.
 */
export const addPhoto = (
  metadata: SourceMetadata,
  fields: PhotoFields & { extension: string }
): Change => {
  const file = `${fields.theme}/${fields.id}${fields.extension}`;

  return {
    metadata: {
      ...metadata,
      images: [
        ...metadata.images,
        { id: fields.id, theme: fields.theme, file, ...credit(fields) },
      ],
    },
    files: [{ kind: "add", to: file }],
  };
};

/**
 * Saves a photo's fields. It's published when it has an author and pending
 * when it doesn't. A pending photo can be renamed or moved, which moves its
 * file too. While published, the ID and theme are fixed, because extensions
 * may store them.
 */
export const savePhoto = (
  metadata: SourceMetadata,
  id: string,
  fields: PhotoFields
): Change => {
  const entry = findEntry(metadata, id);
  const isMoved = fields.id !== entry.id || fields.theme !== entry.theme;

  if (isPublished(entry) && isMoved) {
    throw new Error(
      `${entry.id}: published photos keep their ID and theme, because installed extensions may have stored them.`
    );
  }

  const file = isMoved
    ? `${fields.theme}/${fields.id}${extensionOf(entry.file)}`
    : entry.file;

  const next = { id: fields.id, theme: fields.theme, file, ...credit(fields) };
  const saved = replaceEntry(metadata, id, next);

  return {
    metadata: saved,
    files: isMoved ? [{ kind: "move", from: entry.file, to: file }] : [],
  };
};

export type ThemeEdits = {
  theme?: { id: string; name: string };
  photos: { originalId: string; fields: PhotoFields }[];
};

export type SavedEdits = Change & {
  /** IDs that joined or left the catalogue with this save. */
  published: string[];
  unpublished: string[];
};

/** Applies everything changed on a theme's page as one save. */
export const saveEdits = (metadata: SourceMetadata, edits: ThemeEdits): SavedEdits => {
  let change: Change = edits.theme
    ? renameTheme(metadata, edits.theme.id, edits.theme.name)
    : { metadata, files: [] };

  for (const { originalId, fields } of edits.photos) {
    const next = savePhoto(change.metadata, originalId, fields);

    change = { metadata: next.metadata, files: [...change.files, ...next.files] };
  }

  const transitions = edits.photos.map(({ originalId, fields }) => ({
    id: fields.id,
    was: isPublished(findEntry(metadata, originalId)),
    is: isPublished(findEntry(change.metadata, fields.id)),
  }));

  return {
    ...change,
    published: transitions.filter(({ was, is }) => !was && is).map(({ id }) => id),
    unpublished: transitions.filter(({ was, is }) => was && !is).map(({ id }) => id),
  };
};

/** Removes a photo and its file. Extensions simply stop showing it. */
export const removePhoto = (metadata: SourceMetadata, id: string): Change => {
  const entry = findEntry(metadata, id);

  return {
    metadata: {
      themes: metadata.themes,
      images: metadata.images.filter((image) => image.id !== id),
    },
    files: [{ kind: "delete", from: entry.file }],
  };
};

const applyToFiles = (files: string[], change: FileChange) => {
  switch (change.kind) {
    case "add":
      return [...files, change.to];
    case "move":
      return files.map((file) => (file === change.from ? change.to : file));
    case "delete":
      return files.filter((file) => file !== change.from);
    default:
      return files;
  }
};

/**
 * Throws when a change introduces a problem. Problems that were already
 * there don't block it, so a broken folder can still be fixed from the tool.
 */
export const assertValidChange = (
  before: SourceMetadata,
  files: string[],
  { metadata, files: changes }: Change
) => {
  let after = files;

  for (const change of changes) {
    // Every target must be free, also of files other changes in this save move
    if (change.kind !== "delete" && after.includes(change.to)) {
      throw new Error(`A file already exists at ${change.to}.`);
    }

    after = applyToFiles(after, change);
  }

  const existing = listProblems(before, files);
  const introduced = listProblems(metadata, after).filter(
    (problem) => !existing.includes(problem)
  );

  if (introduced.length > 0) {
    throw new Error(introduced.join("\n"));
  }
};
