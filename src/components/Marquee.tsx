import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type MarqueeProps = {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
};

/**
 * Content drifting sideways in an endless loop. It scrolls over two copies,
 * the second hidden from screen readers. Pauses on hover. Without motion it's
 * a static row you can scroll by hand.
 */
export const Marquee = ({ children, duration = 40, className }: MarqueeProps) => (
  <div className={cn("overflow-hidden motion-reduce:overflow-x-auto", className)}>
    <div
      className="flex w-max hover:[animation-play-state:paused] motion-safe:animate-marquee"
      style={{ animationDuration: `${duration}s` }}
    >
      <div className="flex">{children}</div>
      <div className="flex motion-reduce:hidden" aria-hidden="true">
        {children}
      </div>
    </div>
  </div>
);
