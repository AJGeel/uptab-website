import type { Mood } from "@/components/MoodFace";

type Shape = "heart" | "sparkle" | "drop" | "ray" | "question" | "confetti" | "dot";

type Burst = {
  shape: Shape;
  colors: string[];
  /** Angles in degrees, 0 pointing right and -90 up. Every particle flies out along one. */
  angles: number[];
  /** How far the particles fly, in pixels. */
  reach: [number, number];
  size: [number, number];
  /** Whether the particles spin as they fly. */
  spin?: boolean;
};

const range = (from: number, to: number, count: number) =>
  Array.from({ length: count }, (_, i) => from + ((to - from) * i) / Math.max(count - 1, 1));

/** What each face throws out when you hover its card. */
const BURSTS: Partial<Record<Mood, Burst>> = {
  happy: { shape: "heart", colors: ["#25B1FF", "#FF8FB8", "#138CD0"], angles: range(-165, -15, 9), reach: [38, 62], size: [11, 17] },
  wink: { shape: "sparkle", colors: ["#25B1FF", "#FFD166", "#8B7CF6"], angles: range(-180, 150, 10), reach: [34, 56], size: [10, 16], spin: true },
  grin: {
    shape: "drop",
    colors: ["#6CC4FF", "#25B1FF"],
    angles: [-160, -140, -120, -60, -40, -20, 160, 15, -175, -5],
    reach: [34, 58],
    size: [9, 13],
  },
  whoa: { shape: "ray", colors: ["#138CD0"], angles: range(-180, 150, 12), reach: [30, 44], size: [14, 18] },
  hmm: { shape: "question", colors: ["#138CD0", "#8B7CF6"], angles: range(-150, -30, 6), reach: [36, 60], size: [12, 18] },
  party: {
    shape: "confetti",
    colors: ["#25B1FF", "#FFD166", "#C4B5FD", "#FF8FB8", "#4CC28F"],
    angles: range(-180, 160, 18),
    reach: [40, 70],
    size: [8, 13],
    spin: true,
  },
};

/** The moods that have a burst. */
export const BURST_MOODS = Object.keys(BURSTS) as Mood[];

const SHAPES: Record<Shape, React.ReactNode> = {
  heart: <path d="M10 17.5S2.5 12.8 2.5 7.6C2.5 5 4.4 3.2 6.7 3.2c1.4 0 2.6.7 3.3 1.8.7-1.1 1.9-1.8 3.3-1.8 2.3 0 4.2 1.8 4.2 4.4 0 5.2-7.5 9.9-7.5 9.9z" fill="currentColor" />,
  sparkle: <path d="M10 0l2.2 7.8L20 10l-7.8 2.2L10 20l-2.2-7.8L0 10l7.8-2.2z" fill="currentColor" />,
  drop: <path d="M10 1C10 1 3 9.5 3 13.5a7 7 0 0 0 14 0C17 9.5 10 1 10 1z" fill="currentColor" />,
  ray: <rect x="8.5" y="0" width="3" height="20" rx="1.5" fill="currentColor" />,
  question: (
    <path d="M6.5 7a3.5 3.5 0 1 1 5.4 2.9C10.6 10.7 10 11.4 10 13M10 17.2v.1" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
  ),
  confetti: <rect x="3" y="6" width="14" height="8" rx="1.5" fill="currentColor" />,
  dot: <circle cx="10" cy="10" r="6" fill="currentColor" />,
};

const pick = <T,>(items: T[], index: number) => items[index % items.length];
const between = ([from, to]: [number, number], index: number, count: number) => from + ((to - from) * ((index * 7) % count)) / count;

/**
 * A burst of little shapes around a face, played (by globals.css) while an
 * ancestor has the `is-acting` class. `flipY` sends them down instead of up.
 * Fixed values, so server and client render the same.
 */
export const FaceBurst = ({ mood, flipY = false }: { mood: Mood; flipY?: boolean }) => {
  const burst = BURSTS[mood];

  if (!burst) {
    return null;
  }

  const count = burst.angles.length;

  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      {burst.angles.map((angle, index) => {
        const radians = (angle * Math.PI) / 180;
        const reach = between(burst.reach, index, count);
        const rotation = burst.shape === "ray" ? angle + 90 : burst.spin ? 120 + index * 40 : (index % 2 ? 1 : -1) * 14;

        return (
          <span
            key={angle}
            className="burst-p"
            style={{
              ["--x" as string]: `${(Math.cos(radians) * reach).toFixed(1)}px`,
              ["--y" as string]: `${((flipY ? -1 : 1) * Math.sin(radians) * reach).toFixed(1)}px`,
              ["--r" as string]: `${rotation}deg`,
              ["--d" as string]: `${(index % 4) * 0.04}s`,
              ["--s" as string]: `${between(burst.size, index, count).toFixed(1)}px`,
              color: pick(burst.colors, index),
            }}
          >
            <svg viewBox="0 0 20 20" className="size-full">
              {SHAPES[burst.shape]}
            </svg>
          </span>
        );
      })}
    </span>
  );
};
