import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";

import { writeFileAtomically } from "@/features/backgrounds/api/source-files";

// Vercel restores .next/cache between builds, so unchanged photos skip encoding
export const CACHE_DIR = path.join(process.cwd(), ".next/cache/backgrounds");

export const sha256 = (data: Buffer | string) => createHash("sha256").update(data).digest("hex");

/**
 * Remembers expensive build outputs by key. `version` is part of every key,
 * so changing encoder settings or upgrading sharp invalidates everything.
 */
export const createRenditionCache = async (version: string, dir = CACHE_DIR) => {
  await mkdir(dir, { recursive: true });

  const used = new Set<string>();

  const remember = async (parts: (string | number)[], create: () => Promise<Buffer>) => {
    const name = sha256(JSON.stringify([version, ...parts]));
    const file = path.join(dir, name);

    used.add(name);

    const cached = await readFile(file).catch(() => null);

    if (cached) {
      return { data: cached, hit: true };
    }

    const created = await create();

    await writeFileAtomically(file, created);

    return { data: created, hit: false };
  };

  /** Removes entries this build didn't use, so the cache doesn't keep growing. */
  const prune = async () => {
    const stale = (await readdir(dir)).filter((name) => !used.has(name));

    await Promise.all(stale.map((name) => rm(path.join(dir, name), { force: true })));

    return stale.length;
  };

  return { remember, prune };
};
