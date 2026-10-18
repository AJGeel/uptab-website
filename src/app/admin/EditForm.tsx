"use client";

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { useActionToast } from "./Toaster";
import type { ActionState } from "./types";

type Field = HTMLInputElement | HTMLSelectElement;

/*
 * Editable fields are named "<group>:<field>", e.g. "photo:koppelpoort:author"
 * or "theme:name". A save sends every field of each group that changed, so
 * rows that weren't touched are never written.
 */
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
 * become the fields' defaults, which marks them as unchanged again.
 */
export const EditForm = ({
  action,
  children,
}: {
  action: (form: FormData) => Promise<ActionState>;
  children: ReactNode;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [changes, setChanges] = useState(0);
  const [isPending, startTransition] = useTransition();
  const notify = useActionToast();

  const recount = () => setChanges(formRef.current ? readChanges(formRef.current).count : 0);

  // Fields change without input events too: saved defaults, removed rows
  useEffect(() => {
    const form = formRef.current;

    if (!form) {
      return undefined;
    }

    const observer = new MutationObserver(recount);

    observer.observe(form, { subtree: true, childList: true, attributes: true });

    return () => observer.disconnect();
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

  return (
    <form ref={formRef} onSubmit={onSubmit} onInput={recount} onChange={recount}>
      {children}
      <div className="fixed inset-x-0 bottom-6 z-40 mx-auto flex w-fit items-center gap-3 rounded-full bg-slate-900 py-2 pr-2 pl-5 text-sm text-white shadow-xl">
        <span className={hasChanges ? "" : "text-slate-400"}>
          {hasChanges
            ? `${changes} unsaved ${changes === 1 ? "change" : "changes"}`
            : "No unsaved changes"}
        </span>
        <button
          type="button"
          onClick={discard}
          disabled={!hasChanges || isPending}
          className="rounded-full px-3 py-1 duration-150 hover:bg-white/10 disabled:opacity-40"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={!hasChanges || isPending}
          className="rounded-full bg-sky-500 px-4 py-1 font-medium duration-150 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-400"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
};
