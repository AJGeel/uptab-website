"use server";

import { commitChange, loadState, runAction } from "@/features/admin/api/run-action";
import { removePhoto } from "@/features/admin/utils/edits";

/** Removes a photo and its file. Extensions simply stop showing it. */
export const removePhotoAction = async (id: string) =>
  await runAction(async () => {
    const state = await loadState();

    await commitChange(state, removePhoto(state.metadata, id));

    return `Removed ${id}`;
  });
