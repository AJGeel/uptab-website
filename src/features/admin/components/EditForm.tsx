"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { Route } from "next";
import { useRouter } from "next/navigation";
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

import { Button, buttonClass } from "@/features/admin/components/ui/Button";
import { useActionToast } from "@/features/admin/hooks/use-action-toast";
import type { ActionState } from "@/features/admin/types/action-state";
import { leavingLink } from "@/features/admin/utils/leaving-link";


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

  return { data, count: groups.size, groups: [...groups] };
};

/** "theme details and 2 photos", for the dialog that asks what to do with unsaved changes. */
const summarize = (groups: string[]) => {
  const photos = groups.filter((group) => group.startsWith("photo:")).length;
  const parts = [
    groups.includes("theme") && "the theme's details",
    photos > 0 && `${photos} ${photos === 1 ? "photo" : "photos"}`,
  ].filter(Boolean);

  return parts.join(" and ");
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
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [changes, setChanges] = useState(0);
  const [summary, setSummary] = useState("");
  // Where the visitor was going when we stopped them, while the dialog asks
  const [leavingTo, setLeavingTo] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const notify = useActionToast();

  const recount = () => {
    const read = formRef.current ? readChanges(formRef.current) : null;

    setChanges(read?.count ?? 0);
    setSummary(read ? summarize(read.groups) : "");
  };

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

  /*
   * Following a link with unsaved changes asks first, in our own dialog.
   * Closing the tab or reloading can't be intercepted that way, so the
   * browser's own warning stays for those.
   */
  useEffect(() => {
    if (changes === 0) {
      return undefined;
    }

    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    const ask = (event: MouseEvent) => {
      const href = leavingLink(event);

      if (href) {
        event.preventDefault();
        event.stopImmediatePropagation();
        setLeavingTo(href);
      }
    };

    window.addEventListener("beforeunload", warn);
    // On window, which captures before the document, so this asks before any other guard does
    window.addEventListener("click", ask, { capture: true });

    return () => {
      window.removeEventListener("beforeunload", warn);
      window.removeEventListener("click", ask, { capture: true });
    };
  }, [changes]);

  // A client-side navigation: a full page load right after the save's refresh makes the browser hide the page mid view transition
  const leave = (href: string) => router.push(href as Route);

  const saveAndLeave = () => {
    if (!formRef.current || !leavingTo) {
      return;
    }

    const href = leavingTo;
    const { data } = readChanges(formRef.current);

    startTransition(async () => {
      const result = await action(data);

      notify(result);

      if (result.error) {
        setLeavingTo(null);
      } else {
        leave(href);
      }
    });
  };

  const discardAndLeave = () => {
    formRef.current?.reset();
    leave(leavingTo ?? "");
  };

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
      <Dialog.Root open={leavingTo !== null} onOpenChange={(open) => !open && !isPending && setLeavingTo(null)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-1/2 rounded-2xl bg-[#1b2638] p-6 text-dark-text shadow-2xl ring-1 ring-[#33465f] duration-150 ring-inset data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <Dialog.Title className="text-lg font-bold">
              You have {changes} unsaved {changes === 1 ? "change" : "changes"}
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-[#7f8da0]">
              {summary ? `You edited ${summary}. ` : ""}Save them before you go, or discard them?
            </Dialog.Description>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Dialog.Close type="button" disabled={isPending} className={buttonClass("ghost")}>
                Keep editing
              </Dialog.Close>
              <Button type="button" variant="danger" onClick={discardAndLeave} disabled={isPending}>
                Discard
              </Button>
              <Button type="button" variant="primary" onClick={saveAndLeave} disabled={isPending}>
                {isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      {isClient &&
        createPortal(
      <div className="fixed inset-x-0 bottom-6 z-40 mx-auto flex w-fit items-center gap-2 rounded-full bg-[#222f44] py-1.5 pr-1.5 pl-5 text-sm text-white shadow-xl ring-1 ring-[#2a374a] ring-inset">
        <span className={hasChanges ? "" : "text-[#7f8da0]"}>
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
