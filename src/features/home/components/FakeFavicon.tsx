import {
  BookOpenIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  GiftIcon,
  HomeIcon,
  MusicalNoteIcon,
  NewspaperIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import type { ComponentType, SVGProps } from "react";

import { cn } from "@/utils/cn";

/**
 * Made-up site icons for the demos: a plain glyph on a colour, so they look
 * like favicons without being anyone's logo.
 */
const KINDS = {
  mail: { Icon: EnvelopeIcon, color: "bg-sky-500" },
  docs: { Icon: DocumentTextIcon, color: "bg-sky-800" },
  calendar: { Icon: CalendarDaysIcon, color: "bg-[#4cc28f]" },
  news: { Icon: NewspaperIcon, color: "bg-[#8b7cf6]" },
  design: { Icon: SparklesIcon, color: "bg-[#e879a9]" },
  notes: { Icon: DocumentTextIcon, color: "bg-[#475569]" },
  recipes: { Icon: BookOpenIcon, color: "bg-[#14b8a6]" },
  rentals: { Icon: HomeIcon, color: "bg-[#6366f1]" },
  reading: { Icon: BookOpenIcon, color: "bg-sky-500" },
  gifts: { Icon: GiftIcon, color: "bg-[#e879a9]" },
  music: { Icon: MusicalNoteIcon, color: "bg-[#8b7cf6]" },
} satisfies Record<string, { Icon: ComponentType<SVGProps<SVGSVGElement>>; color: string }>;

export type FaviconKind = keyof typeof KINDS;

export const FakeFavicon = ({ kind, size = 16, className }: { kind: FaviconKind; size?: 12 | 16 | 24; className?: string }) => {
  const { Icon, color } = KINDS[kind];
  const SIZES = { 12: "size-3 rounded-[3px]", 16: "size-4 rounded-xs", 24: "size-6 rounded-sm" } as const;
  const GLYPHS = { 12: "size-2", 16: "size-2.5", 24: "size-4" } as const;

  return (
    <span className={cn("flex shrink-0 items-center justify-center text-white", SIZES[size], color, className)} aria-hidden="true">
      <Icon className={GLYPHS[size]} />
    </span>
  );
};
