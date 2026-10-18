import { readFile } from "node:fs/promises";

import { CATALOGUE_FILE } from "@/features/backgrounds/api/source-files";
import type { Catalogue } from "@/features/backgrounds/types/catalogue";

export const getCatalogue = async (): Promise<Catalogue> => {
  try {
    return JSON.parse(await readFile(CATALOGUE_FILE, "utf8"));
  } catch (error) {
    throw new Error(
      `Unable to read the backgrounds catalogue, run \`bun run backgrounds\` first: ${error}`
    );
  }
};
