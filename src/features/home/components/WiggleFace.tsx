"use client";

import { useEffect, useRef, useState } from "react";

import { FaceBurst } from "@/components/FaceBurst";
import { MoodFace, type Mood } from "@/components/MoodFace";

// Long enough for the longest act in home.css, so one always plays out to its end
const ACT_MS = 2600;
const MIN_PAUSE_MS = 3500;
const MAX_PAUSE_MS = 9000;

/**
 * A mood face that acts out its mood, with a burst, when its card is hovered
 * and at random moments. An act always plays to the end, even if the pointer
 * leaves, so nothing snaps back. Each face keeps its own schedule, so they
 * drift in and out of sync.
 */
export const WiggleFace = ({ mood }: { mood: Mood }) => {
  const [isActing, setIsActing] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    let acting = false;

    const rest = () => {
      timer = setTimeout(act, MIN_PAUSE_MS + Math.random() * (MAX_PAUSE_MS - MIN_PAUSE_MS));
    };

    function act() {
      if (acting) {
        return;
      }

      clearTimeout(timer);
      acting = true;
      setIsActing(true);
      timer = setTimeout(() => {
        acting = false;
        setIsActing(false);
        rest();
      }, ACT_MS);
    }

    const card = ref.current?.closest(".ut-mood");

    card?.addEventListener("pointerenter", act);
    rest();

    return () => {
      clearTimeout(timer);
      card?.removeEventListener("pointerenter", act);
    };
  }, []);

  return (
    <span ref={ref} className={isActing ? "is-acting relative w-fit" : "relative w-fit"}>
      <MoodFace mood={mood} animated className={isActing ? "ut-act" : undefined} />
      <FaceBurst mood={mood} />
    </span>
  );
};
