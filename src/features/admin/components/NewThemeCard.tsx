"use client";

import { PlusIcon } from "@heroicons/react/16/solid";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { NewThemeDialog } from "./NewThemeDialog";

/** The first card of the theme grid: opens the new theme dialog, then the new theme's page. */
export const NewThemeCard = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex h-full min-h-48 flex-col items-center justify-center gap-3 rounded-2xl bg-dark-surface p-4 text-center duration-150 hover:bg-amber-300/15 active:scale-[.98]"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-dark-pill text-amber-300 duration-150 group-hover:bg-amber-300 group-hover:text-black">
          <PlusIcon className="size-6" />
        </span>
        <span className="flex flex-col">
          <span className="font-bold text-white">New theme</span>
          <span className="text-xs text-[#7f8da0]">Start a fresh collection</span>
        </span>
      </button>
      <NewThemeDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onCreated={(id) => router.push(`/adminland/themes/${id}` as Route)}
      />
    </>
  );
};
