import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { externalUrlOpts } from "@/utils/externalUrlOpts";

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

const CREDIT_CLASS = "rounded-full bg-black/25 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm";

/** "Photo by …", linking to the photographer's page when the catalogue has one. */
const PhotoCredit = ({ author, link }: { author: string; link: string | null }) =>
  link ? (
    <a
      href={link}
      {...externalUrlOpts}
      className={`${CREDIT_CLASS} transition-colors hover:bg-black/55 hover:text-white`}
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
  // Every prebuilt rendition, so the browser picks the sharpest one for the screen
  const srcSet = photo.sources.map(({ url, width }) => `${new URL(url).pathname} ${width}w`).join(", ");

  return (
    <header className="relative flex min-h-svh flex-col overflow-hidden bg-[#8fc3d0]">
      {/* A plain img: next/image would re-encode the renditions, softening them */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={new URL(photo.sources.at(-1)!.url).pathname}
        srcSet={srcSet}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="ut-scrim absolute inset-0" aria-hidden="true" />

      <div className="relative flex flex-1 flex-col px-[clamp(1rem,4vw,3.5rem)] pt-24 pb-7">
        {/* Centred on mobile; from md up, bottom left with the credit on the right */}
        <div className="flex flex-1 flex-col items-center justify-center text-center md:items-start md:justify-end md:text-left">
          <div className="max-w-190">
            <h1 className="text-[clamp(2.75rem,6.4vw,5rem)] leading-display font-extrabold tracking-[-0.045em] text-balance text-black">
              Open a tab. Land somewhere <Lovely />
            </h1>
            <p className="mx-auto mt-6 max-w-130 text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-normal font-medium text-[#16222f] md:mx-0">
              UpTab turns every blank new tab into a tiny holiday. Gorgeous photos,
              the weather outside, your bookmarks within reach.
            </p>
          </div>
          <div className="mt-8 flex justify-center md:justify-start">{children}</div>
        </div>
        {photo.author && (
          <div className="flex justify-center pt-6 md:absolute md:right-[clamp(1rem,4vw,3.5rem)] md:bottom-7 md:pt-0">
            <PhotoCredit author={photo.author} link={photo.link} />
          </div>
        )}
      </div>
    </header>
  );
};
