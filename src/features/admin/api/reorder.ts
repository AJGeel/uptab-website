"use server";

import { commitChange, loadState, runAction } from "@/features/admin/api/run-action";
import { reorderPhotos, reorderThemes } from "@/features/admin/utils/order";

export const reorderThemesAction = async (ids: string[]) =>
  await runAction(async () => {
    const state = await loadState();

    await commitChange(state, reorderThemes(state.metadata, ids));

    return "Saved the new theme order";
  });

export const reorderPhotosAction = async (themeId: string, ids: string[]) =>
  await runAction(async () => {
    const state = await loadState();

    await commitChange(state, reorderPhotos(state.metadata, themeId, ids));

    return "Saved the new photo order";
  });
