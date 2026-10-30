import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

const TONES = {
  light: "border-sky-900/30 bg-white text-sky-500",
  dark: "border-white/20 bg-dark-pill text-sky-400",
};

/** A key in a sentence, like the extension's: a small keycap with a thicker bottom edge. */
export const Kbd = ({ children, tone = "light" }: { children: ReactNode; tone?: keyof typeof TONES }) => (
  <kbd
    className={cn(
      "mx-0.5 -my-1 inline-block min-w-[1.75em] rounded-md border border-b-2 px-1.5 py-0.5 text-center align-baseline font-mono text-[0.8em] leading-none font-bold shadow-xs",
      TONES[tone]
    )}
  >
    {children}
  </kbd>
);
