import Link from "next/link";
import { useEffect, useRef } from "react";

import type { CATEGORIES } from "@/features/feedback/utils/schema";

const THANKS: Record<(typeof CATEGORIES)[number], string> = {
  bug: "Bug report received. I’m grabbing the fly swatter.",
  idea: "Your idea is filed under “ooh”. The good ideas tend to sneak into the changelog.",
  praise: "You just made someone’s day. Mine, specifically.",
  other: "Message received, loud and clear.",
};

const CONFETTI = [
  "left-[14%] top-[18%] size-2 rotate-20 rounded-xs bg-sky-400",
  "right-[16%] top-[14%] size-1.5 rounded-full bg-dark-text [animation-delay:-.8s]",
  "left-[22%] top-[40%] size-1.25 rounded-full bg-[#8cd4ff] [animation-delay:-1.4s]",
  "right-[22%] top-[38%] h-1 w-2.25 rounded-xs bg-sky-400 [animation-delay:-.4s]",
];

const buttonBase = "inline-flex min-h-12 items-center rounded-full px-5.5 text-base font-bold active:scale-[.97]";

type Props = {
  category: keyof typeof THANKS;
  /** Only passed when it's a valid address. */
  email: string;
  onAgain: () => void;
};

export const ThankYou = ({ category, email, onAgain }: Props) => {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => heading.current?.focus(), []);

  return (
    <section
      aria-live="polite"
      className="fb-in relative flex flex-col items-center gap-4 overflow-hidden rounded-[28px] bg-dark-surface px-[clamp(1.375rem,5vw,3rem)] py-[clamp(2rem,6vw,3.5rem)] text-center ring-1 ring-dark-line ring-inset"
    >
      {CONFETTI.map((className) => (
        <span key={className} aria-hidden="true" className={`fb-conf absolute ${className}`} />
      ))}
      <svg viewBox="0 0 32 32" role="img" aria-label="A happy face wearing a party hat" className="fb-hop size-26">
        <rect width="32" height="32" rx="8" fill="url(#fb-sky)" />
        <g className="fb-hat">
          <path d="M18.5 9.2L22.8 1.8L27.5 8.4Z" fill="#085884" />
          <circle cx="22.8" cy="1.8" r="1.3" fill="#fff" />
        </g>
        <path
          d="M7.5 16.5L10.5 13.5L13.5 16.5M18.5 16.5L21.5 13.5L24.5 16.5"
          stroke="#fff"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M11 20H21Q21 25.5 16 25.5Q11 25.5 11 20Z" fill="#fff" />
      </svg>
      <h2
        ref={heading}
        tabIndex={-1}
        className="mt-2 text-[clamp(1.875rem,5vw,2.5rem)] leading-none font-extrabold tracking-[-0.03em] text-white outline-none"
      >
        Got it. Thank you!
      </h2>
      <p className="max-w-105 text-[17px] leading-relaxed text-dark-body">{THANKS[category]}</p>
      <p className="max-w-105 text-[15px] leading-relaxed text-dark-muted">
        {email
          ? `I’ll reply to ${email} if there’s anything to say back.`
          : "No email left, so no reply, but it’s been read with a smile."}
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onAgain}
          className={`fb-ghost ${buttonBase} button-wipe text-dark-text ring-1 ring-[#3c5070] [--wipe-text:var(--color-dark-text)] [--wipe:linear-gradient(rgb(255_255_255/0.12),rgb(255_255_255/0.12))] ring-inset`}
        >
          Send another
        </button>
        <Link href="/" className={`fb-send ${buttonBase} wipe-rainbow bg-white button-wipe text-black`}>
          Back to UpTab
        </Link>
      </div>
    </section>
  );
};
