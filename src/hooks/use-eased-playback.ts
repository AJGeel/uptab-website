import { useCallback, useEffect, useRef, type RefObject } from "react";

/** Time constants (seconds) for the playback rate to ease towards its target. */
const STOP_EASING = 0.5;
const RESUME_EASING = 1;

/**
 * Returns a function that eases the CSS animation on `ref` to a standstill
 * (`0`) or back up to full speed (`1`), instead of cutting it off.
 */
export const useEasedPlayback = (ref: RefObject<HTMLElement | null>) => {
  const frameRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  return useCallback(
    (target: 0 | 1) => {
      cancelAnimationFrame(frameRef.current);

      const animation = ref.current?.getAnimations()[0];
      if (!animation) {return;}

      let last = performance.now();
      const step = (now: number) => {
        const easing = target === 0 ? STOP_EASING : RESUME_EASING;
        const rate = animation.playbackRate;
        const next = rate + (target - rate) * (1 - Math.exp(-(now - last) / 1000 / easing));
        last = now;

        const settled = Math.abs(target - next) < 0.005;
        animation.playbackRate = settled ? target : next;
        if (!settled) {frameRef.current = requestAnimationFrame(step);}
      };
      frameRef.current = requestAnimationFrame(step);
    },
    [ref],
  );
};
