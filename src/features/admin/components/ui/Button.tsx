import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

const VARIANTS = {
  primary: "bg-sky-500 text-white hover:brightness-110",
  dark: "bg-[#222f44] text-white ring-1 ring-[#3d506b] ring-inset hover:brightness-150",
  danger: "bg-[#222f44] text-white ring-1 ring-[#3d506b] ring-inset hover:bg-danger hover:ring-danger",
  ghost: "text-dark-text hover:bg-white/10",
};

export type ButtonVariant = keyof typeof VARIANTS;

/**
 * Fully rounded button classes, matching the header and CTA banner on the
 * home page. For elements that aren't a plain <button>, e.g. a dialog's close
 * button.
 */
export const buttonClass = (variant: ButtonVariant = "dark", className?: string) =>
  cn(
    "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap duration-150 active:scale-90 active:opacity-75 disabled:pointer-events-none disabled:opacity-40",
    VARIANTS[variant],
    className
  );

export const Button = ({
  variant = "dark",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) => (
  <button className={buttonClass(variant, className)} {...props} />
);
