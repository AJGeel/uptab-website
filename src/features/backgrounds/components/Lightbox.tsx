"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { hashtag } from "@/features/backgrounds/utils/hashtag";
import { cn } from "@/utils/cn";
import { targetBlank } from "@/utils/targetBlank";

const iconButtonClass =
  "rounded-full bg-white/10 p-2 text-white duration-150 hover:bg-white/20 active:scale-90";

/** Fades the photo in once it's loaded. Keyed by photo, so each one starts hidden. */
const LightboxPhoto = ({ image }: { image: BackgroundImage }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const largest = image.sources[image.sources.length - 1];

  return (
    <div
      className="relative mx-auto w-full max-w-[min(100%,calc(75vh*var(--ratio)))] overflow-hidden rounded-sm"
      style={{ aspectRatio: image.aspectRatio, backgroundColor: image.color, ["--ratio" as string]: image.aspectRatio }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized renditions, so the browser picks one with srcset */}
      <img
        srcSet={image.sources.map(({ url, width }) => `${new URL(url).pathname} ${width}w`).join(", ")}
        sizes="(min-width: 1024px) 80vw, 100vw"
        src={new URL(largest.url).pathname}
        alt={image.author ? `Photo by ${image.author}` : "Photo"}
        ref={(element) => {
          if (element?.complete) {
            setIsLoaded(true);
          }
        }}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "size-full object-contain duration-500 motion-safe:transition-opacity",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};

/** A colour dot. Hover shows its hex straight away; clicking copies it. */
const Swatch = ({ color }: { color: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(color);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked; the hex is still shown on hover
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${color}`}
      className="group relative size-3.5 rounded-full ring-1 ring-white/30 duration-150 hover:scale-125 active:scale-95"
      style={{ backgroundColor: color }}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md bg-white px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-black opacity-0 duration-100 group-hover:opacity-100",
          isCopied && "opacity-100"
        )}
      >
        {isCopied ? "Copied!" : color}
      </span>
    </button>
  );
};

const Details = ({
  image,
  themeName,
  position,
}: {
  image: BackgroundImage;
  themeName: string;
  position: string;
}) => {
  const largest = image.sources[image.sources.length - 1];
  const height = Math.round(largest.width / image.aspectRatio);

  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 text-sm text-white/70">
      <div className="flex flex-col gap-0.5">
        {/* The dialog still needs a title, for screen readers */}
        <DialogTitle className="sr-only">
          {themeName} photo {position}
        </DialogTitle>
        {image.author && (
          <span>
            Photo by{" "}
            {image.link ? (
              <a href={image.link} {...targetBlank} className="text-sky-400 hover:text-white">
                {image.author}
              </a>
            ) : (
              image.author
            )}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>{hashtag(themeName)}</span>
        <span>
          {largest.width} × {height}
        </span>
        <span className="flex items-center gap-1">
          {[image.color, ...image.palette].map((color) => (
            <Swatch key={color} color={color} />
          ))}
        </span>
      </div>
    </div>
  );
};

/**
 * Browses one theme's photos: the photo as large as fits, with its credit
 * and details. Arrow keys or the buttons step through the theme; Esc closes.
 */
export const Lightbox = ({
  images,
  themeName,
  index,
  onChange,
  onClose,
}: {
  images: BackgroundImage[];
  themeName: string;
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
}) => {
  const image = index === null ? undefined : images[index];
  const step = (by: number) =>
    index !== null && onChange((index + by + images.length) % images.length);

  useEffect(() => {
    if (index === null) {
      return undefined;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        step(1);
      } else if (event.key === "ArrowLeft") {
        step(-1);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <Dialog open={image !== undefined} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/90 backdrop-blur-sm duration-200 data-closed:opacity-0"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 md:p-10">
        <DialogPanel
          transition
          className="flex w-full max-w-6xl flex-col gap-4 duration-200 data-closed:scale-95 data-closed:opacity-0"
        >
          {image && (
            <>
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>
                  {(index ?? 0) + 1} / {images.length}
                </span>
                <button type="button" onClick={onClose} aria-label="Close" className={iconButtonClass}>
                  <XMarkIcon className="size-5" />
                </button>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className={cn(iconButtonClass, "shrink-0")}
                >
                  <ChevronLeftIcon className="size-5" />
                </button>
                <div className="min-w-0 grow">
                  <LightboxPhoto key={image.id} image={image} />
                </div>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className={cn(iconButtonClass, "shrink-0")}
                >
                  <ChevronRightIcon className="size-5" />
                </button>
              </div>
              <Details
                image={image}
                themeName={themeName}
                position={`${(index ?? 0) + 1} of ${images.length}`}
              />
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};
