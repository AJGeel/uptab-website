"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";

import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { cn } from "@/utils/cn";

/**
 * The schedule options. `periodMs` is how often the demo swaps photos: a
 * compressed timescale, so the visitor can see the difference in seconds.
 */
const OPTIONS = [
  { label: "Daily", meaning: "A new view every day", periodMs: 9000 },
  { label: "6 hours", meaning: "A new view every 6 hours", periodMs: 6000 },
  { label: "Hourly", meaning: "Fresh view each hour", periodMs: 3500 },
  { label: "Every tab", meaning: "A different view on every new tab", periodMs: 1600 },
] as const;

/** Until the visitor picks something, the demo steps through the options this often. */
const AUTO_ADVANCE_MS = 8000;
const EVERY_TAB = OPTIONS.length - 1;
const PULSE_MS = 180;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeToMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
};
const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
const serverPrefersReducedMotion = () => false;

/** A local path to the smallest rendition that is at least `width` wide, so next/image can optimize it. */
const photoSrc = ({ sources }: BackgroundImage, width: number) =>
  new URL((sources.find((source) => source.width >= width) ?? sources[sources.length - 1]).url).pathname;

/** The little clock in the thumbnail's corner. Its ring fills up until the next photo. */
const Clock = ({ cycle, periodMs, still }: { cycle: string; periodMs: number; still: boolean }) => {
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (still || !ring.current) {
      return;
    }

    const animation = ring.current.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
      duration: periodMs,
      easing: "linear",
      fill: "forwards",
    });

    return () => animation.cancel();
  }, [cycle, periodMs, still]);

  return (
    <span className="absolute top-2 right-2 inline-flex size-6 rounded-full bg-white/90" aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" stroke="#d5dee7" strokeWidth="1.6" fill="none" />
        <circle
          ref={ring}
          cx="12"
          cy="12"
          r="8"
          stroke="#138CD0"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={still ? 0 : 1}
          transform="rotate(-90 12 12)"
        />
        <path d="M12 12V8M12 12l2.5 1.5" stroke="#020E2C" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  );
};

/**
 * Pick how often UpTab shows a new photo. The thumbnail previews it on a
 * compressed timescale. Until the visitor touches the control, the card steps
 * through the options by itself.
 */
export const PaceCard = ({ photos }: { photos: BackgroundImage[] }) => {
  const reducedMotion = useSyncExternalStore(subscribeToMotion, prefersReducedMotion, serverPrefersReducedMotion);
  const [option, setOption] = useState(0);
  const [photo, setPhoto] = useState(0);
  // Bumped on every pick and swap, so the timer and the clock restart together
  const [cycle, setCycle] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const pulseTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const select = (index: number) => {
    setOption(index);
    setCycle((current) => current + 1);

    // Without motion there's no cycling, so the choice itself shows a new view
    if (reducedMotion) {
      setPhoto((current) => (current + 1) % photos.length);
    }
  };

  // The photo swaps at the selected option's pace
  useEffect(() => {
    if (reducedMotion || photos.length < 2) {
      return;
    }

    const timer = setTimeout(() => {
      setPhoto((current) => (current + 1) % photos.length);
      setCycle((current) => current + 1);

      if (option === EVERY_TAB) {
        setIsPulsing(true);
        clearTimeout(pulseTimer.current);
        pulseTimer.current = setTimeout(() => setIsPulsing(false), PULSE_MS);
      }
    }, OPTIONS[option].periodMs);

    return () => clearTimeout(timer);
  }, [option, cycle, photos.length, reducedMotion]);

  useEffect(() => () => clearTimeout(pulseTimer.current), []);

  // Before the visitor has chosen, the demo tours the options
  useEffect(() => {
    if (hasInteracted || reducedMotion) {
      return;
    }

    const timer = setInterval(() => {
      setOption((current) => (current + 1) % OPTIONS.length);
      setCycle((current) => current + 1);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(timer);
  }, [hasInteracted, reducedMotion]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = {
      ArrowRight: (option + 1) % OPTIONS.length,
      ArrowDown: (option + 1) % OPTIONS.length,
      ArrowLeft: (option + OPTIONS.length - 1) % OPTIONS.length,
      ArrowUp: (option + OPTIONS.length - 1) % OPTIONS.length,
      Home: 0,
      End: OPTIONS.length - 1,
    }[event.key];

    if (next === undefined) {
      return;
    }

    event.preventDefault();
    select(next);
    buttons.current[next]?.focus();
  };

  return (
    <article className="ut-s3 flex flex-wrap gap-5.5 rounded-3xl bg-white p-7 ring-1 ring-[#e2e8ef] ring-inset">
      <div className="flex flex-[1_1_240px] flex-col justify-between gap-4.5">
        <div>
          <h3 className="text-[22px] font-extrabold tracking-tight">New view, your schedule</h3>
          <p className="mt-2 text-base leading-relaxed text-muted">
            Daily, every six hours, hourly, or a fresh one with every single tab, you restless soul.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          {/* Room for two lines, so a longer meaning never pushes the control down */}
          <p aria-live="polite" className="min-h-9 text-[13px] leading-snug font-semibold text-sky-800">
            {OPTIONS[option].meaning}
          </p>
          <div
            role="radiogroup"
            aria-label="How often UpTab shows a new photo"
            onKeyDown={onKeyDown}
            onFocus={() => setHasInteracted(true)}
            className="relative grid grid-cols-4 rounded-xl bg-[#eef2f6] p-1 text-center text-[13px] font-bold"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-1 left-1 w-[calc((100%-8px)/4)] rounded-[9px] bg-white shadow-[0_1px_3px_rgba(2,14,44,0.16)] transition-transform duration-300 ease-out-soft motion-reduce:transition-none"
              style={{ transform: `translateX(${option * 100}%)` }}
            />
            {OPTIONS.map(({ label }, index) => (
              <button
                key={label}
                ref={(element) => {
                  buttons.current[index] = element;
                }}
                type="button"
                role="radio"
                aria-checked={index === option}
                tabIndex={index === option ? 0 : -1}
                onClick={() => {
                  setHasInteracted(true);
                  select(index);
                }}
                className={cn(
                  "relative cursor-pointer rounded-[9px] px-0.5 py-2.25 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none",
                  index === option ? "text-black" : "text-muted hover:text-black"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "relative size-33 flex-none self-end overflow-hidden rounded-2xl bg-[#dde7f0] transition-transform duration-150 ease-out motion-reduce:transition-none",
          isPulsing && "scale-104"
        )}
        aria-hidden="true"
      >
        {photos.map((item, index) => (
          <Image
            key={item.id}
            src={photoSrc(item, 480)}
            alt=""
            fill
            sizes="132px"
            className={cn(
              "object-cover transition-opacity duration-500 motion-reduce:transition-none",
              index === photo ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
        {/* A flash on each swap, so "every tab" feels like opening one */}
        <span className={cn("absolute inset-0 bg-white transition-opacity", isPulsing ? "opacity-30 duration-0" : "opacity-0 duration-300")} />
        <Clock cycle={`${option}-${cycle}`} periodMs={OPTIONS[option].periodMs} still={reducedMotion || photos.length < 2} />
      </div>
    </article>
  );
};
