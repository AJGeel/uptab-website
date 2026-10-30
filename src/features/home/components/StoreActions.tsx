"use client";

import { OtherStoreLink, StoreButton } from "@/components/StoreButton";
import { cn } from "@/utils/cn";

type StoreActionsProps = {
  /** Lifts the button off a photo with a shadow. */
  elevated?: boolean;
  /** Colours the "Also on …" link; it sits on a photo or a frosted panel. */
  otherClassName: string;
  className?: string;
};

/** The big call to action: add to the visitor's browser, or the other one, each with its logo. */
export const StoreActions = ({ elevated = false, otherClassName, className }: StoreActionsProps) => (
  <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-3", className)}>
    <StoreButton
      tone="on-light"
      browserIcon
      className={cn("min-h-13.5 gap-3 px-6 text-[17px]", elevated && "shadow-[0_14px_30px_-14px_rgba(2,14,44,0.6)]")}
    />
    <OtherStoreLink browserIcon className={cn("text-[15px]", otherClassName)} />
  </div>
);
