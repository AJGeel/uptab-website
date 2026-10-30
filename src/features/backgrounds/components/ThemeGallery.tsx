import { AdminLink } from "@/components/SiteNav";
import { MarqueeRow } from "@/features/backgrounds/components/MarqueeRow";
import type { BackgroundImage, Theme } from "@/features/backgrounds/types/catalogue";
import { blurbOf } from "@/features/backgrounds/utils/blurb";
import { creditLine } from "@/features/backgrounds/utils/credits";
import { hashtag } from "@/features/backgrounds/utils/hashtag";
import { plural } from "@/utils/plural";

const IS_DEV = process.env.NODE_ENV === "development";

const gutter = "mx-auto w-full max-w-310 px-[clamp(1rem,4vw,2rem)]";

/**
 * One theme in the gallery: its name, size and blurb, a row of its photos
 * drifting sideways, and the photographers.
 */
export const ThemeGallery = ({
  theme,
  images,
  reverse,
  paused,
  onOpen,
}: {
  theme: Theme;
  images: BackgroundImage[];
  reverse: boolean;
  paused: boolean;
  onOpen: (index: number) => void;
}) => (
  <section aria-labelledby={`theme-${theme.id}`} className="flex flex-col gap-4.5">
    <div className={`${gutter} flex flex-col gap-3`}>
      <h2
        id={`theme-${theme.id}`}
        className="text-[clamp(2rem,3.6vw,3rem)] leading-none font-extrabold tracking-tight"
      >
        <span className="text-sky-400">#</span>
        {hashtag(theme.name).slice(1)}
      </h2>
      <div className="flex flex-wrap items-end justify-between gap-x-5 gap-y-3">
        <p className="max-w-155 text-base text-dark-muted">{blurbOf(theme)}</p>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-dark-pill px-2.5 py-1 text-[15px] font-bold text-dark-text">
            {plural(images.length, "photo")}
          </span>
          {IS_DEV && (
            <AdminLink href={`/adminland/themes/${theme.id}`} label="Edit theme" className="px-2.5 py-1 text-[15px]" />
          )}
        </div>
      </div>
    </div>
    <MarqueeRow items={images.map((image, index) => ({ image, index }))} reverse={reverse} paused={paused} onOpen={onOpen} />
    <p className={`${gutter} text-[13px] leading-relaxed text-dark-muted`}>
      <span className="font-bold text-dark-text">Photos by</span> {creditLine(images)}
    </p>
  </section>
);
