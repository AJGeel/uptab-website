"use client";

import { type FormEvent, type ReactNode, useState, useTransition } from "react";

import { useActionToast } from "./Toaster";
import type { ActionState } from "./types";

type ActionFormProps = {
  action: (form: FormData) => Promise<ActionState>;
  /** Clears the fields after a successful submit, e.g. for uploads. */
  resetOnSuccess?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Submits a form to a Server Action and shows the outcome as a toast. Fields
 * keep their values when the action fails, so nothing needs retyping.
 */
export const ActionForm = ({
  action,
  resetOnSuccess = false,
  className,
  children,
}: ActionFormProps) => {
  const [log, setLog] = useState<{ text: string; failed: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const notify = useActionToast();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const { submitter } = event.nativeEvent as SubmitEvent;
    const data = new FormData(form, submitter);

    startTransition(async () => {
      const result = await action(data);

      notify(result);
      startTransition(() =>
        setLog(result.log ? { text: result.log, failed: Boolean(result.error) } : null)
      );

      if (!result.error && resetOnSuccess) {
        form.reset();
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className={className}>
      <fieldset disabled={isPending} className="contents">
        {children}
      </fieldset>
      {log && (
        <details open={log.failed} className="basis-full text-sm">
          <summary className="cursor-pointer">Show log</summary>
          <pre className="mt-2 max-h-96 overflow-auto rounded-sm bg-slate-900 p-3 text-xs whitespace-pre-wrap text-slate-100">
            {log.text}
          </pre>
        </details>
      )}
    </form>
  );
};
