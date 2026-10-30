"use client";

import { PhotoIcon } from "@heroicons/react/24/outline";
import type { ChangeEvent } from "react";

import { ACCEPTED_TYPES, FORMAT_NAMES } from "@/features/backgrounds/utils/image-formats";
import { cn } from "@/utils/cn";

/**
 * A drop area for one or more photos. Clicking opens the file picker;
 * dropping works too, because the hidden input covers the whole area. Once
 * photos are staged, it shrinks to a strip for adding more.
 */
export const PhotoDrop = ({
  onAdd,
  compact = false,
}: {
  onAdd: (files: File[]) => void;
  compact?: boolean;
}) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onAdd([...(event.target.files ?? [])]);
    // Clear it, so picking the same file again still counts as a change
    event.target.value = "";
  };

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center rounded-lg border-2 border-dashed border-[#33465f] bg-[#0b121c] duration-150 hover:border-sky-500 has-focus-visible:border-sky-500",
        compact ? "py-3" : "h-40"
      )}
    >
      {compact ? (
        <span className="flex items-center gap-2 text-sm font-medium text-dark-muted">
          <PhotoIcon className="size-5 text-[#7f8da0]" />
          Add more photos
        </span>
      ) : (
        <span className="flex flex-col items-center gap-1 text-sm text-[#7f8da0]">
          <PhotoIcon className="size-8 text-[#7f8da0]" />
          <span className="font-medium text-dark-text">Choose or drop photos</span>
          {FORMAT_NAMES} · as many as you like
        </span>
      )}
      <input
        type="file"
        multiple
        accept={ACCEPTED_TYPES}
        onChange={onChange}
        aria-label="Photos"
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </div>
  );
};
