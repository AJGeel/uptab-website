"use client";

import { Dialog } from "@base-ui/react/dialog";

import { Button, buttonClass } from "@/features/admin/components/ui/Button";
import { jetBrainsMono } from "@/features/admin/components/ui/mono-font";

const Code = ({ children }: { children: string }) => (
  <code className={`${jetBrainsMono.className} rounded-sm bg-[#0b121c] px-1.5 py-0.5 text-xs text-dark-text`}>
    {children}
  </code>
);

/**
 * Explains how to load the helper extension (tools/unsplash-tabs) that lets
 * "Import from open tabs" see the browser's tabs. A modal, because importing
 * can't go on without it.
 */
export const HelperExtensionDialog = ({
  open,
  onOpenChange,
  isChecking,
  onCheckAgain,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isChecking: boolean;
  onCheckAgain: () => void;
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
      <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-1/2 rounded-2xl bg-[#1b2638] p-8 text-dark-text shadow-2xl ring-1 ring-[#33465f] duration-150 ring-inset data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
        <Dialog.Title className="text-xl font-bold">The helper extension isn&apos;t running</Dialog.Title>
        <Dialog.Description className="mt-2 text-sm text-[#7f8da0]">
          Importing from open tabs needs a small helper extension, so this page can see your Unsplash tabs and close
          them once their photos are fetched.
        </Dialog.Description>
        <ol className="mt-6 flex list-decimal flex-col gap-3 pl-5 text-sm marker:text-[#7f8da0]">
          <li>
            Run <Code>bun run tabs-extension</Code> in the terminal. It opens the browser&apos;s debugging page and
            shows the manifest in Finder.
          </li>
          <li>
            Choose <span className="font-semibold">Load Temporary Add-on…</span>
          </li>
          <li>
            Pick <Code>tools/unsplash-tabs/manifest.json</Code>
          </li>
          <li>Come back here and check again.</li>
        </ol>
        <p className="mt-5 text-xs text-[#7f8da0]">
          The extension only works on <Code>localhost</Code>, not on 127.0.0.1. A temporary add-on is gone after the
          browser restarts.
        </p>
        <div className="mt-8 flex justify-end gap-2">
          <Dialog.Close type="button" className={buttonClass("ghost")}>
            Close
          </Dialog.Close>
          <Button type="button" variant="primary" onClick={onCheckAgain} disabled={isChecking}>
            {isChecking ? "Checking…" : "Check again"}
          </Button>
        </div>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
);
