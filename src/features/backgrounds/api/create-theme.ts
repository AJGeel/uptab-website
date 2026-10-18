"use server";

import {
  commitChange,
  formText,
  loadState,
  runAction,
} from "@/features/backgrounds/api/run-action";
import { createTheme } from "@/features/backgrounds/utils/edits";

/** Creates a theme from the new theme dialog. Its ID comes from the name unless given. */
export const createThemeAction = async (form: FormData) =>
  await runAction(async () => {
    const state = await loadState();
    const change = createTheme(state.metadata, {
      id: formText(form, "id"),
      name: formText(form, "name"),
    });

    await commitChange(state, change);

    return `Created ${change.metadata.themes.at(-1)?.name}`;
  });
