"use server";

import { commitChange, loadState, runAction } from "@/features/backgrounds/api/run-action";
import { toggleCover } from "@/features/backgrounds/utils/covers";

export const toggleCoverAction = async (imageId: string) =>
  await runAction(async () => {
    const state = await loadState();
    const change = toggleCover(state.metadata, imageId);
    const isCover = change.metadata.themes.some((theme) => theme.coverImageIds?.includes(imageId));

    await commitChange(state, change);

    return isCover ? `Added ${imageId} to the cover` : `Took ${imageId} out of the cover`;
  });
