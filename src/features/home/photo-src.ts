import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";

/** A local path to the smallest rendition that is at least `width` wide, so next/image can optimize it. */
export const photoSrc = ({ sources }: BackgroundImage, width: number) =>
  new URL((sources.find((source) => source.width >= width) ?? sources[sources.length - 1]).url).pathname;
