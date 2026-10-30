/**
 * What every admin Server Action shares: the localhost check, reading the
 * current state and applying a change to disk. A plain server module, not
 * "use server", so none of this is callable from the browser.
 */
import { mkdir, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";

import { isLocalRequest } from "@/features/admin/api/is-local-request";
import type { ActionState } from "@/features/admin/types/action-state";
import type { Change } from "@/features/admin/types/change";
import { assertValidChange } from "@/features/admin/utils/edits";
import {
  listSourceFiles,
  readMetadataJson,
  resolveSourcePath,
  writeMetadata,
} from "@/features/backgrounds/api/source-files";
import { readMetadata, type SourceMetadata } from "@/features/backgrounds/utils/metadata";

export const NOT_LOCAL: ActionState = {
  error: "The admin only works on localhost.",
  message: null,
};

/** Refreshes every admin page, including their status banners. */
export const refreshAdmin = () => revalidatePath("/admin", "layout");

type Outcome = string | { message: string; details: string | null };

/** Runs a task and reports its outcome, refreshing the admin on success. */
export const runAction = async (task: () => Promise<Outcome>): Promise<ActionState> => {
  if (!(await isLocalRequest())) {
    return NOT_LOCAL;
  }

  try {
    const outcome = await task();

    refreshAdmin();

    return typeof outcome === "string"
      ? { error: null, message: outcome }
      : { error: null, ...outcome };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      message: null,
    };
  }
};

export type State = { metadata: SourceMetadata; files: string[] };

export const loadState = async (): Promise<State> => ({
  metadata: readMetadata(await readMetadataJson()),
  files: await listSourceFiles(),
});

/**
 * Validates a change, then writes or moves its files, saves the metadata and
 * deletes files last, so backgrounds.json never points at a missing file.
 */
export const commitChange = async (
  { metadata, files }: State,
  change: Change,
  upload?: Buffer
) => {
  assertValidChange(metadata, files, change);

  for (const file of change.files) {
    if (file.kind === "add" && upload) {
      const to = resolveSourcePath(file.to);

      await mkdir(path.dirname(to), { recursive: true });
      await writeFile(to, upload, { flag: "wx" });
    }

    if (file.kind === "move") {
      const to = resolveSourcePath(file.to);

      await mkdir(path.dirname(to), { recursive: true });
      await rename(resolveSourcePath(file.from), to);
    }
  }

  await writeMetadata(change.metadata);

  for (const file of change.files) {
    if (file.kind === "delete") {
      await unlink(resolveSourcePath(file.from));
    }
  }
};

/** A form field as trimmed text, "" when missing. */
export const formText = (form: FormData, name: string) =>
  String(form.get(name) ?? "").trim();
