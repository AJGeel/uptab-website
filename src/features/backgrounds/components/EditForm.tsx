"use client";

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/Button";
import { useActionToast } from "@/features/backgrounds/hooks/use-action-toast";
import type { ActionState } from "@/features/backgrounds/types/action-state";


type Field = HTMLInputElement | HTMLSelectElement;

/*
 * Editable fields are named "<group>:<field>", e.g. "photo:koppelpoort:author"
 * or "theme:name". A save sends every field of each group that changed, so
 * rows that weren't touched are never written.
 */
const noSubscribe = () => () => {};

const groupOf = (name: string) => name.slice(0, name.lastIndexOf(":"));

const isChanged = (field: Field) =>
  field instanceof HTMLSelectElement
    ? [...field.options].some((option) => option.selected !== option.defaultSelected)
    : field.value !== field.defaultValue;

const readChanges = (form: HTMLFormElement) => {
  const fields = [...form.elements].filter(
    (element): element is Field =>
      (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) &&
      element.name.includes(":")
  );
  const groups = new Set(fields.filter(isChanged).map(({ name }) => groupOf(name)));
  const data = new FormData();

  for (const field of fields) {
    if (groups.has(groupOf(field.name))) {
      data.set(field.name, field.value);
    }
  }

  return { data, count: groups.size };
};

/**
 * One form for everything on a page, with a floating bar to save or discard.
 * Save only works when something changed. Once saved, the server's new values
 * become the fields' defaults, which marks them as unchanged again. Fields
 * elsewhere on the page can join it with `form={id}`.
 */
export const EditForm = ({
  id,
  action,
  children,
}: {
  id: string;
  action: (form: FormData) => Promise<ActionState>;
  children: ReactNode;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [changes, setChanges] = useState(0);
  const [isPending, startTransition] = useTransition();
  const notify = useActionToast();

  const recount = () => setChanges(formRef.current ? readChanges(formRef.current).count : 0);

  /*
   * Watch the whole page, because fields joined with `form={id}` live
   * outside the form, and their events don't bubble up to it. Values also
   * change without input events: saved defaults, removed rows.
   */
  useEffect(() => {
    const form = formRef.current;

    if (!form) {
      return undefined;
    }

    const onEdit = (event: Event) => {
      if ((event.target as Field | null)?.form === form) {
        recount();
      }
    };
    const observer = new MutationObserver(recount);

    document.addEventListener("input", onEdit);
    document.addEventListener("change", onEdit);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["value", "selected"],
    });

    return () => {
      document.removeEventListener("input", onEdit);
      document.removeEventListener("change", onEdit);
      observer.disconnect();
    };
  }, []);

  // Warn before leaving the page with unsaved changes
  useEffect(() => {
    if (changes === 0) {
      return undefined;
    }

    const warn = (event: BeforeUnloadEvent) => event.preventDefault();

    window.addEventListener("beforeunload", warn);

    return () => window.removeEventListener("beforeunload", warn);
  }, [changes]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { data } = readChanges(event.currentTarget);

    startTransition(async () => {
      notify(await action(data));
    });
  };

  const discard = () => {
    formRef.current?.reset();
    recount();
  };

  const hasChanges = changes > 0;
  const isClient = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false
  );

  return (
    <form id={id} ref={formRef} onSubmit={onSubmit}>
      {children}
      {isClient &&
        createPortal(
      <div className="fixed inset-x-0 bottom-6 z-40 mx-auto flex w-fit items-center gap-2 rounded-full bg-slate-900 py-1.5 pr-1.5 pl-5 text-sm text-white shadow-xl">
        <span className={hasChanges ? "" : "text-slate-400"}>
          {hasChanges
            ? `${changes} unsaved ${changes === 1 ? "change" : "changes"}`
            : "No unsaved changes"}
        </span>
        <Button
          type="button"
          onClick={discard}
          disabled={!hasChanges || isPending}
          variant="ghost" className="text-white hover:bg-white/10"
        >
          Discard
        </Button>
        <Button
          type="submit"
          form={id}
          disabled={!hasChanges || isPending}
          variant="primary"
        >
          {isPending ? "Saving…" : "Save"}
        </Button>
      </div>,
          // On <body>, so an ancestor's filter or transform can't move this fixed bar
          document.body
        )}
    </form>
  );
};
