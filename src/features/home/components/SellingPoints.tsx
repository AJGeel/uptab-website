import { Marquee } from "@/components/Marquee";

const sparkle = (
  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
    <path d="M5 0l1.2 3.8L10 5 6.2 6.2 5 10 3.8 6.2 0 5l3.8-1.2z" fill="#138CD0" />
  </svg>
);

/** The sky-tint strip of playful one-liners under the hero. */
export const SellingPoints = ({ photoCount }: { photoCount: number }) => {
  const points = [
    "No account, no fuss",
    "Zero snooping: your data stays home",
    `${photoCount} hand-picked views (and counting)`,
    "Every photographer gets the credit",
    "Weather icons that know bedtime",
    "3-day forecast, one click",
    "Plays nice with your bookmarks",
    "Shortlinks go where you drop them",
    "Add your cat. Or your holiday.",
    "Shortcuts for the mouse-averse",
    "Opens faster than you can blink",
    "Open source, out in the open",
  ];

  return (
    <section aria-label="At a glance" className="bg-tint text-black">
      <Marquee>
        {points.map((point) => (
          <span key={point} className="inline-flex items-center gap-7 py-5 pr-7 text-[15px] font-semibold whitespace-nowrap">
            {point}
            {sparkle}
          </span>
        ))}
      </Marquee>
    </section>
  );
};
