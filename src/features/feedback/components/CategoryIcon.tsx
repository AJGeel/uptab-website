import type { ReactNode } from "react";

import type { CATEGORIES } from "@/features/feedback/utils/schema";

const stroke = { stroke: "currentColor", strokeWidth: 1.6, fill: "none" } as const;

const ICONS: Record<(typeof CATEGORIES)[number], ReactNode> = {
  bug: (
    <>
      <ellipse cx="9" cy="10.5" rx="4" ry="5" {...stroke} />
      <path d="M9 6v9.5M5 9H2.5M15.5 9H13M5.4 13.2l-2 1.6M12.6 13.2l2 1.6M6.5 5.8L5 3.5M11.5 5.8L13 3.5" {...stroke} strokeLinecap="round" />
    </>
  ),
  idea: (
    <path
      d="M6.5 13h5M7.2 15.5h3.6M9 2.5a5 5 0 00-3 9c.5.4.5.9.5 1.5h5c0-.6 0-1.1.5-1.5a5 5 0 00-3-9z"
      {...stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  praise: (
    <path
      d="M9 15.5S2.5 11.6 2.5 7c0-2.1 1.6-3.7 3.6-3.7 1.2 0 2.3.6 2.9 1.6.6-1 1.7-1.6 2.9-1.6 2 0 3.6 1.6 3.6 3.7 0 4.6-6.5 8.5-6.5 8.5z"
      {...stroke}
      strokeLinejoin="round"
    />
  ),
  other: (
    <>
      <path d="M3 4.5h12a1 1 0 011 1v6.5a1 1 0 01-1 1H8l-3.5 2.5V13H3a1 1 0 01-1-1V5.5a1 1 0 011-1z" {...stroke} strokeLinejoin="round" />
      <circle cx="6" cy="8.8" r=".9" fill="currentColor" />
      <circle cx="9" cy="8.8" r=".9" fill="currentColor" />
      <circle cx="12" cy="8.8" r=".9" fill="currentColor" />
    </>
  ),
};

export const CategoryIcon = ({ category, className }: { category: keyof typeof ICONS; className?: string }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className={className}>
    {ICONS[category]}
  </svg>
);
