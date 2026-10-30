"use client";

import { useStoreAttributes } from "@/hooks/useStoreAttributes";
import { cn } from "@/utils/cn";
import { externalUrlOpts } from "@/utils/externalUrlOpts";

type StoreButtonProps = {
  /** The page's surface: navy button on light, white button on dark. */
  tone?: "on-light" | "on-dark";
  /** Adds a small "Also on {browser}" link below the button. */
  showOther?: boolean;
  /** The browser's logo before the label. */
  browserIcon?: boolean;
  className?: string;
};

const TONES = {
  "on-light": "bg-black text-white",
  "on-dark": "bg-white text-black",
};

/**
 * Text that depends on the visitor's browser. Every variant takes up room, so
 * the layout doesn't move when the browser becomes known, and the text fades
 * in once it is, rather than flashing the wrong one.
 */
const BrowserText = ({ variants, current, ready }: { variants: string[]; current: string; ready: boolean }) => (
  <span className="grid justify-items-center">
    {variants.map((variant) => (
      <span key={variant} aria-hidden="true" className="invisible col-start-1 row-start-1">
        {variant}
      </span>
    ))}
    <span
      className={cn(
        "col-start-1 row-start-1 transition-opacity duration-200 noscript:opacity-100",
        ready ? "opacity-100" : "opacity-0"
      )}
    >
      {current}
    </span>
  </span>
);

/** The browser's logo. Hidden until the browser is known, so it doesn't flip from Chrome to Firefox. */
const BrowserIcon = ({ name, ready, size }: { name: string; ready: boolean; size: number }) => (
  // eslint-disable-next-line @next/next/no-img-element -- a small SVG, nothing for next/image to optimize
  <img
    src={`/images/${name.toLowerCase()}-icon.svg`}
    alt=""
    width={size}
    height={size}
    aria-hidden="true"
    className={cn("shrink-0 transition-opacity duration-200 noscript:opacity-100", ready ? "opacity-100" : "opacity-0")}
  />
);

/** A link to the store of the browser the visitor isn't using. */
export const OtherStoreLink = ({ browserIcon = false, className }: { browserIcon?: boolean; className?: string }) => {
  const { other, stores, ready } = useStoreAttributes();

  return (
    <a
      href={other.url}
      {...externalUrlOpts}
      className={cn("text-sm font-semibold underline-offset-4 hover:underline", browserIcon && "inline-flex items-center gap-2", className)}
    >
      {browserIcon && <BrowserIcon name={other.name} ready={ready} size={20} />}
      <BrowserText variants={stores.map(({ name }) => `Also on ${name}`)} current={`Also on ${other.name}`} ready={ready} />
    </a>
  );
};

/** Adds UpTab to the visitor's browser: the Firefox add-on, otherwise the Chrome Web Store. */
export const StoreButton = ({ tone = "on-light", showOther = false, browserIcon = false, className }: StoreButtonProps) => {
  const { url, name, label, stores, ready } = useStoreAttributes();

  const button = (
    <a
      href={url}
      {...externalUrlOpts}
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-full px-5 font-bold whitespace-nowrap transition duration-150 hover:-translate-y-px active:scale-[.97]",
        TONES[tone],
        className
      )}
    >
      {browserIcon && <BrowserIcon name={name} ready={ready} size={26} />}
      <BrowserText variants={stores.map(({ name }) => `Add to ${name}`)} current={label} ready={ready} />
    </a>
  );

  if (!showOther) {return button;}

  return (
    <div className="inline-flex flex-col items-center gap-2">
      {button}
      <OtherStoreLink className={tone === "on-light" ? "text-muted" : "text-dark-muted"} />
    </div>
  );
};
