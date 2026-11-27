import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

/** Also for <select>, which shares the input look. Selects always match :read-only, so they are left out of its muted style. */
export const inputClass =
  "w-full rounded-lg border border-[#33465f] bg-[#0b121c] px-2.5 py-1.5 text-sm text-dark-text outline-sky-400 [&:not(select):read-only]:bg-transparent [&:not(select):read-only]:text-[#7f8da0]";

export const Input = ({ className, ...props }: ComponentProps<"input">) => (
  <input className={cn(inputClass, className)} {...props} />
);
