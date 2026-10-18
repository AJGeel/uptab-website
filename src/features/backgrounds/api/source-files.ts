/**
 * File access for backgrounds, shared by the build script and the local
 * admin: the sources in assets/backgrounds/ and the generated catalogue.
 * Paths are based on the working directory, which is the project root for
 * both `bun run` and `next dev`.
 */
import { readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { isImageFile } from "@/features/backgrounds/utils/image-formats";
import type { SourceMetadata } from "@/features/backgrounds/utils/metadata";
import { CATALOGUE_DIR } from "@/features/backgrounds/utils/paths";

export const SOURCE_DIR = path.join(process.cwd(), "assets/backgrounds");
export const METADATA_FILE = path.join(SOURCE_DIR, "backgrounds.json");
export const OUTPUT_DIR = path.join(process.cwd(), "public", CATALOGUE_DIR);
export const CATALOGUE_FILE = path.join(OUTPUT_DIR, "catalogue.json");

/** Image files relative to SOURCE_DIR, e.g. "holland/koppelpoort.jpg". */
export const listSourceFiles = async () => {
  const entries = await readdir(SOURCE_DIR, { recursive: true });

  return entries
    .filter((entry) => isImageFile(entry))
    .map((entry) => entry.split(path.sep).join("/"))
    .sort();
};

export const readMetadataJson = () => readFile(METADATA_FILE, "utf8");

/**
 * Writes to "<file>.temp" first, then renames it over the file. A rename
 * replaces the file in one step, so a failed or interrupted write never
 * leaves it half-written.
 */
export const writeFileAtomically = async (file: string, content: string) => {
  const temp = `${file}.temp`;

  try {
    await writeFile(temp, content);
    await rename(temp, file);
  } catch (error) {
    // Clean up, but report the original error rather than a cleanup one
    await rm(temp, { force: true }).catch(() => undefined);
    throw error;
  }
};

/** Same formatting as the hand-written file, so diffs stay small. */
export const writeMetadata = (metadata: SourceMetadata) =>
  writeFileAtomically(METADATA_FILE, `${JSON.stringify(metadata, null, 2)}\n`);

/**
 * Resolves a path relative to SOURCE_DIR, refusing anything that would end
 * up outside it, e.g. "../../.env".
 */
export const resolveSourcePath = (relative: string) => {
  const resolved = path.resolve(SOURCE_DIR, relative);

  if (!resolved.startsWith(`${SOURCE_DIR}${path.sep}`)) {
    throw new Error(`Path is outside assets/backgrounds: ${relative}`);
  }

  return resolved;
};
