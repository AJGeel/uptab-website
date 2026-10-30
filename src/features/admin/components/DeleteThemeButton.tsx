"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";

import { Button } from "@/features/admin/components/ui/Button";
import { type ThemeToDelete, useDeleteTheme } from "@/features/admin/hooks/use-delete-theme";

/**
 * Deletes a theme with its photos after confirming, then leaves its page,
 * which no longer exists. A plain button, so it doesn't submit the page's edit form.
 */
export const DeleteThemeButton = (theme: ThemeToDelete) => {
  const router = useRouter();
  // Typed routes skip admin, which is a dev-only page
  const { remove, isPending } = useDeleteTheme(() => router.push("/adminland" as Route));

  return (
    <Button
      type="button"
      onClick={() => remove(theme)}
      disabled={isPending}
      variant="danger"
    >
      Delete theme
    </Button>
  );
};
