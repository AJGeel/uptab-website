import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

/** Also for <select>, which shares the input look. */
export const inputClass =
  "w-full rounded-sm border border-slate-300 bg-white px-2 py-1 text-sm read-only:bg-slate-100 read-only:text-slate-500";

export const Input = ({ className, ...props }: ComponentProps<"input">) => (
  <input className={cn(inputClass, className)} {...props} />
);
