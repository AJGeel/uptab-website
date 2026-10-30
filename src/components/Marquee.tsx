"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/utils/cn";

/** Time constants (seconds) for the scroll speed to ease towards its target. */
const STOP_EASING = 0.5;
const RESUME_EASING = 1;

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
  const frameRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const easeTo = (target: number) => {
    cancelAnimationFrame(frameRef.current);

    const animation = trackRef.current?.getAnimations()[0];
    if (!animation) return;

    let last = performance.now();
    const step = (now: number) => {
      const easing = target === 0 ? STOP_EASING : RESUME_EASING;
      const rate = animation.playbackRate;
      const next = rate + (target - rate) * (1 - Math.exp(-(now - last) / 1000 / easing));
      last = now;

      const settled = Math.abs(target - next) < 0.005;
      animation.playbackRate = settled ? target : next;
      if (!settled) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
  };

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
