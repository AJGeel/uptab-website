"use client";

import Image from "next/image";
import { useState } from "react";

import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { cn } from "@/utils/cn";

/**
 * One photo in the gallery. Shows its dominant colour until the photo has
 * loaded, then fades it in. Opens the lightbox on click.
 */
export const GalleryTile = ({
  image,
  onOpen,
  tabIndex,
}: {
  image: BackgroundImage;
  onOpen: () => void;
  tabIndex?: number;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={onOpen}
      tabIndex={tabIndex}
      aria-label={image.author ? `View photo by ${image.author}` : "View photo"}
      className="group relative block aspect-video w-full overflow-hidden rounded-sm text-left crispy-outline duration-300 active:scale-95"
      style={{ backgroundColor: image.color }}
    >
      <Image
        // A local path, so next/image can optimize it without remotePatterns
        src={new URL(image.sources[0].url).pathname}
        width={480}
        height={270}
        alt=""
        // Cached photos can finish before hydration, so also check on mount
        ref={(element) => {
          if (element?.complete) {
            setIsLoaded(true);
          }
        }}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "size-full object-cover duration-500 ease-out group-hover:scale-105 motion-safe:transition-[opacity,scale]",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
      {image.author && (
        <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-3 pt-6 pb-2 text-xs text-white opacity-0 duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          Photo by {image.author}
        </span>
      )}
    </button>
  );
};
