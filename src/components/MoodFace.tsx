import { useId } from "react";

import { cn } from "@/utils/cn";

export type Mood = "happy" | "wink" | "grin" | "whoa" | "hmm" | "party" | "sleepy";

type MoodFaceProps = {
  mood: Mood;
  size?: number;
  /** A subtle idle loop. Styles are in home.css. */
  animated?: boolean;
  className?: string;
};

const TITLES: Record<Mood, string> = {
  happy: "Happy face",
  wink: "Winking face",
  grin: "Grinning face",
  whoa: "Surprised face",
  hmm: "Unsure face",
  party: "Party face",
  sleepy: "Sleepy face",
};

const stroke = { stroke: "#fff", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Bits of confetti that burst above the party face. */
const CONFETTI = [
  { x: 5, y: 2, fill: "#BCE6FF", delay: "0s", drift: "-5px" },
  { x: 12, y: -1, fill: "#FFE08A", delay: "0.25s", drift: "-2px" },
  { x: 29, y: 4, fill: "#C4B5FD", delay: "0.5s", drift: "5px" },
  { x: 27, y: -1, fill: "#FFFFFF", delay: "0.15s", drift: "3px" },
  { x: 2, y: 9, fill: "#FFE08A", delay: "0.4s", drift: "-5px" },
];

/*
 * Each mood has its own way of acting. The parts (p-eyes, p-mouth, p-extra,
 * p-all) are what home.css animates, differently for every face.
 */
const FEATURES = {
  happy: (
    <>
      <circle className="p-extra" cx="8.5" cy="18.5" r="1.8" fill="#fff" opacity="0" />
      <circle className="p-extra" cx="23.5" cy="18.5" r="1.8" fill="#fff" opacity="0" />
      <path className="p-eyes f-eyes" d="M7.5 14.5L10.5 11.5L13.5 14.5M18.5 14.5L21.5 11.5L24.5 14.5" strokeWidth="2.6" {...stroke} />
      <path className="p-mouth" d="M12.5 19.5Q16 23 19.5 19.5" strokeWidth="2.2" {...stroke} />
    </>
  ),
  wink: (
    <>
      <path d="M7.5 14.5L10.5 11.5L13.5 14.5" strokeWidth="2.6" {...stroke} />
      <circle className="p-eyes f-blink" cx="21.5" cy="13" r="2.1" fill="#fff" />
      <path className="p-mouth" d="M12 19Q16.5 23.5 20.5 18.5" strokeWidth="2.2" {...stroke} />
      <path className="p-extra" d="M25.5 7.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" fill="#fff" opacity="0" />
    </>
  ),
  grin: (
    <>
      <path className="p-eyes" d="M7.5 13.5L10.5 10.5L13.5 13.5M18.5 13.5L21.5 10.5L24.5 13.5" strokeWidth="2.6" {...stroke} />
      <path className="p-mouth" d="M11 18H21Q21 24.5 16 24.5Q11 24.5 11 18Z" fill="#fff" />
    </>
  ),
  whoa: (
    <>
      <path className="p-eyes" d="M7.5 13.5L10.5 10.5L13.5 13.5M18.5 13.5L21.5 10.5L24.5 13.5" strokeWidth="2.6" {...stroke} />
      <circle className="p-mouth f-o" cx="16" cy="21" r="2.4" strokeWidth="2.2" stroke="#fff" fill="none" />
      <path className="p-extra" d="M16 -6.5v4.4M16 -0.4v.1" strokeWidth="1.8" {...stroke} stroke="#138CD0" opacity="0" />
    </>
  ),
  hmm: (
    <>
      <path className="p-eyes" d="M7.5 14.5L10.5 11.5L13.5 14.5M18.5 14.5L21.5 11.5L24.5 14.5" strokeWidth="2.6" {...stroke} />
      <path className="p-mouth f-hmm" d="M12 21Q14 19.4 16 21Q18 22.6 20 21" strokeWidth="2.2" {...stroke} />
      <path className="p-extra" d="M14.4 -4.8a1.7 1.7 0 1 1 2.4 1.5c-.7.4-.9.8-.9 1.5M16 1.2v.1" strokeWidth="1.7" {...stroke} stroke="#138CD0" opacity="0" />
    </>
  ),
  party: (
    <>
      {CONFETTI.map(({ x, y, fill, delay, drift }) => (
        <circle
          key={`${x}-${y}`}
          className="p-extra"
          cx={x}
          cy={y}
          r="1.2"
          fill={fill}
          style={{ animationDelay: delay, ["--cx" as string]: drift }}
        />
      ))}
      <g className="p-all">
        <g className="f-hat">
          <path d="M18.5 9.2L22.8 1.8L27.5 8.4Z" fill="#085884" />
          <circle cx="22.8" cy="1.8" r="1.3" fill="#fff" />
        </g>
        <path d="M7.5 16.5L10.5 13.5L13.5 16.5M18.5 16.5L21.5 13.5L24.5 16.5" strokeWidth="2.6" {...stroke} />
        <path d="M12.5 21Q16 24.5 19.5 21" strokeWidth="2.2" {...stroke} />
      </g>
    </>
  ),
  sleepy: (
    <>
      <path d="M7.5 14Q10.5 17 13.5 14M18.5 14Q21.5 17 24.5 14" stroke="#BCE6FF" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M14.5 20.5Q16 21.6 17.5 20.5" stroke="#BCE6FF" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M21.5 5H24.5L21.5 8H24.5" stroke="#25B1FF" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
} satisfies Record<Mood, React.ReactNode>;

/** The logo in a different expression. */
export const MoodFace = ({ mood, size = 48, animated = false, className }: MoodFaceProps) => {
  const gradientId = `face-${useId().replace(/:/g, "")}`;
  const night = mood === "sleepy";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label={TITLES[mood]}
      className={cn(animated && ["ut-face", `face-${mood}`], className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? "#0B2A5A" : "#25B1FF"} />
          <stop offset="1" stopColor={night ? "#020E2C" : "#1088CA"} />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${gradientId})`} />
      {FEATURES[mood]}
    </svg>
  );
};
