"use server";

import { commitChange, loadState, runAction } from "@/features/backgrounds/api/run-action";
import { describeSave } from "@/features/backgrounds/utils/describe-save";
import { saveEdits } from "@/features/backgrounds/utils/edits";
import { readEdits } from "@/features/backgrounds/utils/read-edits";

/** Saves everything changed on a theme's page in one go. */
export const saveThemeAction = async (form: FormData) =>
  await runAction(async () => {
    const state = await loadState();
    const edits = readEdits(form);
    const saved = saveEdits(state.metadata, edits);

    await commitChange(state, saved);

    return describeSave(edits, saved);
  });
