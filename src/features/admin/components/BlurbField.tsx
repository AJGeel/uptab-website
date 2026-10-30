"use client";

import { SparklesIcon } from "@heroicons/react/16/solid";
import { useRef, useTransition } from "react";

import { generateBlurbAction } from "@/features/admin/api/generate-blurb";
import { Button } from "@/features/admin/components/ui/Button";
import { Field } from "@/features/admin/components/ui/Field";
import { Input } from "@/features/admin/components/ui/Input";
import { useActionToast } from "@/features/admin/hooks/use-action-toast";

/**
 * A theme's blurb, joined to the edit form through `form`. "Generate" fills
 * it from a local Ollama model; nothing is saved until the save bar is used.
 */
export const BlurbField = ({
  defaultValue,
  form,
}: {
  defaultValue: string;
  form: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const notify = useActionToast();

  const generate = () =>
    startTransition(async () => {
      const input = inputRef.current;
      const name = (input?.form?.elements.namedItem("theme:name") as HTMLInputElement | null)?.value ?? "";
      const result = await generateBlurbAction(name);

      if (result.error !== null) {
        notify({ error: result.error, message: null });
      } else if (input) {
        // The edit form counts changes from input events, which setting a value doesn't fire
        input.value = result.blurb;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

  return (
    <Field label="Blurb: a short, playful description for the website">
      <span className="flex max-w-2xl gap-2">
        <Input
          ref={inputRef}
          name="theme:blurb"
          defaultValue={defaultValue}
          placeholder="Left empty, the website shows a joke instead"
          form={form}
        />
        <Button type="button" variant="dark" onClick={generate} disabled={isPending}>
          <SparklesIcon className="size-4 text-amber-300" />
          {isPending ? "Thinking…" : "Generate"}
        </Button>
      </span>
    </Field>
  );
};
