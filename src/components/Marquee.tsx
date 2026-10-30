"use client";

import { useRef, type ReactNode } from "react";

import { useEasedPlayback } from "@/hooks/use-eased-playback";
import { cn } from "@/utils/cn";

type MarqueeProps = {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
};

/**
 * Content drifting sideways in an endless loop. It scrolls over two copies,
 * the second hidden from screen readers. Glides to a stop on hover and eases
 * back up to speed afterwards. Without motion it's a static row you can
 * scroll by hand.
 */
export const Marquee = ({ children, duration = 40, className }: MarqueeProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const easeTo = useEasedPlayback(trackRef);

  return (
    <div
      className={cn("overflow-hidden motion-reduce:overflow-x-auto", className)}
      onMouseEnter={() => easeTo(0)}
      onMouseLeave={() => easeTo(1)}
    >
      <div
        ref={trackRef}
        className="flex w-max motion-safe:animate-marquee"
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="flex">{children}</div>
        <div className="flex motion-reduce:hidden" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};
