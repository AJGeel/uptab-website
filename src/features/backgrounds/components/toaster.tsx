"use client";

import { Toast } from "@base-ui/react/toast";
import { type ReactNode, useEffect, useState } from "react";

import type { ActionState } from "@/features/backgrounds/types/action-state";

const Spinner = () => (
  <span
    aria-hidden
    className="mt-0.5 size-4 shrink-0 animate-spin rounded-full border-2 border-sky-200 border-t-sky-500"
  />
);

const ToastList = () => {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="relative flex gap-3 rounded-lg bg-white py-3 pr-8 pl-4 shadow-lg crispy-outline duration-150 data-ending-style:opacity-0 data-starting-style:translate-x-4 data-starting-style:opacity-0 data-[type=error]:bg-red-50 data-[type=success]:bg-green-50"
    >
      {toast.type === "loading" && <Spinner />}
      <div className="flex flex-col gap-1">
        <Toast.Title className="text-sm font-medium text-slate-900" />
        <Toast.Description className="text-sm whitespace-pre-line text-slate-600" />
      </div>
      <Toast.Close
        aria-label="Close"
        className="absolute top-2 right-2 size-6 rounded-sm text-slate-400 hover:text-slate-900"
      >
        ×
      </Toast.Close>
    </Toast.Root>
  ));
};

/**
 * Toasts for every admin page, in the bottom right corner with the newest
 * nearest to it. On narrow screens they sit above the theme page's save bar.
 */
export const Toaster = ({ children }: { children: ReactNode }) => (
  <Toast.Provider limit={4}>
    {children}
    <Toast.Portal>
      <Toast.Viewport className="fixed right-4 bottom-4 z-50 flex w-80 flex-col-reverse gap-2 max-lg:bottom-20">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  </Toast.Provider>
);

/** Seconds since it first rendered, so a long task visibly makes progress. */
export const ElapsedTime = ({ label }: { label: string }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);

    return () => clearInterval(timer);
  }, []);

  return `${label} · ${seconds}s`;
};

/** Shows an action's outcome as a toast. Errors stay until they're closed. */
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
