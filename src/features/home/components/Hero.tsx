import Image from "next/image";

import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { externalUrlOpts } from "@/utils/externalUrlOpts";

const HERO_MAX_WIDTH = 2560;

const SPARKLE = "M10 0l2.2 7.8L20 10l-7.8 2.2L10 20l-2.2-7.8L0 10l7.8-2.2z";
const HEART =
  "M10 17.5S2.5 12.8 2.5 7.6C2.5 5 4.4 3.2 6.7 3.2c1.4 0 2.6.7 3.3 1.8.7-1.1 1.9-1.8 3.3-1.8 2.3 0 4.2 1.8 4.2 4.4 0 5.2-7.5 9.9-7.5 9.9z";

/** Sparkles around "lovely" that pop, turn into hearts and float up. `delay` staggers them. */
const PARTICLES = [
  {
    position: { left: "-0.28em", top: "-0.12em" },
    size: "0.3em",
    delay: "0s",
    fill: "#25B1FF",
  },
  {
    position: { left: "36%", top: "-0.4em" },
    size: "0.24em",
    delay: "0.7s",
    fill: "#138CD0",
  },
  {
    position: { left: "66%", top: "-0.26em" },
    size: "0.32em",
    delay: "1.4s",
    fill: "#25B1FF",
  },
  {
    position: { right: "-0.42em", top: "-0.16em" },
    size: "0.42em",
    delay: "2.1s",
    fill: "#138CD0",
  },
  {
    position: { right: "-0.58em", top: "0.36em" },
    size: "0.22em",
    delay: "2.8s",
    fill: "#25B1FF",
  },
  {
    position: { left: "16%", top: "0.92em" },
    size: "0.2em",
    delay: "3.5s",
    fill: "#138CD0",
  },
];

const Lovely = () => (
  <span className="relative inline-block whitespace-nowrap">
    <span className="ut-lovely">lovely</span>
    {PARTICLES.map(({ position, size, delay, fill }) => (
      <span
        key={delay}
        className="ut-pt"
        aria-hidden="true"
        style={{
          ...position,
          width: size,
          height: size,
          ["--d" as string]: delay,
        }}
      >
        <svg className="ut-pt-s" viewBox="0 0 20 20">
          <path d={SPARKLE} fill={fill} />
        </svg>
        <svg className="ut-pt-h" viewBox="0 0 20 20">
          <path d={HEART} fill={fill} />
        </svg>
      </span>
    ))}
  </span>
);

const CREDIT_CLASS = "rounded-full bg-black/65 px-3.5 py-2 text-[13px] font-medium text-white backdrop-blur-md";

/** "Photo by …", linking to the photographer's page when the catalogue has one. */
const PhotoCredit = ({ author, link }: { author: string; link: string | null }) =>
  link ? (
    <a
      href={link}
      {...externalUrlOpts}
      className={`${CREDIT_CLASS} transition-colors hover:bg-white/70 hover:text-black`}
    >
      Photo by {author}
    </a>
  ) : (
    <p className={CREDIT_CLASS}>Photo by {author}</p>
  );

/** The full-bleed photo with the headline, over a light scrim, and the nav on top. */
export const Hero = ({
  photo,
  children,
}: {
  photo: BackgroundImage;
  children: React.ReactNode;
}) => {
  // Full-bleed, but not worth the 4K rendition
  const source =
    photo.sources.findLast(({ width }) => width <= HERO_MAX_WIDTH) ??
    photo.sources[0];

  return (
    <header className="relative flex min-h-svh flex-col overflow-hidden bg-[#8fc3d0]">
      <Image
        // A local path, so next/image can optimize it without remotePatterns
        src={new URL(source.url).pathname}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="ut-scrim absolute inset-0" aria-hidden="true" />

      <div className="relative flex max-w-190 flex-1 flex-col px-[clamp(1rem,4vw,3.5rem)] pt-[calc(6rem+clamp(2rem,7vw,6rem))]">
        <h1 className="text-[clamp(2.75rem,6.4vw,5rem)] leading-display font-extrabold tracking-[-0.045em] text-balance text-black">
          Open a tab. Land somewhere <Lovely />
        </h1>
        <p className="mt-6 max-w-130 text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-normal font-medium text-[#16222f]">
          UpTab turns every blank new tab into a tiny holiday. Gorgeous photos,
          the weather outside, your bookmarks within reach.
        </p>
        {children}
      </div>

      <div className="relative flex justify-end px-[clamp(1rem,4vw,3.5rem)] pt-12 pb-7">
        {photo.author && <PhotoCredit author={photo.author} link={photo.link} />}
      </div>
    </header>
  );
};
