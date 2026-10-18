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
