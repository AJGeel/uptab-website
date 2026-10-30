"use client";

import { useState } from "react";

import { cn } from "@/utils/cn";

const MESSAGES = [
  "Nope. UpTab doesn’t track you.",
  "Still no.",
  "There’s nothing to track. Really.",
  "You’re persistent. Still no.",
  "You still trying?"
];

const CURSOR_PATH = "M4 2l14 8-6 1.6L9 18z";

const Switch = ({ on }: { on: boolean }) => (
  <span aria-hidden="true" className={cn("relative h-8 w-13 rounded-full", on ? "bg-sky-500" : "bg-[#c3ceda]")}>
    <span
      className={cn(
        "absolute top-1 size-6 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]",
        on ? "right-1" : "left-1"
      )}
    />
  </span>
);

/**
 * A privacy toggle that refuses to turn on. Until the first click it plays a
 * looping demo (cursor, shake, toast); after that, every click jolts it and
 * shows the next message. The jolt and pop classes alternate (a/b) so the
 * animation restarts on each click.
 */
export const PrivacyCard = () => {
  const [nope, setNope] = useState(0);
  const demo = nope === 0;
  const odd = nope % 2 === 1;
  const jolt = odd ? "ut-jolt-a" : "ut-jolt-b";

  return (
    <article className="ut-s2 flex flex-col gap-4.5 rounded-3xl bg-white p-7 ring-1 ring-[#e2e8ef] ring-inset">
      <div>
        <h3 className="text-[22px] font-extrabold tracking-tight">Private. Stubbornly.</h3>
        <p className="mt-2 text-base leading-relaxed text-balance text-muted">Some switches just won’t switch. Give it a go.</p>
      </div>
      <div className="relative mt-auto flex flex-col gap-1.5 pt-12">
        <div
          key={nope}
          role="status"
          className={cn(
            "absolute top-0 right-0 rounded-[10px] bg-black px-3 py-2 text-[13px] font-semibold whitespace-nowrap text-white",
            demo ? "ut-p-toast" : odd ? "ut-pop-a" : "ut-pop-b"
          )}
        >
          {MESSAGES[Math.max(nope - 1, 0) % MESSAGES.length]}
        </div>
        <div className={cn("flex min-h-12 items-center justify-between text-[15px] font-semibold", demo && "ut-p-row")}>
          <span id="ut-trk">Track my browsing</span>
          <button
            type="button"
            aria-labelledby="ut-trk"
            aria-pressed="false"
            onClick={() => setNope((current) => current + 1)}
            className={cn("relative h-8 w-13 cursor-pointer rounded-full bg-transparent p-0", !demo && jolt)}
          >
            <span className={cn("absolute inset-0 rounded-full bg-[#c3ceda]", demo && "ut-p-track")} />
            <span
              className={cn(
                "absolute top-1 left-1 size-6 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]",
                demo ? "ut-p-knob" : jolt
              )}
            />
          </button>
        </div>
        <div className="flex min-h-12 items-center justify-between border-t border-[#eef2f6] text-[15px] font-semibold">
          Sell my data
          <Switch on={false} />
        </div>
        <div className="flex min-h-12 items-center justify-between border-t border-[#eef2f6] text-[15px] font-semibold">
          Keep it on my device
          <Switch on />
        </div>
        {demo && (
          <svg
            className="ut-p-cursor pointer-events-none absolute top-17.5 right-2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            aria-hidden="true"
          >
            <path d={CURSOR_PATH} fill="#020E2C" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </article>
  );
};
