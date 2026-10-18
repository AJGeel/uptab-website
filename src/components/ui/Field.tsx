import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

/** A small label above a form control. */
export const Field = ({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) => (
  <label className={cn("flex flex-col gap-1 text-xs font-medium text-slate-500", className)}>
    {label}
    {children}
  </label>
);
