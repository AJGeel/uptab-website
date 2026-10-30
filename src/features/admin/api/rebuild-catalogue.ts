"use server";

import { execFile } from "node:child_process";
import { promisify, stripVTControlCharacters } from "node:util";

import { revalidatePath } from "next/cache";

import { isLocalRequest } from "@/features/admin/api/is-local-request";
import { NOT_LOCAL, refreshAdmin } from "@/features/admin/api/run-action";
import type { ActionState } from "@/features/admin/types/action-state";

const execFileAsync = promisify(execFile);

let isRebuilding = false;

/** Runs the build script, as `prebuild` does, and returns its log. */
export const rebuildAction = async (): Promise<ActionState> => {
  if (!(await isLocalRequest())) {
    return NOT_LOCAL;
  }

  // Two runs at once would both clear and rewrite the generated catalogue
  if (isRebuilding) {
    return { error: "A rebuild is already running.", message: null };
  }

  isRebuilding = true;

  try {
    const { stdout, stderr } = await execFileAsync(
      "bun",
      ["scripts/build-backgrounds.ts"],
      { cwd: process.cwd(), maxBuffer: 10 * 1024 * 1024 }
    );

    refreshAdmin();
    revalidatePath("/backgrounds");

    return {
      error: null,
      message: "Catalogue rebuilt",
      log: stripVTControlCharacters(stdout + stderr),
    };
  } catch (error) {
    const { stdout = "", stderr = "" } = error as { stdout?: string; stderr?: string };

    return {
      error: "The build script failed. See the log below the rebuild button.",
      message: null,
      log: stripVTControlCharacters(stdout + stderr) || String(error),
    };
  } finally {
    isRebuilding = false;
  }
};
