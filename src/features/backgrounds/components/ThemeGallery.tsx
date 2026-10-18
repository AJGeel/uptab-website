import { MarqueeRow } from "@/features/backgrounds/components/MarqueeRow";
import type { BackgroundImage, Theme } from "@/features/backgrounds/types/catalogue";
import { hashtag } from "@/features/backgrounds/utils/hashtag";
import { plural } from "@/utils/plural";

/** Below this many photos, one row; otherwise two rows drifting in opposite directions. */
const MIN_FOR_TWO_ROWS = 6;

/**
 * One theme in the gallery: its photos split over stacked rows that drift in
 * opposite directions, so only part of the theme shows at a time. Hovering
 * the theme pauses its rows.
 */
export const ThemeGallery = ({
  theme,
  images,
  onOpen,
}: {
  theme: Theme;
  images: BackgroundImage[];
  onOpen: (index: number) => void;
}) => {
  const items = images.map((image, index) => ({ image, index }));
  const rows =
    images.length < MIN_FOR_TWO_ROWS
      ? [items]
      : [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)];

  return (
    <section className="group/theme flex flex-col gap-3">
      <h2 className="mx-auto w-full max-w-6xl px-4 font-bold md:px-6">
        {hashtag(theme.name)}{" "}
        <span className="text-sm font-normal text-slate-500">{plural(images.length, "photo")}</span>
      </h2>
      {rows.map((row, i) => (
        <MarqueeRow key={i} items={row} reverse={i % 2 === 1} onOpen={onOpen} />
      ))}
    </section>
  );
};
