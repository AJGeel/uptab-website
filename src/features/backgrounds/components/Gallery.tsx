"use client";

import { useState } from "react";

import { Lightbox } from "@/features/backgrounds/components/Lightbox";
import { ThemeGallery } from "@/features/backgrounds/components/ThemeGallery";
import type { Catalogue } from "@/features/backgrounds/types/catalogue";

/**
 * The public gallery: every published photo, per theme, with one lightbox
 * for all of them. While the lightbox is open, every row stops drifting.
 */
export const Gallery = ({ catalogue: { themes, images } }: { catalogue: Catalogue }) => {
  const [open, setOpen] = useState<{ themeId: string; index: number } | null>(null);
  const imagesOf = (themeId: string) => images.filter((image) => image.theme === themeId);
  const openTheme = themes.find((theme) => theme.id === open?.themeId);

  return (
    // Clipped sideways, so the drifting rows can never widen the page
    <div
      className="group/gallery flex flex-col gap-[clamp(2.5rem,5vw,4rem)] overflow-x-clip"
      data-paused={open ? "" : undefined}
    >
      {themes.map((theme, index) => (
        <ThemeGallery
          key={theme.id}
          theme={theme}
          images={imagesOf(theme.id)}
          reverse={index % 2 === 1}
          onOpen={(index) => setOpen({ themeId: theme.id, index })}
        />
      ))}
      <Lightbox
        images={openTheme ? imagesOf(openTheme.id) : []}
        themeName={openTheme?.name ?? ""}
        index={open?.index ?? null}
        onChange={(index) => setOpen((current) => current && { ...current, index })}
        onClose={() => setOpen(null)}
      />
    </div>
  );
};
