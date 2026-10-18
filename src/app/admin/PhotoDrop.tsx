"use client";

import { PhotoIcon } from "@heroicons/react/24/outline";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

/**
 * The upload's file field as a large drop area, showing the chosen photo.
 * Clicking opens the file picker; dropping a file works too, because the
 * hidden input covers the whole area.
 */
export const PhotoDrop = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);

  // Clear the preview when the form resets after an upload
  useEffect(() => {
    const form = inputRef.current?.form;
    const clear = () => setPreview(null);

    form?.addEventListener("reset", clear);

    return () => form?.removeEventListener("reset", clear);
  }, []);

  // Free the previous preview's memory
  useEffect(
    () => () => {
      if (preview) {
        URL.revokeObjectURL(preview.url);
      }
    },
    [preview]
  );

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setPreview(file ? { url: URL.createObjectURL(file), name: file.name } : null);
  };

  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 duration-150 hover:border-sky-500 has-focus-visible:border-sky-500">
      {preview ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- a local blob URL, which next/image can't load */}
          <img src={preview.url} alt="" className="absolute inset-0 size-full object-cover" />
          <span className="absolute inset-x-2 bottom-2 truncate rounded-full bg-black/60 px-3 py-1 text-xs text-white">
            {preview.name}
          </span>
        </>
      ) : (
        <span className="flex flex-col items-center gap-1 text-sm text-slate-500">
          <PhotoIcon className="size-8 text-slate-400" />
          <span className="font-medium text-slate-700">Choose or drop a photo</span>
          JPEG, PNG, WebP or TIFF
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        name="file"
        required
        accept="image/jpeg,image/png,image/webp,image/tiff"
        onChange={onChange}
        aria-label="Photo"
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </div>
  );
};
