import { useId } from "react";

import { cn } from "@/utils/cn";

type LogoProps = {
  size?: number;
  /** Turns with the page's scroll position, like in the extension. */
  spinOnScroll?: boolean;
  className?: string;
};

export const Logo = ({ size = 32, spinOnScroll = false, className }: LogoProps) => {
  // Colons aren't valid in a url(#id) reference
  const gradientId = `logo-${useId().replace(/:/g, "")}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn(spinOnScroll && "motion-safe:logo-spin", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#25B1FF" />
          <stop offset="1" stopColor="#1088CA" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${gradientId})`} />
      <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="none" stroke="#fff" strokeOpacity="0.25" />
      <path
        d="M7.5 14.5L10.5 11.5L13.5 14.5M18.5 14.5L21.5 11.5L24.5 14.5"
        stroke="#fff"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12.5 19.5Q16 23 19.5 19.5" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="18.5" r="1.8" fill="#fff" fillOpacity="0.35" />
      <circle cx="23.5" cy="18.5" r="1.8" fill="#fff" fillOpacity="0.35" />
    </svg>
  );
};
