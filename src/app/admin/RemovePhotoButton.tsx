"use client";

import { useTransition } from "react";

import { removePhotoAction } from "./actions";
import { useActionToast } from "./Toaster";
import { buttonClass } from "./ui";

/**
 * Removes a photo straight away, after confirming. A plain button, so it
 * doesn't submit the page's edit form; other rows keep their unsaved edits.
 */
export const RemovePhotoButton = ({ id, file }: { id: string; file: string }) => {
  const [isPending, startTransition] = useTransition();
  const notify = useActionToast();

  const remove = () => {
    if (!window.confirm(`Remove ${id}? This deletes ${file}.`)) {
      return;
    }

    startTransition(async () => {
      notify(await removePhotoAction(id));
    });
  };

  return (
    <button
      type="button"
      onClick={remove}
      disabled={isPending}
      className={`${buttonClass} text-red-600`}
    >
      Remove
    </button>
  );
};
