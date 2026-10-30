"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";
import { useRef, useState, useTransition } from "react";

import { createThemeAction } from "@/features/admin/api/create-theme";
import { suggestThemesAction } from "@/features/admin/api/suggest-themes";
import { AiLabel } from "@/features/admin/components/ui/AiLabel";
import { Button, buttonClass } from "@/features/admin/components/ui/Button";
import { Field } from "@/features/admin/components/ui/Field";
import { Input } from "@/features/admin/components/ui/Input";
import { useActionToast } from "@/features/admin/hooks/use-action-toast";
import { toSlug } from "@/features/admin/utils/edits";
import { type ThemeSuggestion, unsplashSearchUrl } from "@/features/admin/utils/theme-suggestions";

import { ActionForm } from "./ActionForm";


/**
 * Creates a theme in a modal, opened from the first card of the overview.
 * Reports the new theme's ID, worked out the same way the server does.
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
  const nameRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<ThemeSuggestion[]>([]);
  const [isSuggesting, startSuggesting] = useTransition();
  const notify = useActionToast();

  const suggest = () =>
    startSuggesting(async () => {
      const result = await suggestThemesAction();

      if (result.error === null) {
        setSuggestions(result.suggestions);
      } else {
        notify({ error: result.error, message: null });
      }
    });

  const pick = (name: string) => {
    if (nameRef.current) {
      nameRef.current.value = name;
      nameRef.current.focus();
    }
  };

  const created = (data: FormData) => {
    onCreated(toSlug(String(data.get("name") ?? "")));
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-1/2 rounded-2xl bg-[#1b2638] p-6 text-dark-text shadow-2xl ring-1 ring-[#33465f] duration-150 ring-inset data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <Dialog.Title className="text-lg font-bold">New theme</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-[#7f8da0]">
            It joins the catalogue once it has a published photo. The ID is
            fixed once created.
          </Dialog.Description>
          <ActionForm
            action={createThemeAction}
            onSuccess={created}
            className="mt-5 flex flex-col gap-3"
          >
            <Field label="Name">
              <Input
                ref={nameRef}
                name="name"
                required
                autoFocus
                placeholder="e.g. Mountains"
              />
            </Field>
            <div className="flex flex-col gap-2">
              <Button type="button" variant="dark" onClick={suggest} disabled={isSuggesting} className="self-start">
                <AiLabel isPending={isSuggesting}>{suggestions.length > 0 ? "More ideas" : "Suggest themes"}</AiLabel>
              </Button>
              {suggestions.length > 0 && (
                <ul className="flex max-h-56 flex-col gap-1 overflow-auto">
                  {suggestions.map(({ name, why, search }) => (
                    <li key={name} className="flex items-stretch gap-1">
                      <button
                        type="button"
                        onClick={() => pick(name)}
                        className="flex min-w-0 flex-1 flex-col rounded-lg bg-[#0b121c] px-3 py-2 text-left duration-150 hover:bg-amber-300/15"
                      >
                        <span className="text-sm font-bold text-white">{name}</span>
                        <span className="text-xs text-[#7f8da0]">{why}</span>
                      </button>
                      <a
                        href={unsplashSearchUrl(search)}
                        target="_blank"
                        rel="noreferrer"
                        title={`Search Unsplash for "${search}"`}
                        aria-label={`Search Unsplash for ${search}`}
                        className="flex w-9 shrink-0 items-center justify-center rounded-lg bg-[#0b121c] text-[#7f8da0] duration-150 hover:bg-amber-300/15 hover:text-amber-300"
                      >
                        <ArrowTopRightOnSquareIcon className="size-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <Dialog.Close type="button" className={buttonClass("ghost")}>
                Cancel
              </Dialog.Close>
              <Button variant="primary">Create theme</Button>
            </div>
          </ActionForm>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
