"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useState, useTransition } from "react";

import { removePhotoAction } from "@/features/admin/api/remove-photo";
import { Button, buttonClass } from "@/features/admin/components/ui/Button";
import { FadeImage } from "@/features/admin/components/ui/FadeImage";
import { jetBrainsMono } from "@/features/admin/components/ui/mono-font";
import { useActionToast } from "@/features/admin/hooks/use-action-toast";
import { thumbnailUrl } from "@/features/backgrounds/utils/paths";

/**
 * Removes a photo after confirming in a modal that shows it. A plain button,
 * so it doesn't submit the page's edit form; other rows keep their unsaved edits.
 */
export const RemovePhotoButton = ({ id, file }: { id: string; file: string }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const notify = useActionToast();

  const remove = () =>
    startTransition(async () => {
      notify(await removePhotoAction(id));
      setOpen(false);
    });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Button type="button" onClick={() => setOpen(true)} variant="danger">
        Remove
      </Button>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-1/2 rounded-2xl bg-[#1b2638] p-6 text-dark-text shadow-2xl ring-1 ring-[#33465f] duration-150 ring-inset data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <FadeImage
            unoptimized
            src={thumbnailUrl(file)}
            width={384}
            height={216}
            alt={id}
            className="aspect-video w-full rounded-lg bg-dark-pill object-cover"
          />
          <Dialog.Title className="mt-5 text-lg font-bold">Remove this photo?</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-[#7f8da0]">
            <span className="font-semibold text-dark-text">{id}</span> and its file,{" "}
            <span className={`${jetBrainsMono.className} text-xs text-dark-text`}>{file}</span>, are deleted for good.
            Extensions simply stop showing it.
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close type="button" className={buttonClass("ghost")}>
              Cancel
            </Dialog.Close>
            <Button type="button" variant="danger" onClick={remove} disabled={isPending}>
              {isPending ? "Removing…" : "Remove photo"}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
