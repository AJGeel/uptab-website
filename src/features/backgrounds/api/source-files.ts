/**
 * File access for assets/backgrounds/, shared by the build script and the
 * local photo manager. Paths are based on the working directory, which is
 * the project root for both `bun run` and `next dev`.
 */
import { readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import type { SourceMetadata } from "@/features/backgrounds/utils/metadata";

export const SOURCE_DIR = path.join(process.cwd(), "assets/backgrounds");
export const METADATA_FILE = path.join(SOURCE_DIR, "backgrounds.json");
export const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|avif|tiff?)$/i;

/** Image files relative to SOURCE_DIR, e.g. "holland/koppelpoort.jpg". */
export const listSourceFiles = async () => {
  const entries = await readdir(SOURCE_DIR, { recursive: true });

  return entries
    .filter((entry) => IMAGE_EXTENSIONS.test(entry))
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
