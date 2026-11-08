import type { ReactNode } from "react";

const stroke = { stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

const FACES: Record<number, ReactNode> = {
  1: (
    <>
      <path d="M7.5 11.5L10.5 14.5L13.5 11.5M18.5 11.5L21.5 14.5L24.5 11.5" strokeWidth="2.4" {...stroke} />
      <path d="M12 22.5Q16 18.5 20 22.5" strokeWidth="2.2" {...stroke} />
    </>
  ),
  2: (
    <>
      <path d="M8 13.5H13M19 13.5H24" strokeWidth="2.4" {...stroke} />
      <path d="M12 21Q14 19.4 16 21Q18 22.6 20 21" strokeWidth="2.2" {...stroke} />
    </>
  ),
  3: (
    <>
      <circle cx="10.5" cy="13" r="2" fill="currentColor" />
      <circle cx="21.5" cy="13" r="2" fill="currentColor" />
      <path d="M12.5 20.5H19.5" strokeWidth="2.2" {...stroke} />
    </>
  ),
  4: (
    <>
      <path d="M7.5 14.5L10.5 11.5L13.5 14.5M18.5 14.5L21.5 11.5L24.5 14.5" strokeWidth="2.4" {...stroke} />
      <path d="M12.5 19.5Q16 23 19.5 19.5" strokeWidth="2.2" {...stroke} />
    </>
  ),
  5: (
    <>
      <path d="M10 17.5S2.5 12.8 2.5 7.6C2.5 5 4.4 3.2 6.7 3.2c1.4 0 2.6.7 3.3 1.8.7-1.1 1.9-1.8 3.3-1.8 2.3 0 4.2 1.8 4.2 4.4 0 5.2-7.5 9.9-7.5 9.9z" transform="translate(5 6.3) scale(.55)" fill="currentColor" />
      <path d="M10 17.5S2.5 12.8 2.5 7.6C2.5 5 4.4 3.2 6.7 3.2c1.4 0 2.6.7 3.3 1.8.7-1.1 1.9-1.8 3.3-1.8 2.3 0 4.2 1.8 4.2 4.4 0 5.2-7.5 9.9-7.5 9.9z" transform="translate(16 6.3) scale(.55)" fill="currentColor" />
      <path d="M11 18H21Q21 24.5 16 24.5Q11 24.5 11 18Z" fill="currentColor" />
    </>
  ),
};

/** The sky tile of a picked face and of the thank-you face. Defined once, referenced by id. */
export const SkyGradient = () => (
  <svg width="0" height="0" aria-hidden="true" className="absolute">
    <defs>
      <linearGradient id="fb-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#25B1FF" />
        <stop offset="1" stopColor="#1088CA" />
      </linearGradient>
    </defs>
  </svg>
);

/** Tile and ink colours come from feedback.css, which also swaps them when the face is picked. */
export const RatingFace = ({ rating }: { rating: number }) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" className="fb-face block h-auto w-full max-w-14">
    <rect className="fb-tile" width="32" height="32" rx="8" />
    {FACES[rating]}
  </svg>
);
