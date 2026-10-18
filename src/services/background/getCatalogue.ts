import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Catalogue } from "./types";

export const getCatalogue = async (): Promise<Catalogue> => {
  const file = path.join(process.cwd(), "public/backgrounds/v1/catalogue.json");

  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    throw new Error(
      `Unable to read the backgrounds catalogue, run \`bun run backgrounds\` first: ${error}`
    );
  }
};
