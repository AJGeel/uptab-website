"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { rebuildAction } from "@/features/admin/api/rebuild-catalogue";
import { Button, buttonClass } from "@/features/admin/components/ui/Button";
import { useActionToast } from "@/features/admin/hooks/use-action-toast";
import { leavingLink } from "@/features/admin/utils/leaving-link";

/**
 * While the catalogue is behind backgrounds.json, following a link out of
 * Adminland asks whether to rebuild it first. Links within Adminland go
 * through. Must sit inside the Toaster.
 */
export const RebuildGuard = ({ isStale }: { isStale: boolean }) => {
  const router = useRouter();
  const notify = useActionToast();
  const [isPending, startTransition] = useTransition();
  // Where the visitor was going when we stopped them, while the dialog asks
  const [leavingTo, setLeavingTo] = useState<string | null>(null);

  useEffect(() => {
    if (!isStale) {
      return undefined;
    }

    const ask = (event: MouseEvent) => {
      const href = leavingLink(event);

      if (href && !new URL(href).pathname.startsWith("/adminland")) {
        event.preventDefault();
        event.stopPropagation();
        setLeavingTo(href);
      }
    };

    document.addEventListener("click", ask, { capture: true });

    return () => document.removeEventListener("click", ask, { capture: true });
  }, [isStale]);

  const leave = () => leavingTo && router.push(leavingTo as Route);

  const rebuildAndLeave = () =>
    startTransition(async () => {
      const result = await rebuildAction();

      notify(result);

      if (result.error) {
        setLeavingTo(null);
      } else {
        leave();
      }
    });

  return (
    <Dialog.Root open={leavingTo !== null} onOpenChange={(open) => !open && !isPending && setLeavingTo(null)}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-1/2 rounded-2xl bg-[#1b2638] p-6 text-dark-text shadow-2xl ring-1 ring-[#33465f] duration-150 ring-inset data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <Dialog.Title className="text-lg font-bold">The catalogue is out of date</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-[#7f8da0]">
            Your changes aren&apos;t in catalogue.json yet, so the website and the extension won&apos;t show them. Rebuild
            before you go?
          </Dialog.Description>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <Dialog.Close type="button" disabled={isPending} className={buttonClass("ghost")}>
              Stay
            </Dialog.Close>
            <Button type="button" variant="dark" onClick={leave} disabled={isPending}>
              Leave anyway
            </Button>
            <Button type="button" variant="primary" onClick={rebuildAndLeave} disabled={isPending}>
              {isPending ? "Rebuilding…" : "Rebuild & leave"}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
