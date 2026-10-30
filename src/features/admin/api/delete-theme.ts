"use server";

import { commitChange, loadState, runAction } from "@/features/admin/api/run-action";
import { deleteTheme } from "@/features/admin/utils/edits";

/** Deletes a theme that has no photos left in it. */
export const deleteThemeAction = async (id: string) =>
  await runAction(async () => {
    const state = await loadState();

    await commitChange(state, deleteTheme(state.metadata, id));

    return `Deleted ${id}`;
  });
