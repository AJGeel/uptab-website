import { stat } from "node:fs/promises";
import path from "node:path";

import { cache } from "react";

import {
  listSourceFiles,
  METADATA_FILE,
  readMetadataJson,
} from "../../../scripts/assets";
import {
  listProblems,
  readMetadata,
  type SourceEntry,
  type SourceMetadata,
} from "../../../scripts/backgrounds";

const CATALOGUE_FILE = path.join(process.cwd(), "public/backgrounds/v1/catalogue.json");

export type CatalogueStatus =
  | { state: "missing" }
  | { state: "stale" }
  | { state: "fresh"; generatedAt: Date };

/** Whether backgrounds.json changed since the catalogue was last generated. */
const getCatalogueStatus = async (): Promise<CatalogueStatus> => {
  const [metadata, catalogue] = await Promise.all([
    stat(METADATA_FILE),
    stat(CATALOGUE_FILE).catch(() => null),
  ]);

  if (!catalogue) {
    return { state: "missing" };
  }

  return metadata.mtime > catalogue.mtime
    ? { state: "stale" }
    : { state: "fresh", generatedAt: catalogue.mtime };
};

/**
 * Everything the admin pages show, read once per request. `metadata` is null
 * when backgrounds.json can't be read at all; `problems` then says why.
 */
export const loadAdmin = cache(async () => {
  const [files, json, catalogue] = await Promise.all([
    listSourceFiles(),
    readMetadataJson(),
    getCatalogueStatus(),
  ]);

  try {
    const metadata: SourceMetadata = readMetadata(json);

    return { metadata, problems: listProblems(metadata, files), catalogue };
  } catch (error) {
    return { metadata: null, problems: [(error as Error).message], catalogue };
  }
});

export const imagesOf = (metadata: SourceMetadata, themeId: string) =>
  metadata.images.filter((image) => image.theme === themeId);

export const countPending = (entries: SourceEntry[]) =>
  entries.filter((entry) => entry.creditPending).length;

export const thumbnailUrl = (file: string) =>
  `/admin/photos/${file.split("/").map(encodeURIComponent).join("/")}`;

/** The full-size source photo, downloaded rather than shown. */
export const originalUrl = (file: string) => `${thumbnailUrl(file)}?original`;

/*
 * Before remote backgrounds, the live site served the source photos at
 * /backgrounds/<theme>/<file>. Reverse image search needs a public URL, and
 * these keep working until that deploy is replaced.
 */
const LIVE_BACKGROUNDS = "https://uptab.vercel.app/backgrounds/";
const publicUrls = new Map<string, Promise<string | null>>();

/** The photo's public URL on the live site, if it's still there. */
export const findPublicUrl = (file: string) => {
  const cached = publicUrls.get(file);

  if (cached) {
    return cached;
  }

  const url = `${LIVE_BACKGROUNDS}${file}`;
  const check = fetch(url, { method: "HEAD", signal: AbortSignal.timeout(3000) })
    .then((response) => (response.ok ? url : null))
    .catch(() => null)
    .then((found) => {
      // Only remember hits, so a network hiccup is retried on the next load
      if (!found) {
        publicUrls.delete(file);
      }

      return found;
    });

  publicUrls.set(file, check);

  return check;
};
