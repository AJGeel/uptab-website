"use client";

import { SparklesIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils/cn";

const WAITING = [
  "Thinking…",
  "Brewing ideas…",
  "Shaking the model…",
  "Pondering…",
  "Rummaging…",
  "Almost there…",
  "Consulting the llama…",
  "Warming up the neurons…",
  "Untangling thoughts…",
  "Doing the maths…",
  "Asking nicely…",
  "Chasing a good idea…",
  "Reading the room…",
  "Polishing the words…",
  "Counting sheep…",
  "Stirring the pot…",
  "Dusting off the dictionary…",
  "Waiting for inspiration…",
  "Sharpening pencils…",
  "Having a little think…",
  "Spinning up the hamsters…",
  "Connecting the dots…",
];

/** A random line other than the one showing, so it never repeats back to back. */
const nextWord = (current: number) => {
  const next = Math.floor(Math.random() * (WAITING.length - 1));

  return next >= current ? next + 1 : next;
};

/**
 * The inside of a button that asks the AI for something: sparkles and a label.
 * Waiting can take a while, so then the sparkles twinkle and the label cycles
 * through random lines.
 */
export const AiLabel = ({ isPending, children }: { isPending: boolean; children: string }) => {
  const [word, setWord] = useState(0);
  const [width, setWidth] = useState<number>();
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const text = textRef.current;

    if (!text) {
      return undefined;
    }

    const observer = new ResizeObserver(() => setWidth(text.offsetWidth));

    observer.observe(text);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPending) {
      return undefined;
    }

    const timer = setInterval(() => setWord(nextWord), 2200);

    return () => {
      clearInterval(timer);
      // The next wait starts on another line
      setWord(nextWord);
    };
  }, [isPending]);

  return (
    <>
      <span aria-hidden="true" className="inline-flex size-4 text-amber-300">
        <SparklesIcon className={cn("size-4", isPending && "motion-safe:animate-twinkle")} />
      </span>
      {/* The width follows the text, so the button eases to its new size */}
      <span style={{ width }} className="inline-flex overflow-hidden transition-[width] duration-300 ease-out-soft motion-reduce:transition-none">
        <span ref={textRef} className="shrink-0 whitespace-nowrap">
          <span key={isPending ? word : "idle"} className="inline-block motion-safe:animate-fade-in">
            {isPending ? WAITING[word] : children}
          </span>
        </span>
      </span>
    </>
  );
};
