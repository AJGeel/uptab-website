"use client";

import { Toast } from "@base-ui/react/toast";

import type { ActionState } from "@/features/admin/types/action-state";

/** Shows an admin action's outcome as a toast. Errors stay until they're closed. */
export const useActionToast = () => {
  const { add } = Toast.useToastManager();

  return ({ error, message, details }: ActionState) => {
    if (error) {
      add({
        title: "That didn't work",
        description: error,
        type: "error",
        priority: "high",
        timeout: 0,
      });
    } else if (message) {
      add({ title: message, description: details, type: "success" });
    }
  };
};
