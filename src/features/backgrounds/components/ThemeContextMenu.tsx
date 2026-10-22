"use client";

import { ContextMenu } from "@base-ui/react/context-menu";
import type { ReactNode } from "react";

import { type ThemeToDelete, useDeleteTheme } from "@/features/backgrounds/hooks/use-delete-theme";

/** Right-click a theme's card to delete it without opening it. */
export const ThemeContextMenu = ({
  theme,
  children,
}: {
  theme: ThemeToDelete;
  children: ReactNode;
}) => {
  const { remove, isPending } = useDeleteTheme();

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="h-full">{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner className="z-50">
          <ContextMenu.Popup className="min-w-40 rounded-lg bg-white p-1 shadow-xl crispy-outline">
            <ContextMenu.Item
              disabled={isPending}
              onClick={() => remove(theme)}
              className="flex cursor-pointer items-center rounded-md p-2 text-sm font-medium text-danger outline-none data-highlighted:bg-danger/10"
            >
              Delete theme
            </ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};
