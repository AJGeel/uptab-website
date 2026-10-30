import { MarqueeRow } from "@/features/backgrounds/components/MarqueeRow";
import type { BackgroundImage, Theme } from "@/features/backgrounds/types/catalogue";
import { blurbOf } from "@/features/backgrounds/utils/blurb";
import { creditLine } from "@/features/backgrounds/utils/credits";
import { hashtag } from "@/features/backgrounds/utils/hashtag";
import { plural } from "@/utils/plural";

const gutter = "mx-auto w-full max-w-310 px-[clamp(1rem,4vw,2rem)]";

/**
 * One theme in the gallery: its name, size and blurb, a row of its photos
 * drifting sideways, and the photographers.
 */
export const ThemeGallery = ({
  theme,
  images,
  reverse,
  onOpen,
}: {
  theme: Theme;
  images: BackgroundImage[];
  reverse: boolean;
  onOpen: (index: number) => void;
}) => (
  <section aria-labelledby={`theme-${theme.id}`} className="flex flex-col gap-4.5">
    <div className={`${gutter} flex flex-wrap items-end justify-between gap-x-5 gap-y-3`}>
      <h2 id={`theme-${theme.id}`} className="text-[clamp(2rem,3.6vw,3rem)] leading-none font-extrabold tracking-tight">
        <span className="text-sky-400">#</span>
        {hashtag(theme.name).slice(1)}
      </h2>
      <div className="flex min-w-70 flex-1 flex-col items-end gap-2 text-right">
        <span className="rounded-full bg-dark-pill px-2.5 py-1 text-[15px] font-bold text-dark-text">
          {plural(images.length, "photo")}
        </span>
        <p className="text-base text-dark-muted">{blurbOf(theme)}</p>
      </div>
    </div>
    <MarqueeRow items={images.map((image, index) => ({ image, index }))} reverse={reverse} onOpen={onOpen} />
    <p className={`${gutter} text-[13px] leading-relaxed text-dark-muted`}>
      <span className="font-bold text-dark-text">Photos by</span> {creditLine(images)}
    </p>
  </section>
);
