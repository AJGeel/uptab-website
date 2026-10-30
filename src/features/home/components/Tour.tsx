"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Kbd } from "@/components/Kbd";
import { PillTabs } from "@/features/home/components/PillTabs";
import { cn } from "@/utils/cn";

const AUTOPLAY_MS = 6000;

type Slide = {
  tab: string;
  kicker: string;
  title: string;
  body: ReactNode;
  /** Screenshot path. Until there is one, the slide shows a labelled placeholder. */
  image?: string;
  imageAlt: string;
};

const SLIDES: Slide[] = [
  {
    tab: "Full-screen photos",
    kicker: "Backgrounds",
    title: "The whole tab is the view.",
    body: "Tuck the sidebar away and every new tab becomes a little trip somewhere, with a nod to the photographer who took you there.",
    image: "/images/tour/backgrounds.webp",
    imageAlt: "UpTab new tab showing a full-screen snowy mountain photo with weather and date",
  },
  {
    tab: "Sidebar",
    kicker: "Sidebar",
    title: "Everything handy, one key away.",
    body: (
      <>
        Weather, shortlinks and your bookmarks in one tidy drawer. Tap <Kbd>\</Kbd> and it slides in. Tap again and it
        scoots off.
      </>
    ),
    image: "/images/tour/sidebar.webp",
    imageAlt: "UpTab sidebar with weather, shortlinks and bookmarks beside a mountain photo",
  },
  {
    tab: "Collections",
    kicker: "Collections",
    title: "Pick where you’d like to wake up.",
    body: "Windmills, giraffes, mountain peaks, petals or concrete. Tick what you love, add your own photos, and choose how often the view changes.",
    image: "/images/tour/collections.webp",
    imageAlt: "UpTab backgrounds dialog with five photo collections",
  },
];

const ArrowButton = ({ direction, onClick }: { direction: "previous" | "next"; onClick: () => void }) => (
  <button
    type="button"
    aria-label={`${direction === "previous" ? "Previous" : "Next"} slide`}
    onClick={onClick}
    className={cn(
      "inline-flex size-12 items-center justify-center rounded-full button-wipe active:scale-[.97]",
      direction === "previous" ? "border border-[#d5dee7] bg-white text-black" : "bg-black text-white"
    )}
  >
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d={direction === "previous" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

/** Three slides of the extension, autoplaying every 6 seconds. Picking a slide restarts the timer. */
export const Tour = ({ autoplay = true }: { autoplay?: boolean }) => {
  // `run` changes on every pick, so choosing the current slide still restarts the timer
  const [{ slide, run }, setState] = useState({ slide: 0, run: 0 });
  const go = (index: number) => setState(({ run }) => ({ slide: (index + SLIDES.length) % SLIDES.length, run: run + 1 }));

  useEffect(() => {
    if (!autoplay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = setTimeout(() => go(slide + 1), AUTOPLAY_MS);

    return () => clearTimeout(timer);
  }, [autoplay, slide, run]);

  const active = SLIDES[slide];

  return (
    <section id="tour" className="mx-auto max-w-310 reveal px-[clamp(1rem,4vw,2rem)] pt-[clamp(4.5rem,9vw,8rem)]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-160">
          <p className="text-[13px] font-bold tracking-[0.12em] text-sky-800 uppercase">Have a little look around</p>
          <h2 className="mt-3 text-[clamp(2.125rem,4vw,3.25rem)] leading-heading font-extrabold tracking-[-0.035em]">
            Pretty on the outside. Handy on the inside.
          </h2>
        </div>
        <div className="flex gap-2">
          <ArrowButton direction="previous" onClick={() => go(slide - 1)} />
          <ArrowButton direction="next" onClick={() => go(slide + 1)} />
        </div>
      </div>

      <div className="mt-9">
        <PillTabs
          label="UpTab features"
          tabs={SLIDES.map(({ tab }) => tab)}
          selected={slide}
          onSelect={go}
          progressKey={autoplay ? `${slide}-${run}` : undefined}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-8">
        <div className="min-w-0 flex-[999_1_640px] rounded-[22px] bg-linear-to-b from-[#dde7f0] to-[#eef3f7] p-[clamp(0.625rem,1.6vw,1.375rem)] ring-1 ring-[#dce4ec] ring-inset">
          {/* Container query units, so what's drawn in a screenshot scales with it */}
          <div className="@container relative aspect-3248/2122 w-full">
            {SLIDES.map((item, index) => (
              <div
                key={item.tab}
                aria-hidden={index !== slide}
                className={cn(
                  "absolute inset-0 transition duration-700 ease-out-soft",
                  index === slide ? "z-10 opacity-100" : "pointer-events-none z-0 translate-y-2.5 scale-[.97] opacity-0"
                )}
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- pre-sized screenshot
                  <img src={item.image} alt={item.imageAlt} className="block size-full drop-shadow-[0_24px_40px_rgba(2,14,44,0.22)]" />
                ) : (
                  <div
                    role="img"
                    aria-label={item.imageAlt}
                    className="flex size-full items-center justify-center rounded-xl border-2 border-dashed border-[#b9cbdb] bg-white/60 text-center text-sm font-semibold text-muted"
                  >
                    Screenshot: {item.tab}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-[1_1_280px] flex-col gap-3.5">
          <p className="text-[13px] font-bold tracking-[0.12em] text-muted uppercase">{active.kicker}</p>
          <h3 className="text-3xl leading-title font-extrabold tracking-tight text-balance">{active.title}</h3>
          <p className="text-[17px] leading-relaxed text-balance text-body">{active.body}</p>
          <p className="text-sm font-semibold text-muted">
            {slide + 1} / {SLIDES.length}
          </p>
        </div>
      </div>
    </section>
  );
};
