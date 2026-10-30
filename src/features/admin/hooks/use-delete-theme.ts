"use client";

import { useTransition } from "react";

import { deleteThemeAction } from "@/features/admin/api/delete-theme";
import { useActionToast } from "@/features/admin/hooks/use-action-toast";

export type ThemeToDelete = { id: string; name: string; photoCount: number };

/** Confirms, then deletes a theme with its photos. `onDeleted` runs on success. */
export const useDeleteTheme = (onDeleted?: () => void) => {
  const [isPending, startTransition] = useTransition();
  const notify = useActionToast();

  const remove = ({ id, name, photoCount }: ThemeToDelete) => {
    const photos = photoCount === 0 ? "" : ` and its ${photoCount} photo(s) and their files`;

    if (!window.confirm(`Delete the theme "${name}"${photos}? Its ID (${id}) won't come back.`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteThemeAction(id);

      notify(result);

      if (!result.error) {
        onDeleted?.();
      }
    });
  };

  return { remove, isPending };
};
