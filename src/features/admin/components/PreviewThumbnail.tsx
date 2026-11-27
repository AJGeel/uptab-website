"use client";

import { SELECT_PHOTO_EVENT } from "@/features/admin/components/ThemePreview";
import { FadeImage } from "@/features/admin/components/ui/FadeImage";
import { thumbnailUrl } from "@/features/backgrounds/utils/paths";

/** A photo's thumbnail that shows it in the theme's previewer when clicked. */
export const PreviewThumbnail = ({ id, file }: { id: string; file: string }) => (
  <button
    type="button"
    aria-label={`Show ${id} in the preview`}
    title="Show in preview"
    onClick={() => window.dispatchEvent(new CustomEvent(SELECT_PHOTO_EVENT, { detail: id }))}
    className="cursor-pointer rounded-xs duration-150 hover:brightness-125 active:scale-95"
  >
    <FadeImage
      unoptimized
      src={thumbnailUrl(file)}
      width={80}
      height={45}
      alt={id}
      className="aspect-video w-20 rounded-xs bg-dark-pill object-cover"
    />
  </button>
);
