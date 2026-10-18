"use client";

import { Dialog } from "@base-ui/react/dialog";

import { createThemeAction } from "@/features/backgrounds/api/actions";
import { toSlug } from "@/features/backgrounds/utils/edits";

import { ActionForm } from "./ActionForm";
import { buttonClass, Field, inputClass } from "./ui";


/**
 * Creates a theme in a modal, opened from the theme picker. Reports the new
 * theme's ID, worked out the same way the server does, so it can be selected.
 */
export const NewThemeDialog = ({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (id: string) => void;
}) => {
  const created = (data: FormData) => {
    const id = String(data.get("id") ?? "").trim();

    onCreated(id || toSlug(String(data.get("name") ?? "")));
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-1/2 rounded-lg bg-white p-6 shadow-xl crispy-outline duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <Dialog.Title className="text-lg font-bold">New theme</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-slate-500">
            It joins the catalogue once it has a published photo. The ID is
            fixed once created.
          </Dialog.Description>
          <ActionForm
            action={createThemeAction}
            onSuccess={created}
            className="mt-5 flex flex-col gap-3"
          >
            <Field label="Name">
              <input
                name="name"
                required
                autoFocus
                placeholder="e.g. Mountains"
                className={inputClass}
              />
            </Field>
            <Field label="ID (optional)">
              <input name="id" placeholder="From the name" className={inputClass} />
            </Field>
            <div className="mt-2 flex justify-end gap-2">
              <Dialog.Close type="button" className={buttonClass("ghost")}>
                Cancel
              </Dialog.Close>
              <button className={buttonClass("primary")}>Create theme</button>
            </div>
          </ActionForm>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
