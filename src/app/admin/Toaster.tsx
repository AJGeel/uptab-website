"use client";

import { Toast } from "@base-ui/react/toast";
import type { ReactNode } from "react";

import type { ActionState } from "./types";

const ToastList = () => {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="relative rounded-lg bg-white py-3 pr-8 pl-4 shadow-lg crispy-outline duration-150 data-ending-style:opacity-0 data-starting-style:translate-x-4 data-starting-style:opacity-0 data-[type=error]:bg-red-50 data-[type=success]:bg-green-50"
    >
      <Toast.Title className="text-sm font-medium text-slate-900" />
      <Toast.Description className="mt-1 text-sm whitespace-pre-line text-slate-600" />
      <Toast.Close
        aria-label="Close"
        className="absolute top-2 right-2 size-6 rounded-sm text-slate-400 hover:text-slate-900"
      >
        ×
      </Toast.Close>
    </Toast.Root>
  ));
};

/** Toasts for every admin page, bottom right, clear of the save bar. */
export const Toaster = ({ children }: { children: ReactNode }) => (
  <Toast.Provider limit={4}>
    {children}
    <Toast.Portal>
      <Toast.Viewport className="fixed right-4 bottom-20 z-50 flex w-80 flex-col gap-2">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  </Toast.Provider>
);

/** Shows an action's outcome as a toast. Errors stay until they're closed. */
export const useActionToast = () => {
  const { add } = Toast.useToastManager();

  return ({ error, message }: ActionState) => {
    if (error) {
      add({
        title: "That didn't work",
        description: error,
        type: "error",
        priority: "high",
        timeout: 0,
      });
    } else if (message) {
      add({ title: message, type: "success" });
    }
  };
};
