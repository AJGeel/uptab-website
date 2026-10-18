"use client";

import { Toast } from "@base-ui/react/toast";
import { useState, useTransition } from "react";

import { rebuildAction } from "@/features/backgrounds/api/actions";
import type { ActionState } from "@/features/backgrounds/types/action-state";

import { ElapsedTime } from "./Toaster";
import { buttonClass } from "./ui";

/**
 * Runs the build script with a progress toast, which turns into the outcome
 * once it's done. The log stays available below the button.
 */
export const RebuildButton = () => {
  const [log, setLog] = useState<{ text: string; failed: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { promise } = Toast.useToastManager();

  const rebuild = () => {
    startTransition(async () => {
      const run = rebuildAction().then((result) =>
        result.error ? Promise.reject(result) : result
      );

      const result = await promise<ActionState>(run, {
        loading: {
          title: "Preparing backgrounds…",
          description: <ElapsedTime label="Encoding WebP renditions" />,
          type: "loading",
        },
        // Replace the loading description, which the update would otherwise keep
        success: (done) => ({
          title: done.message,
          description: "The gallery and catalogue.json now show your latest changes.",
          type: "success",
        }),
        error: (failed: ActionState) => ({
          title: "Rebuild failed",
          description: failed.error,
          type: "error",
          priority: "high",
          timeout: 0,
        }),
      }).catch((failed: ActionState) => failed);

      startTransition(() =>
        setLog(result.log ? { text: result.log, failed: Boolean(result.error) } : null)
      );
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={rebuild}
        disabled={isPending}
        className={buttonClass("dark")}
      >
        {isPending ? "Rebuilding…" : "Rebuild catalogue"}
      </button>
      {log && (
        <details open={log.failed} className="basis-full text-sm">
          <summary className="cursor-pointer">Show log</summary>
          <pre className="mt-2 max-h-96 overflow-auto rounded-sm bg-slate-900 p-3 text-xs whitespace-pre-wrap text-slate-100">
            {log.text}
          </pre>
        </details>
      )}
    </>
  );
};
