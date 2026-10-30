"use client";

import { useEffect, useRef, useState } from "react";

import { GalleryTile } from "@/features/backgrounds/components/GalleryTile";
import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { useEasedPlayback } from "@/hooks/use-eased-playback";

/** Enough tiles per copy to be wider than even an ultrawide screen, so the loop never shows a gap. */
const MIN_TILES = 14;
/** Seconds per tile: slow, so the drift stays subtle. */
const SECONDS_PER_TILE = 16;

type Item = { image: BackgroundImage; index: number };

/**
 * A row of photos drifting sideways in an endless loop. It scrolls over two
 * copies of the row. The second is only there for the loop: clickable like
 * the first, but hidden from screen readers and skipped by Tab. Glides to a
 * stop when the row is hovered or focused, or when `paused`, and eases back
 * up to speed afterwards. Without motion, it's a static row.
 */
export const MarqueeRow = ({
  items,
  reverse = false,
  paused = false,
  onOpen,
}: {
  items: Item[];
  reverse?: boolean;
  paused?: boolean;
  onOpen: (index: number) => void;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const easeTo = useEasedPlayback(trackRef);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const stopped = paused || hovered || focused;

  useEffect(() => easeTo(stopped ? 0 : 1), [stopped, easeTo]);

  const repeats = Math.ceil(MIN_TILES / items.length);
  const copy = Array.from({ length: repeats }, () => items).flat();

  const renderCopy = (hidden: boolean) =>
    copy.map(({ image, index }, position) => (
      <div
        key={`${image.id}-${position}`}
        className="w-[clamp(220px,24vw,340px)] shrink-0"
        aria-hidden={hidden || undefined}
      >
        <GalleryTile
          image={image}
          onOpen={() => onOpen(index)}
          tabIndex={hidden ? -1 : undefined}
        />
      </div>
    ));

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div
        ref={trackRef}
        className="flex w-max gap-3 pr-3 motion-safe:animate-marquee"
        // Inline, because the animate-marquee shorthand would reset a direction class
        style={{
          animationDuration: `${copy.length * SECONDS_PER_TILE}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {renderCopy(false)}
        <div className="contents motion-reduce:hidden">{renderCopy(true)}</div>
      </div>
    </div>
  );
};
