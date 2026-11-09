"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

import { GalleryTile } from "@/features/backgrounds/components/GalleryTile";
import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { useEasedPlayback } from "@/hooks/use-eased-playback";
import { cn } from "@/utils/cn";

/** Enough tiles per copy to be wider than even an ultrawide screen, so the loop never shows a gap. */
const MIN_TILES = 14;
/** Seconds per tile: slow, so the drift stays subtle. */
const SECONDS_PER_TILE = 16;
/** Pixels the pointer must travel before a press counts as a drag instead of a click. */
const DRAG_THRESHOLD = 5;
/** Caps a fling at this many times the natural speed. */
const MAX_FLING_RATE = 40;
/** A pointer that sat still this long (ms) before release doesn't fling. */
const FLING_STALE_MS = 80;
/** Far enough into the loop that a backwards fling can't run out of animation before it eases out. */
const LOOP_HEADROOM = 1000;

type Item = { image: BackgroundImage; index: number };

/**
 * A row of photos drifting sideways in an endless loop. It scrolls over two
 * copies of the row. The second is only there for the loop: clickable like
 * the first, but hidden from screen readers and skipped by Tab. Glides to a
 * stop when the row is hovered or focused, or when `paused`, and eases back
 * up to speed afterwards. Without motion, it's a static row. The row can be
 * dragged sideways without limit, since it just winds the loop forwards or
 * backwards; a drag never opens a photo.
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
  const [dragging, setDragging] = useState(false);
  const stopped = paused || hovered || focused || dragging;
  const didDrag = useRef(false);

  useEffect(() => easeTo(stopped ? 0 : 1), [stopped, easeTo]);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const animation = track?.getAnimations()[0];
    if (!track || !animation || (event.pointerType === "mouse" && event.button !== 0)) {return;}

    const duration = Number(animation.effect?.getComputedTiming().duration);
    const loopWidth = track.offsetWidth / 2;
    // The row moves left as the animation advances, or right when reversed
    const direction = reverse ? 1 : -1;
    let lastX = event.clientX;
    let travelled = 0;
    let velocity = 0; // px/ms, smoothed
    let lastTime = event.timeStamp;
    didDrag.current = false;

    const move = (moveEvent: globalThis.PointerEvent) => {
      const dx = moveEvent.clientX - lastX;
      const elapsed = Math.max(moveEvent.timeStamp - lastTime, 1);
      velocity = 0.6 * velocity + 0.4 * (dx / elapsed);
      lastX = moveEvent.clientX;
      lastTime = moveEvent.timeStamp;
      travelled += Math.abs(dx);
      if (travelled < DRAG_THRESHOLD) {return;}

      if (!didDrag.current) {
        didDrag.current = true;
        setDragging(true);
      }
      const time = Number(animation.currentTime) + direction * (dx / loopWidth) * duration;
      // Times below zero fall outside the animation, so stay well inside it
      animation.currentTime = LOOP_HEADROOM * duration + ((time % duration) + duration) % duration;
    };
    const end = (endEvent: globalThis.PointerEvent) => {
      if (didDrag.current) {
        // Keep the drag's momentum; easing back to the natural speed follows from `dragging` ending
        const stale = endEvent.timeStamp - lastTime > FLING_STALE_MS;
        const rate = stale ? 0 : direction * (velocity / loopWidth) * duration;
        animation.playbackRate = Math.max(-MAX_FLING_RATE, Math.min(MAX_FLING_RATE, rate));
      }
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      setDragging(false);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  };

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
      className={cn(
        "touch-pan-y overflow-hidden select-none",
        dragging && "cursor-grab [&_button]:cursor-[inherit]",
      )}
      onPointerDown={startDrag}
      // Capture phase, so a drag that ends over a photo doesn't open it
      onClickCapture={(event) => {
        if (didDrag.current) {
          event.stopPropagation();
          didDrag.current = false;
        }
      }}
      onDragStart={(event) => event.preventDefault()}
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
